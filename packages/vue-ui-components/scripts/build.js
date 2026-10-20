const path = require('path')

const rm = require('rimraf')

const webpack = require('webpack')

const webpackConfig = require('./webpack.config')

rm.sync(path.resolve(__dirname, '../', 'lib'))

readyGo()

function readyGo() {
  webpack(webpackConfig, (error, stats) => {
    if (error || !stats || stats.hasErrors()) {
      console.error(
        'build Authing Guard Vue esm bundler error: ',
        error || stats?.toString({ all: false, errors: true })
      )
      process.exitCode = 1
    }
  })
}
