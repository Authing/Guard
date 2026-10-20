const path = require('path')
const fs = require('fs')
const https = require('https')
const { urlToHttpOptions } = require('url')
const shelljs = require('shelljs')
const minimist = require('minimist')

const root = path.resolve(__dirname, '..')
const registry = normalizeRegistryUrl(
  process.env.NPM_REGISTRY || 'https://registry.npmjs.org/'
)
const mirrorRegistry = normalizeRegistryUrl(
  process.env.NPMMIRROR_REGISTRY || 'https://registry.npmmirror.com/'
)
const mirrorSyncHost =
  process.env.NPMMIRROR_SYNC_HOST || 'registry-direct.npmmirror.com'
const retryDelay = 10000
const packages = [
  { directory: 'guard-shim-react' },
  { directory: 'guard-shim-react18' },
  {
    directory: 'native-js-ui-components',
    dependency: '@authing/guard-shim-react'
  },
  { directory: 'react-ui-components', dependency: '@authing/guard-shim-react' },
  {
    directory: 'react18-ui-components',
    dependency: '@authing/guard-shim-react18'
  },
  {
    directory: 'ng-ui-components',
    dependency: '@authing/native-js-ui-components'
  },
  {
    directory: 'vue-ui-components',
    dependency: '@authing/native-js-ui-components'
  }
]

if (require.main === module) {
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
}

async function readyGo() {
  const parsed = minimist(process.argv.slice(2))
  const { _, ...options } = parsed
  const args = _.reduce((map, item) => {
    const [key, value] = item.split('=')
    map[key] = value
    return map
  }, options)
  const type = args.type
  const version = normalizeVersion(args.version || args['check-version'])
  if (args['check-version']) {
    checkReleaseVersion(version)
    console.log(`all package versions match ${version}`)
    return
  }
  if (
    !['alpha', 'official'].includes(type) ||
    !/^\d+\.\d+\.\d+(?:-[\da-zA-Z.-]+)?$/.test(version || '')
  ) {
    throw new Error(
      'Expected type=alpha|official and an exact version=x.y.z[-prerelease]'
    )
  }

  // 同 v4：构建产物、lerna 和所有组件必须使用同一版本。
  checkReleaseVersion(version)
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

  const published = name => packageExists(name, version, registry)
  const waitForVersion = name =>
    waitForNpmPackage(name, version, {
      initialWaitMs: numberFromEnv('NPM_PUBLISH_INITIAL_WAIT_MS', 5000),
      intervalMs: numberFromEnv('NPM_PUBLISH_CHECK_INTERVAL_MS', 10000),
      registry,
      registryName: 'npm',
      retries: numberFromEnv('NPM_PUBLISH_CHECK_RETRIES', 60),
      strict: true
    })

  for (const item of plan) {
    const { name, cwd, dependency } = item
    if (await retry(`Query ${name}@${version}`, () => published(name))) {
      console.log(`[release] Skip already published ${name}@${version}`)
    } else {
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
        if (await published(name)) {
          console.log(`[release] Already published ${name}@${version}`)
          return
        }
        try {
          run(`npm run release:${type} -- --registry=${registry}`, cwd)
        } catch (error) {
          if (!(await published(name))) {
            throw error
          }
          console.log(
            `[release] Confirmed published after command failure: ${name}@${version}`
          )
        }
      })
    }
    await waitForVersion(name)
    const distTag = type === 'alpha' ? 'alpha' : 'latest'
    await retry(`Update ${name} dist-tag`, () =>
      run(
        `npm dist-tag add ${name}@${version} ${distTag} --registry=${registry}`,
        root
      )
    )
    await syncNpmmirrorPackage(name)
    await waitForNpmPackage(name, version, {
      initialWaitMs: numberFromEnv('NPMMIRROR_INITIAL_WAIT_MS', 5000),
      intervalMs: numberFromEnv('NPMMIRROR_CHECK_INTERVAL_MS', 10000),
      registry: mirrorRegistry,
      registryName: 'npmmirror',
      retries: numberFromEnv('NPMMIRROR_CHECK_RETRIES', 18),
      strict: process.env.NPMMIRROR_SYNC_STRICT === 'true'
    })
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
      NPM_CONFIG_REGISTRY: registry,
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
    [408, 429, 500, 502, 503, 504].includes(error.statusCode) ||
    /\b(?:ETARGET|E404|E408|E429|E500|E502|E503|E504|ECONNRESET|ECONNREFUSED|ETIMEDOUT|ESOCKETTIMEDOUT|EAI_AGAIN|ENOTFOUND|ENETUNREACH|EINTEGRITY|FETCH_ERROR)\b/.test(
      [error.code, error.output, error.message].join(' ')
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

async function packageExists(packageName, version, registry) {
  // These packages are public. Read the exact version without inheriting npm
  // credentials, CLI output settings, or a cached pre-publish packument.
  const url = new URL(
    `${encodeURIComponent(packageName)}/${encodeURIComponent(version)}`,
    registry
  )
  url.searchParams.set('release-check', Date.now().toString())

  try {
    const data = await requestJson({
      ...urlToHttpOptions(url),
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

    if (data.name !== packageName || data.version !== version) {
      throw new Error(
        `unexpected package metadata for ${packageName}@${version}`
      )
    }

    return true
  } catch (error) {
    if (error.statusCode === 404) {
      return false
    }
    throw error
  }
}

async function waitForNpmPackage(packageName, version, options) {
  const { initialWaitMs, intervalMs, registry, registryName, retries, strict } =
    options

  console.log(
    `waiting for ${packageName}@${version} to be available on ${registryName}...`
  )

  if (initialWaitMs > 0) {
    await sleep(initialWaitMs)
  }

  let lastError = 'HTTP 404: version not found'
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (await packageExists(packageName, version, registry)) {
        console.log(`${packageName}@${version} is available on ${registryName}`)
        return true
      }
      lastError = 'HTTP 404: version not found'
    } catch (error) {
      if (strict && !isRetryable(error)) throw error
      lastError = error.message
      console.warn(`${registryName} check failed: ${lastError}`)
    }

    if (attempt < retries) {
      console.log(
        `${packageName}@${version} is not visible on ${registryName} yet, retrying (${attempt}/${retries})...`
      )
      await sleep(intervalMs)
    }
  }

  const message = `${packageName}@${version} was not available on ${registryName} after ${retries} checks (${lastError})`

  if (strict) {
    throw new Error(message)
  }

  console.warn(`${message}, continuing`)
  return false
}

async function syncNpmmirrorPackage(packageName) {
  console.log(`triggering npmmirror sync for ${packageName}...`)

  try {
    const data = await requestJson({
      hostname: mirrorSyncHost,
      method: 'PUT',
      path: `/-/package/${packageName}/syncs`
    })

    if (data.ok !== true) {
      console.warn(
        `npmmirror sync request for ${packageName} returned: ${JSON.stringify(
          data
        )}`
      )
      return
    }

    console.log(
      `npmmirror sync queued for ${packageName}: ${data.id || 'unknown id'}`
    )
  } catch (error) {
    console.warn(`npmmirror sync request for ${packageName} failed`, error)
  }
}

function requestJson(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let output = ''

      res.setEncoding('utf8')
      res.on('error', reject)
      res.on('data', chunk => {
        output += chunk
      })
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const error = new Error(
            `HTTP ${res.statusCode} ${res.statusMessage || ''}`.trim()
          )
          error.statusCode = res.statusCode
          reject(error)
          return
        }

        try {
          const data = JSON.parse(output.trim())
          resolve(data)
        } catch (error) {
          reject(error)
        }
      })
    })

    req.setTimeout(30_000, () => {
      const error = new Error('request timed out')
      error.code = 'ETIMEDOUT'
      req.destroy(error)
    })
    req.on('error', reject)
    req.end()
  })
}

function normalizeVersion(version) {
  return String(version || '').replace(/^v/i, '')
}

function normalizeRegistryUrl(registry) {
  return registry.endsWith('/') ? registry : `${registry}/`
}

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name])
  return Number.isInteger(value) &&
    value >= 0 &&
    (!name.endsWith('RETRIES') || value > 0)
    ? value
    : fallback
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function checkReleaseVersion(version, rootDir = path.resolve(__dirname, '..')) {
  if (!version) {
    throw new Error('missing required release version')
  }

  const packageFiles = fs
    .readdirSync(path.join(rootDir, 'packages'))
    .map(dir => path.join('packages', dir, 'package.json'))
    .filter(file => fs.existsSync(path.join(rootDir, file)))
  const mismatches = ['lerna.json', ...packageFiles].flatMap(file => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(rootDir, file), 'utf8')
    )
    return manifest.version === version ? [] : [`${file}: ${manifest.version}`]
  })

  if (mismatches.length) {
    throw new Error(
      `release version mismatch (expected ${version}):\n${mismatches.join(
        '\n'
      )}\n` + 'Run lerna version with --force-publish before building the core.'
    )
  }
}

module.exports = { packageExists, waitForNpmPackage, checkReleaseVersion }
