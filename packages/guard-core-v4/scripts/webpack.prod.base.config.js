const TerserPlugin = require('terser-webpack-plugin')

const { resolve } = require('./utils')

module.exports = function webpackProdBaseConfigFn({ reactVersion = '16' }) {
  return {
    mode: 'production',
    entry: resolve('src/index.tsx'),
    output: {
      filename: 'guard.min.js',
      path: resolve(`dist/esm-react${reactVersion}`),
      library: 'GuardFactory',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    externals: ['react', 'react-dom', 'moment'],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true
            },
            format: {
              comments: true
            }
          }
        })
      ]
    }
  }
}
