const shelljs = require('shelljs')
const minimist = require('minimist')

const RELEASE_ALPHA = 'npm run release:alpha'
const RELEASE_OFFICIAL = 'npm run release:official'

readyGo()

function readyGo () {
  const args = parseArgs()
  callShell(args)
}

function parseArgs () {
  const args = process.argv.slice(2)
  const parsedArgs = minimist(args)

  return parsedArgs._.reduce((map, item) => {
    const [key, value] = item.split('=')
    map[key] = value
    return map
  }, {})
}

function callShell (args) {
  const { type, version } = args
  const releaseType = type === 'alpha' ? RELEASE_ALPHA : RELEASE_OFFICIAL

  shelljs.exec(`
    npm run transfer-packages
    cd packages/guard-shim-react && ${releaseType}
    cd ../../
    cd packages/guard-shim-react18 && ${releaseType}
    cd ../../
    cd packages/native-js-ui-components && npm ci && npm install --save @authing/guard-shim-react@${version} && npm run build:lib && ${releaseType}
    cd ../../
    cd packages/ng-ui-components && npm ci && npm install --save @authing/native-js-ui-components@${version} && npm run build:lib && ${releaseType}
    cd ../../
    cd packages/react-ui-components && npm ci && npm install --save @authing/native-js-ui-components@${version} && npm run build:lib && ${releaseType}
    cd ../../
    cd packages/react18-ui-components && npm ci && npm install --save @authing/guard-shim-react18@${version} && npm run build:lib && ${releaseType}
    cd ../../
    cd packages/vue-ui-components && npm ci && npm install --save @authing/native-js-ui-components@${version} && npm run build:lib && ${releaseType}
    cd ../../
    git commit -a -m "release: ${version} :rocket:"
  `, error => {
    if (error) {
      console.error('release:alpha error: ', error)
    }
  })
}
