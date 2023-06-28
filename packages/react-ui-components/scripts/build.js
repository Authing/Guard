const path = require('path')

const rm = require('rimraf')

const webpack = require('webpack')

const webpackConfig = require('./webpack.config')

try {
  rm.sync(path.resolve(__dirname, '../', 'lib'))
} catch (e) {
  console.error('\n\n build Authing Guard React, failed to delete lib directory, please operate manually \n\n')
}

readyGo()

function readyGo () {
  webpack(webpackConfig, (error) => {
    if (error) {
      console.error('build Authing Guard React esm bundler error: ', error)
    }
  })
}
