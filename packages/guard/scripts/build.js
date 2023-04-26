const path = require('path')

const rm = require('rimraf')

const webpack = require('webpack')

const webpackConfig = require('./webpack.config')

try {
  rm.sync(path.resolve(__dirname, '../', 'dist'))
} catch (e) {
  console.error('\n\n build Authing Guard, failed to delete dist directory, please operate manually \n\n')
}

readyGo()

function readyGo () {
  webpack(webpackConfig, (error) => {
    if (error) {
      console.error('build Authing Guard esm bundler error: ', error)
    }
  })
}
