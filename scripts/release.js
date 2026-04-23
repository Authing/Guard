const shelljs = require('shelljs')
const minimist = require('minimist')

const RELEASE_ALPHA = 'npm run release:alpha'
const RELEASE_OFFICIAL = 'npm run release:official'

readyGo()

function readyGo() {
  const args = parseArgs()
  callShell(args)
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

function callShell(args) {
  const { type, version } = args
  const releaseType = type === 'alpha' ? RELEASE_ALPHA : RELEASE_OFFICIAL
  const packageNames = [
    'guard-shim-react',
    'guard-shim-react18',
    'native-js-ui-components',
    'react-ui-components',
    'react18-ui-components',
    'vue-ui-components',
  ]

  if (!version) {
    console.error('missing required argument: version')
    process.exit(1)
  }

  if (type !== 'alpha' && type !== 'official') {
    console.error('invalid type, expected: alpha | official')
    process.exit(1)
  }

  const commands = [
    ...packageNames.map(
      packageName =>
        `cd packages/${packageName} && npm version ${version} --no-git-tag-version --allow-same-version`
    ),
    `cd packages/guard-shim-react && ${releaseType}`,
    `cd packages/guard-shim-react18 && ${releaseType}`,
    `sleep 15`, // 等待 npm registry 同步
    `cd packages/native-js-ui-components && npm install && npm install --save-exact @authing/guard-shim-react@${version} && npm run build:lib && ${releaseType}`,
    `cd packages/react-ui-components && npm install && npm install --save-exact @authing/guard-shim-react@${version} && npm run build:lib && ${releaseType}`,
    `cd packages/react18-ui-components && npm install && npm install --save-exact @authing/guard-shim-react18@${version} && npm run build:lib && ${releaseType}`,
    `cd packages/vue-ui-components && npm install && npm install --save-exact @authing/native-js-ui-components@${version} && npm run build:lib && ${releaseType}`,
  ]

  shelljs.set('-e')

  try {
    commands.forEach(command => {
      shelljs.exec(command)
    })

    const commitResult = shelljs.exec(`git commit -a -m "release: ${version} :rocket:"`, {
      silent: true,
    })

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
