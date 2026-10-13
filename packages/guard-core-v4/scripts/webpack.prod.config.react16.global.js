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
    entry: resolve('src/index.cdn.tsx'),
    output: {
      filename: 'guard.min.js',
      path: resolve('dist/global'),
      library: {
        name: 'GuardFactory',
        type: 'global'
      }
    },
    // CDN 入口导出可实例化的包装类，并内置 React 运行时。
    externals: {}
  }
)
