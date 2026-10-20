const path = require('path')
const shelljs = require('shelljs')
const minimist = require('minimist')

const root = path.resolve(__dirname, '..')
const registry = 'https://registry.npmjs.org/'
const retryDelay = 10000
const packages = [
  { directory: 'guard-shim-react' },
  { directory: 'guard-shim-react18' },
  {
    directory: 'native-js-ui-components',
    dependency: '@authing/guard-shim-react'
  },
  {
    directory: 'ng-ui-components',
    dependency: '@authing/native-js-ui-components'
  },
  { directory: 'react-ui-components', dependency: '@authing/guard-shim-react' },
  {
    directory: 'react18-ui-components',
    dependency: '@authing/guard-shim-react18'
  },
  {
    directory: 'vue-ui-components',
    dependency: '@authing/native-js-ui-components'
  }
]

readyGo().catch(error => {
  console.error(`[release] Failed: ${error.message}`)
  if (error.output) {
    console.error(error.output)
  }
  if (process.env.GITHUB_ACTIONS) {
    const message = error.message
      .replace(/%/g, '%25')
      .replace(/\r/g, '%0D')
      .replace(/\n/g, '%0A')
    console.error(`::error title=Guard release failed::${message}`)
  }
  process.exitCode = 1
})

async function readyGo() {
  const args = minimist(process.argv.slice(2))._.reduce((map, item) => {
    const [key, value] = item.split('=')
    map[key] = value
    return map
  }, {})
  const { type, version } = args
  if (
    !['alpha', 'official'].includes(type) ||
    !/^\d+\.\d+\.\d+(?:-[\da-zA-Z.-]+)?$/.test(version || '')
  ) {
    throw new Error(
      'Expected type=alpha|official and an exact version=x.y.z[-prerelease]'
    )
  }

  // 校验全部包后才开始发布，避免版本填写错误造成部分发布。
  const plan = packages.map(item => {
    const cwd = path.join(root, 'packages', item.directory)
    const manifest = require(path.join(cwd, 'package.json'))
    if (manifest.version !== version) {
      throw new Error(
        `${manifest.name}: local version ${manifest.version} does not match ${version}`
      )
    }
    return { ...item, cwd, name: manifest.name }
  })

  const published = async name => {
    try {
      const result = run(
        `npm view ${name}@${version} version --json --prefer-online`,
        root,
        true
      )
      if (JSON.parse(result) !== version) {
        throw new Error(
          `Unexpected registry version for ${name}@${version}: ${result}`
        )
      }
      return true
    } catch (error) {
      if (/\b(?:E404|ETARGET)\b/.test(error.output || '')) {
        return false
      }
      throw error
    }
  }

  const waitForVersion = name =>
    retry(
      `Wait for ${name}@${version}`,
      async () => {
        if (!(await published(name))) {
          const error = new Error(
            `${name}@${version} is not yet visible on ${registry}`
          )
          error.retryable = true
          throw error
        }
      },
      12
    )

  for (const item of plan) {
    const { name, cwd, dependency } = item
    if (await retry(`Query ${name}@${version}`, () => published(name))) {
      console.log(`[release] Skip already published ${name}@${version}`)
      continue
    }

    if (dependency) {
      await waitForVersion(dependency)
      await retry(`Install ${name}`, () => run('npm ci', cwd))
      await retry(`Install ${dependency}@${version} for ${name}`, () =>
        run(
          `npm install --save-exact ${dependency}@${version} --prefer-online`,
          cwd
        )
      )
      await retry(`Build ${name}`, () => run('npm run build:lib', cwd))
    }

    await retry(`Publish ${name}@${version}`, async () => {
      // 重试前检查是否已成功，兼容上传成功但响应丢失以及重复补发。
      if (await published(name)) {
        console.log(`[release] Already published ${name}@${version}`)
        return
      }
      try {
        run(`npm run release:${type}`, cwd)
      } catch (error) {
        if (!(await published(name))) {
          throw error
        }
        console.log(
          `[release] Confirmed published after command failure: ${name}@${version}`
        )
      }
    })
    await waitForVersion(name)
  }

  console.log(
    `[release] All ${plan.length} packages are available at ${version}`
  )
}

function run(command, cwd, silent = false) {
  if (!silent) {
    console.log(`[release] ${path.basename(cwd)}: ${command}`)
  }
  const result = shelljs.exec(command, {
    cwd,
    silent,
    env: {
      ...process.env,
      npm_config_registry: registry,
      npm_config_prefer_online: 'true',
      npm_config_fetch_retries: '0',
      npm_config_fetch_timeout: '30000'
    }
  })
  if (result.code !== 0) {
    const error = new Error(
      `${path.basename(cwd)}: ${command} exited with code ${result.code}`
    )
    error.output = `${result.stdout || ''}\n${result.stderr || ''}`.trim()
    throw error
  }
  return result.stdout.trim()
}

function isRetryable(error) {
  return (
    error.retryable ||
    /\b(?:ETARGET|E404|E408|E429|E500|E502|E503|E504|ECONNRESET|ECONNREFUSED|ETIMEDOUT|ESOCKETTIMEDOUT|EAI_AGAIN|ENOTFOUND|ENETUNREACH|EINTEGRITY|FETCH_ERROR)\b/.test(
      error.output || ''
    )
  )
}

async function retry(label, action, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await action()
    } catch (error) {
      if (attempt === attempts || !isRetryable(error)) {
        error.message = `${label} failed (attempt ${attempt}/${attempts}): ${error.message}`
        throw error
      }
      console.warn(
        `[release] ${label}: ${error.message}; retry ${
          attempt + 1
        }/${attempts} in ${retryDelay / 1000}s`
      )
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }
}
