const { merge } = require('webpack-merge')

const webpackBaseConfigFn = require('./webpack.base.config')

const reactVersion = '18'

module.exports = merge({}, webpackBaseConfigFn({
  reactVersion
}))
