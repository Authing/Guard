const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const webpack = require('webpack')

const { resolve } = require('./utils')

module.exports = function webpackConfigFn({ reactVersion = '16' }) {
  return {
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
        'shim-react': resolve(`shim-react${reactVersion}`),
        react: resolve(`shim-react${reactVersion}/node_modules/react`),
        'react-dom': resolve(
          `shim-react${reactVersion}/node_modules/react-dom`
        ),
        'shim-antd': resolve(
          `shim-${reactVersion === '18' ? 'antd4' : 'antd4'}`
        ),
        '@antd-es-style': resolve(
          `shim-${
            reactVersion === '18' ? 'antd4' : 'antd4'
          }/node_modules/antd/es`
        )
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                lessOptions: {
                  javascriptEnabled: true,
                  modifyVars: {
                    '@primary-color': '#215AE5',
                    '@link-color': '#215AE5',
                    '@ant-prefix': 'authing-ant'
                  }
                }
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          use: ['url-loader']
        }
      ]
    },
    plugins: [
      // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)(),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }),
      new HtmlWebpackPlugin({
        template: resolve('index.html'),
        filename: 'index.html',
        env: process.env.NODE_ENV,
        reactVersion,
        scriptLoading: 'module',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true
        }
      }),
      new MiniCssExtractPlugin({
        filename: 'guard.min.css'
      }),
      new CssMinimizerPlugin(),
      new webpack.DefinePlugin({
        __react_version__: JSON.stringify(reactVersion)
      })
    ]
  }
}
