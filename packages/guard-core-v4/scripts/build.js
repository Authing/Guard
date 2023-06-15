const path = require('path')

const rm = require('rimraf')

const webpack = require('webpack')

const webpackReact16ESMConfig = require('./webpack.prod.config.react16.esm')

const webpackReact18ESMConfig = require('./webpack.prod.config.react18.esm')

const webpackGlobalConfig = require('./webpack.prod.config.react16.global')

try {
  rm.sync(path.resolve(__dirname, '../', 'dist'))
} catch (e) {
  console.error('\n\n build Authing Guard, failed to delete dist directory, please operate manually \n\n')
}

readyGo()

function readyGo () {
  webpack(webpackReact16ESMConfig, (error) => {
    if (error) {
      console.error('build Authing Guard v4 core esm 16 bundler error: ', error)
    }
  })

  webpack(webpackReact18ESMConfig, (error) => {
    if (error) {
      console.error('build Authing Guard v4 core esm 18 bundler error: ', error)
    }
  })

  webpack(webpackGlobalConfig, (error) => {
    if (error) {
      console.error('build Authing Guard v4 core global bundler error: ', error)
    }
  })
}
