const { merge } = require('webpack-merge')

const webpackBaseConfigFn = require('./webpack.base.config')

const { resolve } = require('./utils')

const reactVersion = '16'

module.exports = merge({}, webpackBaseConfigFn({
  reactVersion
}), {
  mode: 'development',
  entry: resolve('example.tsx'),
  resolve: {
    fallback: {
      fs: false
    }
  },
  devServer: {
    host: 'localhost',
    port: 8090,
    hot: true,
    open: true
  }
})
