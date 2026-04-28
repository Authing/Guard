const { merge } = require('webpack-merge')

const webpackBaseConfigFn = require('./webpack.base.config')

const webpackProdBaseConfigFn = require('./webpack.prod.base.config')

const { resolve } = require('./utils')

const reactVersion = '16'

module.exports = merge(
  {},
  webpackBaseConfigFn(
    {
      reactVersion
    }
  ),
  webpackProdBaseConfigFn({
    reactVersion
  }),
  {
    output: {
      filename: 'guard.min.js',
      path: resolve('dist/global'),
      library: {
        name: 'GuardFactory',
        type: 'global'
      }
    },
    // 移除 externals，将 React 打包进 bundle（类似 v5.2.0）
    externals: {}
  }
)
