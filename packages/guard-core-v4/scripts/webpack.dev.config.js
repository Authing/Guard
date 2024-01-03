const { merge } = require('webpack-merge')

const webpackBaseConfigFn = require('./webpack.base.config')

const { resolve } = require('./utils')

const reactVersion = '16'
const fs = require('fs')

module.exports = merge(
  {},
  webpackBaseConfigFn({
    reactVersion
  }),
  {
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
      // https: {
      //   key: fs.readFileSync('/Users/jayl/Code/authing/Guard/test.local.key'),
      //   cert: fs.readFileSync('/Users/jayl/Code/authing/Guard/test.local.crt'),
      // },
      // host: 'passkey.cj.local',
      port: 8443,
      hot: true,
      open: true
    }
  }
)
