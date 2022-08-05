const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir, file = '') {
  return path.resolve(__dirname, '../', dir, file)
}

module.exports = function getWebpackConfig ({
  entryFileName,
  outputFileName
}) {
  return {
    mode: 'production',
    entry: resolve(`src/${entryFileName}`),
    output: {
      filename: outputFileName,
      path: resolve('dist'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'guard.min.css'
      }),
      new CopyWebpackPlugin({
        patterns: [{
          from: resolve('src'),
          to: resolve('dist')
        }]
      })
    ]
  }
}
