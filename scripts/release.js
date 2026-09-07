const https = require('https')
const shelljs = require('shelljs')
const minimist = require('minimist')

const RELEASE_ALPHA = 'release:alpha'
const RELEASE_OFFICIAL = 'release:official'
const NPM_REGISTRY = normalizeRegistryUrl(
  process.env.NPM_REGISTRY || 'https://registry.npmjs.org/'
)
const NPMMIRROR_REGISTRY = normalizeRegistryUrl(
  process.env.NPMMIRROR_REGISTRY || 'https://registry.npmmirror.com/'
)
const NPMMIRROR_SYNC_HOST =
  process.env.NPMMIRROR_SYNC_HOST || 'registry-direct.npmmirror.com'
const NPM_PUBLISH_INITIAL_WAIT_MS = numberFromEnv(
  'NPM_PUBLISH_INITIAL_WAIT_MS',
  5_000
)
const NPM_PUBLISH_CHECK_INTERVAL_MS = numberFromEnv(
  'NPM_PUBLISH_CHECK_INTERVAL_MS',
  10_000
)
const NPM_PUBLISH_CHECK_RETRIES = numberFromEnv(
  'NPM_PUBLISH_CHECK_RETRIES',
  18
)
const NPMMIRROR_INITIAL_WAIT_MS = numberFromEnv(
  'NPMMIRROR_INITIAL_WAIT_MS',
  5_000
)
const NPMMIRROR_CHECK_INTERVAL_MS = numberFromEnv(
  'NPMMIRROR_CHECK_INTERVAL_MS',
  10_000
)
const NPMMIRROR_CHECK_RETRIES = numberFromEnv('NPMMIRROR_CHECK_RETRIES', 18)
const NPMMIRROR_SYNC_STRICT = process.env.NPMMIRROR_SYNC_STRICT === 'true'

readyGo().catch(error => {
  console.error('release failed', error)
  process.exit(1)
})

async function readyGo() {
  const args = parseArgs()
  await callShell(args)
}

function parseArgs() {
  const args = process.argv.slice(2)
  const parsedArgs = minimist(args)
  const mappedArgs = { ...parsedArgs }
  delete mappedArgs._

  return parsedArgs._.reduce((map, item) => {
    const [key, value] = item.split('=')
    map[key] = value
    return map
  }, mappedArgs)
}

async function callShell(args) {
  const { type } = args
  const version = normalizeVersion(args.version)
  const releaseScript = type === 'alpha' ? RELEASE_ALPHA : RELEASE_OFFICIAL
  const distTag = type === 'alpha' ? 'alpha' : 'latest'
  const packages = [
    {
      dir: 'guard-shim-react',
      name: '@authing/guard-shim-react',
    },
    {
      dir: 'guard-shim-react18',
      name: '@authing/guard-shim-react18',
    },
    {
      dir: 'native-js-ui-components',
      name: '@authing/native-js-ui-components',
      prepare: version =>
        `npm ci && npm install --save-exact @authing/guard-shim-react@${version} && npm run build:lib`,
    },
    {
      dir: 'react-ui-components',
      name: '@authing/react-ui-components',
      prepare: version =>
        `npm ci && npm install --save-exact @authing/guard-shim-react@${version} && npm run build:lib`,
    },
    {
      dir: 'react18-ui-components',
      name: '@authing/react18-ui-components',
      prepare: version =>
        `npm ci && npm install --save-exact @authing/guard-shim-react18@${version} && npm run build:lib`,
    },
    {
      dir: 'ng-ui-components',
      name: '@authing/ng-ui-components',
      prepare: version =>
        `npm ci && npm install --save-exact @authing/native-js-ui-components@${version} && npm run build:lib`,
    },
    {
      dir: 'vue-ui-components',
      name: '@authing/vue-ui-components',
      prepare: version =>
        `npm ci && npm install --save-exact @authing/native-js-ui-components@${version} && npm run build:lib`,
    },
  ]
  const versionPackageDirs = [
    'guard-core-v4',
    ...packages.map(({ dir }) => dir),
  ]

  if (!version) {
    console.error('missing required argument: version')
    process.exit(1)
  }

  if (!/^[0-9A-Za-z.+-]+$/.test(version)) {
    console.error(`invalid version: ${version}`)
    process.exit(1)
  }

  if (type !== 'alpha' && type !== 'official') {
    console.error('invalid type, expected: alpha | official')
    process.exit(1)
  }

  try {
    versionPackageDirs.forEach(dir => {
      const packageVersion = normalizeVersion(
        require(`${process.cwd()}/packages/${dir}/package.json`).version
      )

      if (packageVersion !== version) {
        throw new Error(
          `package version mismatch: packages/${dir}/package.json is ${packageVersion}, expected ${version}. Run lerna version before release`
        )
      }
    })

    for (const packageInfo of packages) {
      await releasePackage(packageInfo, {
        distTag,
        releaseScript,
        version,
      })
    }

    const commitResult = shelljs.exec(
      `git commit -a -m "release: ${version} :rocket:"`,
      {
        silent: true,
      }
    )

    if (commitResult.code !== 0) {
      console.log('release note: no changes to commit')
    } else {
      console.log('release note: commit created')
    }

    console.log(`release:${type} successfully 🚀`)
  } catch (error) {
    console.error(`release:${type} failed`, error)
    process.exit(1)
  }
}

async function releasePackage(packageInfo, options) {
  const { dir, name, prepare } = packageInfo
  const { distTag, releaseScript, version } = options

  if (prepare) {
    runInPackage(dir, prepare(version))
  }

  if (packageExists(name, version, NPM_REGISTRY)) {
    console.log(`${name}@${version} already exists on npm, skipping publish`)
  } else {
    const publishResult = execInPackage(
      dir,
      `npm run ${releaseScript} -- --registry=${NPM_REGISTRY}`
    )

    if (publishResult.code !== 0) {
      if (packageExists(name, version, NPM_REGISTRY)) {
        console.warn(
          `${name}@${version} is visible on npm after publish failure, continuing`
        )
      } else {
        throw new Error(`command failed: npm run ${releaseScript} in ${dir}`)
      }
    }
  }

  await waitForNpmPackage(name, version, {
    initialWaitMs: NPM_PUBLISH_INITIAL_WAIT_MS,
    intervalMs: NPM_PUBLISH_CHECK_INTERVAL_MS,
    registry: NPM_REGISTRY,
    registryName: 'npm',
    retries: NPM_PUBLISH_CHECK_RETRIES,
    strict: true,
  })

  ensureDistTag(name, version, distTag)
  await syncNpmmirrorPackage(name)
  await waitForNpmPackage(name, version, {
    initialWaitMs: NPMMIRROR_INITIAL_WAIT_MS,
    intervalMs: NPMMIRROR_CHECK_INTERVAL_MS,
    registry: NPMMIRROR_REGISTRY,
    registryName: 'npmmirror',
    retries: NPMMIRROR_CHECK_RETRIES,
    strict: NPMMIRROR_SYNC_STRICT,
  })
}

function ensureDistTag(packageName, version, distTag) {
  run(
    `npm dist-tag add ${packageName}@${version} ${distTag} --registry=${NPM_REGISTRY}`
  )
}

function runInPackage(dir, command) {
  return run(`cd packages/${dir} && ${command}`)
}

function execInPackage(dir, command) {
  return exec(`cd packages/${dir} && ${command}`)
}

function run(command) {
  const result = exec(command)
  if (result.code !== 0) {
    throw new Error(`command failed: ${command}`)
  }
  return result
}

function exec(command, options = {}) {
  return shelljs.exec(command, {
    ...options,
    env: {
      ...process.env,
      NPM_CONFIG_REGISTRY: NPM_REGISTRY,
      npm_config_registry: NPM_REGISTRY,
    },
  })
}

function packageExists(packageName, version, registry) {
  const result = shelljs.exec(
    `npm view ${packageName}@${version} version --prefer-online --registry=${registry}`,
    {
      env: {
        ...process.env,
        NPM_CONFIG_REGISTRY: registry,
        npm_config_registry: registry,
      },
      silent: true,
    }
  )

  return result.code === 0 && normalizeVersion(result.stdout.trim()) === version
}

async function waitForNpmPackage(packageName, version, options) {
  const {
    initialWaitMs,
    intervalMs,
    registry,
    registryName,
    retries,
    strict,
  } = options

  console.log(
    `waiting for ${packageName}@${version} to be available on ${registryName}...`
  )

  if (initialWaitMs > 0) {
    await sleep(initialWaitMs)
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    if (packageExists(packageName, version, registry)) {
      console.log(`${packageName}@${version} is available on ${registryName}`)
      return true
    }

    if (attempt < retries) {
      console.log(
        `${packageName}@${version} is not visible on ${registryName} yet, retrying (${attempt}/${retries})...`
      )
      await sleep(intervalMs)
    }
  }

  const message = `${packageName}@${version} was not available on ${registryName} after ${retries} checks`

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
      hostname: NPMMIRROR_SYNC_HOST,
      method: 'PUT',
      path: `/-/package/${packageName}/syncs`,
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
      res.on('data', chunk => {
        output += chunk
      })
      res.on('end', () => {
        try {
          const data = JSON.parse(output.trim())

          if (res.statusCode >= 400) {
            reject(new Error(JSON.stringify(data)))
            return
          }

          resolve(data)
        } catch (error) {
          reject(error)
        }
      })
    })

    req.setTimeout(30_000, () => {
      req.destroy(new Error('request timed out'))
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
  return Number.isFinite(value) ? value : fallback
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
