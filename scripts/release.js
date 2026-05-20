const shelljs = require('shelljs')
const minimist = require('minimist')

const RELEASE_ALPHA = 'npm run release:alpha'
const RELEASE_OFFICIAL = 'npm run release:official'
const NPM_PUBLISH_INITIAL_WAIT_MS = Number(
  process.env.NPM_PUBLISH_INITIAL_WAIT_MS ?? 10_000
)
const NPM_PUBLISH_CHECK_INTERVAL_MS = Number(
  process.env.NPM_PUBLISH_CHECK_INTERVAL_MS ?? 10_000
)
const NPM_PUBLISH_CHECK_RETRIES = Number(
  process.env.NPM_PUBLISH_CHECK_RETRIES ?? 12
)

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

  return parsedArgs._.reduce((map, item) => {
    const [key, value] = item.split('=')
    map[key] = value
    return map
  }, {})
}

async function callShell(args) {
  const { type, version } = args
  const releaseType = type === 'alpha' ? RELEASE_ALPHA : RELEASE_OFFICIAL
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
    },
    {
      dir: 'react-ui-components',
      name: '@authing/react-ui-components',
    },
    {
      dir: 'react18-ui-components',
      name: '@authing/react18-ui-components',
    },
    {
      dir: 'ng-ui-components',
      name: '@authing/ng-ui-components',
    },
    {
      dir: 'vue-ui-components',
      name: '@authing/vue-ui-components',
    },
  ]

  if (!version) {
    console.error('missing required argument: version')
    process.exit(1)
  }

  if (type !== 'alpha' && type !== 'official') {
    console.error('invalid type, expected: alpha | official')
    process.exit(1)
  }

  try {
    packages.forEach(({ dir }) => {
      run(
        `cd packages/${dir} && npm version ${version} --no-git-tag-version --allow-same-version`
      )
    })

    run(`cd packages/guard-shim-react && ${releaseType}`)
    await waitForNpmPackage('@authing/guard-shim-react', version)

    run(`cd packages/guard-shim-react18 && ${releaseType}`)
    await waitForNpmPackage('@authing/guard-shim-react18', version)

    run(
      `cd packages/native-js-ui-components && npm ci && npm install --save-exact @authing/guard-shim-react@${version} && npm run build:lib && ${releaseType}`
    )
    await waitForNpmPackage('@authing/native-js-ui-components', version)

    run(
      `cd packages/react-ui-components && npm ci && npm install --save-exact @authing/guard-shim-react@${version} && npm run build:lib && ${releaseType}`
    )
    run(
      `cd packages/react18-ui-components && npm ci && npm install --save-exact @authing/guard-shim-react18@${version} && npm run build:lib && ${releaseType}`
    )
    run(
      `cd packages/ng-ui-components && npm ci && npm install --save-exact @authing/native-js-ui-components@${version} && npm run build:lib && ${releaseType}`
    )
    run(
      `cd packages/vue-ui-components && npm ci && npm install --save-exact @authing/native-js-ui-components@${version} && npm run build:lib && ${releaseType}`
    )

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

function run(command) {
  const result = shelljs.exec(command)
  if (result.code !== 0) {
    throw new Error(`command failed: ${command}`)
  }
  return result
}

async function waitForNpmPackage(packageName, version) {
  console.log(
    `waiting for ${packageName}@${version} to be available on npm registry...`
  )

  if (NPM_PUBLISH_INITIAL_WAIT_MS > 0) {
    await sleep(NPM_PUBLISH_INITIAL_WAIT_MS)
  }

  for (let attempt = 1; attempt <= NPM_PUBLISH_CHECK_RETRIES; attempt++) {
    const result = shelljs.exec(`npm view ${packageName}@${version} version`, {
      silent: true,
    })

    if (result.code === 0 && result.stdout.trim() === version) {
      console.log(`${packageName}@${version} is available`)
      return
    }

    if (attempt < NPM_PUBLISH_CHECK_RETRIES) {
      console.log(
        `${packageName}@${version} is not visible yet, retrying (${attempt}/${NPM_PUBLISH_CHECK_RETRIES})...`
      )
      await sleep(NPM_PUBLISH_CHECK_INTERVAL_MS)
    }
  }

  throw new Error(
    `${packageName}@${version} was not available after ${NPM_PUBLISH_CHECK_RETRIES} checks`
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
