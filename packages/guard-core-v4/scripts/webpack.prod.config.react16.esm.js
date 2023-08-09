const { merge } = require('webpack-merge')

const webpackBaseConfigFn = require('./webpack.base.config')

const webpackProdBaseConfigFn = require('./webpack.prod.base.config')

const reactVersion = '16'

module.exports = merge(
  {}, 
  webpackBaseConfigFn({
    reactVersion
  }),
  webpackProdBaseConfigFn({
    reactVersion
  })
)
