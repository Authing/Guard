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
      globalObject: 'this',
      // 关键：强制 chunk 文件名格式，确保和运行时一致
      chunkFilename: '[id].js'
    },
    externals: [
      'react',
      'react-dom',
      'moment'
      // 注意：AWS 包不再设为 external，直接打包进 bundle
      // 这样可以避免使用方遇到 chunk 加载问题
    ],
    optimization: {
      minimize: true,
      // 关键：禁用代码分割，防止产生 chunk 文件
      // 这样 @aws-amplify/ui-react-liveness 的动态导入会被内联到主包
      splitChunks: false,
      runtimeChunk: false,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: false
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
