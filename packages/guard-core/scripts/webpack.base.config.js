const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const webpack = require('webpack')

const TerserPlugin = require('terser-webpack-plugin')

const { resolve } = require('./utils')

module.exports = function webpackConfigFn ({
  reactVersion = '16'
}) {
  return {
    mode: 'production',
    entry: resolve('src/index.tsx'),
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
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
        'shim-react': resolve(`shim-react${reactVersion}`),
        'react': resolve(`shim-react${reactVersion}/node_modules/react`),
        'react-dom': resolve(`shim-react${reactVersion}/node_modules/react-dom`),
        'shim-antd': resolve(`shim-${reactVersion === '18' ? 'antd5' : 'antd4'}`)
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
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
          use: [MiniCssExtractPlugin.loader, 'css-loader', {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  '@primary-color': '#215AE5',
                  '@link-color': '#215AE5',
                  '@ant-prefix': 'authing-ant',
                },
              },
            },
          }]
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          use: ['url-loader']
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          },
          format: {
            comments: false
          }
        }
      })]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve('index.html'),
        filename: 'index.html',
        env: process.env.NODE_ENV,
        reactVersion,
        scriptLoading: "module",
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
