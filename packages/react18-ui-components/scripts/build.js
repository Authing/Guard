const path = require('path')

const rm = require('rimraf')

const webpack = require('webpack')

const webpackConfig = require('./webpack.config')

try {
  rm.sync(path.resolve(__dirname, '../', 'lib'))
} catch (e) {
  console.error('\n\n build Authing Guard, failed to delete lib directory, please operate manually \n\n')
}

readyGo()

function readyGo () {
  webpack(webpackConfig, (error, stats) => {
    if (error) {
      console.error('build Authing Guard React 18 esm bundler error: ', error)
      process.exit(1)
    }
    if (stats.hasErrors()) {
      console.error(stats.toString('errors-only'))
      process.exit(1)
    }
  })
}
