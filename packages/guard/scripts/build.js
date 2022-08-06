const path = require('path')
const rm = require('rimraf')
const webpack = require('webpack')
const webpackEsmBundlerConfig = require('./webpack.esm.config')
const webpackGlobalConfig = require('./webpack.global.config')

try {
  rm.sync(path.resolve(__dirname, '../', 'dist'))
} catch (e) {
  console.error('\n\n build guard, failed to delete dist directory, please operate manually \n\n')
}

readyGo()

function readyGo () {
  webpack(webpackEsmBundlerConfig, (error) => {
    if (error) {
      console.error('build guard.js esm bundler error: ', error)
    }
  })
  webpack(webpackGlobalConfig, (error) => {
    if (error) {
      console.error('build guard.js global error: ', error)
    }
  })
}
