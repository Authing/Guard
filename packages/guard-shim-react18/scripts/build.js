const path = require('path')
const rm = require('rimraf')
const webpack = require('webpack')
const webpackEsmBundlerConfig = require('./webpack.esm.config')

try {
  rm.sync(path.resolve(__dirname, '../', 'dist'))
} catch (e) {
  console.error('\n\n build guard, failed to delete dist directory, please operate manually \n\n')
}

readyGo()

function readyGo () {
  webpack(webpackEsmBundlerConfig, (error, stats) => {
    if (error) {
      console.error('build guard-shim-react18 esm bundler error: ', error)
    }
  })
}
