const path = require('path')
const rm = require('rimraf')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

try {
  rm.sync(path.resolve(__dirname, '../', 'dist'))
} catch (e) {
  console.error('\n\n build guard-react, failed to delete dist directory, please operate manually \n\n')
}

readyGo()

function readyGo () {
  webpack(webpackConfig, (error) => {
    if (error) {
      console.error('build guard-react esm bundler error: ', error)
    }
  })
}
