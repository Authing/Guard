const { merge } = require('webpack-merge')

const webpackBaseConfigFn = require('./webpack.base.config')

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const { resolve } = require('./utils')

const reactVersion = '16'

module.exports = merge({}, webpackBaseConfigFn({
  reactVersion
}), {
  output: {
    filename: 'guard.min.js',
    path: resolve(`dist/bundle-analyzer/esm-react${reactVersion}`),
    library: {
      type: 'module'
    }
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ]
})
