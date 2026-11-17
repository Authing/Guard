const https = require('https')
const shelljs = require('shelljs')
const minimist = require('minimist')

const RELEASE_ALPHA = 'npm run release:alpha'
const RELEASE_OFFICIAL = 'npm run release:official'
const NPM_REGISTRY = 'https://registry.npmjs.org/'

if (require.main === module) {
  callShell(parseArgs()).catch(error => {
    console.error('release failed', error)
    process.exitCode = 1
  })
}

function parseArgs() {
  const args = process.argv.slice(2)
  const parsedArgs = minimist(args)

  return parsedArgs._.reduce((map, item) => {
    const [key, value] = item.split('=')
    map[key] = value
    return map
  }, {})
}

async function callShell(args) {
  const { type, version } = args
  const releaseType = type === 'alpha' ? RELEASE_ALPHA : RELEASE_OFFICIAL
  const packageNames = [
    'guard-shim-react',
    'guard-shim-react18',
    'native-js-ui-components',
    'react-ui-components',
    'react18-ui-components',
    'ng-ui-components',
    'vue-ui-components',
  ]
  const dependencies = {
    'native-js-ui-components': '@authing/guard-shim-react',
    'react-ui-components': '@authing/guard-shim-react',
    'react18-ui-components': '@authing/guard-shim-react18',
    'ng-ui-components': '@authing/native-js-ui-components',
    'vue-ui-components': '@authing/native-js-ui-components',
  }

  if (!version) {
    console.error('missing required argument: version')
    process.exit(1)
  }

  if (type !== 'alpha' && type !== 'official') {
    console.error('invalid type, expected: alpha | official')
    process.exit(1)
  }

  try {
    for (const packageName of packageNames) {
      run(`cd packages/${packageName} && npm version ${version} --no-git-tag-version --allow-same-version`)
    }

    for (const packageName of packageNames) {
      const name = `@authing/${packageName}`
      if (await packageExists(name, version)) {
        console.log(`${name}@${version} already exists on npm, skipping publish`)
      } else {
        const dependency = dependencies[packageName]
        if (dependency) {
          run(`cd packages/${packageName} && npm ci && npm install --save-exact ${dependency}@${version} && npm run build:lib`)
        }
        run(`cd packages/${packageName} && ${releaseType} -- --registry=${NPM_REGISTRY}`)
      }
      // 下游包只能在依赖版本可查询后构建，不能依赖固定等待时间。
      await waitForNpmPackage(name, version)
    }

    if (run('git status --porcelain --untracked-files=no', { silent: true }).stdout.trim() === '') {
      console.log('release note: no changes to commit')
    } else {
      run(`git commit -a -m "release: ${version} :rocket:"`)
      console.log('release note: commit created')
    }

    console.log(`release:${type} successfully 🚀`)
  } catch (error) {
    console.error(`release:${type} failed`, error)
    process.exitCode = 1
  }
}

function run(command, options = {}) {
  const result = shelljs.exec(command, {
    ...options,
    env: {
      ...process.env,
      NPM_CONFIG_REGISTRY: NPM_REGISTRY,
      npm_config_registry: NPM_REGISTRY,
      npm_config_prefer_online: 'true',
    },
  })
  if (result.code !== 0) {
    throw new Error(`command failed: ${command}`)
  }
  return result
}

function packageExists(packageName, version) {
  // 沿用 v4：查询精确版本，避免 npm CLI 复用发布前缓存的元数据。
  const url = new URL(`${encodeURIComponent(packageName)}/${encodeURIComponent(version)}`, NPM_REGISTRY)
  url.searchParams.set('release-check', Date.now().toString())
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
    }, res => {
      let body = ''
      res.setEncoding('utf8')
      res.on('error', reject)
      res.on('data', chunk => { body += chunk })
      res.on('end', () => {
        if (res.statusCode === 404) return resolve(false)
        if (res.statusCode !== 200) {
          return reject(new Error(`npm registry HTTP ${res.statusCode}`))
        }
        try {
          const data = JSON.parse(body)
          if (data.name !== packageName || data.version !== version) {
            throw new Error(`unexpected package metadata for ${packageName}@${version}`)
          }
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    })
    req.setTimeout(30_000, () => req.destroy(new Error('npm registry request timed out')))
    req.on('error', reject)
  })
}

async function waitForNpmPackage(packageName, version, { retries = 60, intervalMs = 10_000 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (await packageExists(packageName, version)) return
    } catch (error) {
      console.warn(error.message)
    }
    if (attempt < retries) {
      console.log(`waiting for ${packageName}@${version} on npm (${attempt}/${retries})...`)
      await new Promise(resolve => setTimeout(resolve, intervalMs))
    }
  }
  throw new Error(`${packageName}@${version} is not available on npm after ${retries} checks`)
}

module.exports = { packageExists, waitForNpmPackage }
