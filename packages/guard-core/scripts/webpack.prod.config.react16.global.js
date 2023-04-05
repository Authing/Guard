const { merge } = require('webpack-merge')

const webpackBaseConfigFn = require('./webpack.base.config')

const { resolve } = require('./utils')

const reactVersion = '16'

module.exports = merge({}, webpackBaseConfigFn({
  reactVersion
}), {
  output: {
    filename: 'guard.min.js',
    path: resolve('dist/global'),
    library: {
      name: 'AuthingGuardFactory',
      type: 'global'
    }
  }
})