const path = require('path')

const rm = require('rimraf')

const webpack = require('webpack')

const webpackReact16ESMConfig = require('./webpack.prod.config.react16.esm')

const webpackReact18ESMConfig = require('./webpack.prod.config.react18.esm')

const webpackGlobalConfig = require('./webpack.prod.config.react16.global')

rm.sync(path.resolve(__dirname, '../', 'dist'))

readyGo()

function readyGo() {
  webpack(webpackReact16ESMConfig, onBuildComplete('esm 16'))

  webpack(webpackReact18ESMConfig, onBuildComplete('esm 18'))

  webpack(webpackGlobalConfig, onBuildComplete('global'))
}

function onBuildComplete(bundle) {
  return (error, stats) => {
    if (error || !stats || stats.hasErrors()) {
      console.error(
        `build Authing Guard core ${bundle} bundler error: `,
        error || stats?.toString({ all: false, errors: true })
      )
      process.exitCode = 1
    }
  }
}
