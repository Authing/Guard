const shelljs = require('shelljs')

const RELEASE_ALPHA = 'npm run release:alpha'

shelljs.exec(`
  cd packages/guard-shim-react && ${RELEASE_ALPHA}
  cd packages/guard-shim-react18 && ${RELEASE_ALPHA}
  cd packages/native-js-ui-components && npm ci && ${RELEASE_ALPHA}
  cd packages/ng-ui-components && npm ci && ${RELEASE_ALPHA}
  cd packages/react-ui-components && npm ci && ${RELEASE_ALPHA}
  cd packages/react18-ui-components && npm ci && ${RELEASE_ALPHA}
  cd packages/vue-ui-components && npm ci && ${RELEASE_ALPHA}
`, error => {
  if (error) {
    console.error('release:alpha error: ', error)
  }
})
