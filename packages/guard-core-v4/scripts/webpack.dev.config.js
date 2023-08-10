const { merge } = require('webpack-merge')

const webpackBaseConfigFn = require('./webpack.base.config')

const { resolve } = require('./utils')

const reactVersion = '16'

module.exports = merge({}, webpackBaseConfigFn({
  reactVersion
}), {
  mode: 'development',
  entry: resolve('example.tsx'),
  output: {
    filename: 'guard.min.js',
    path: resolve(`dist/esm-react${reactVersion}`),
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    fallback: {
      fs: false,
      crypto: false
    }
  },
  devServer: {
    host: 'localhost',
    port: 8090,
    hot: true,
    open: true
  }
})
