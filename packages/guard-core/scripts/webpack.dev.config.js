const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

function resolve(dir, file = '') {
  return path.resolve(__dirname, '../', dir, file)
}

const reactVersion = '16'

module.exports = {
  mode: 'development',
  entry: resolve('example.tsx'),
  output: {
    filename: 'index.min.js',
    path: resolve(`dist`),
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
    },
    fallback: {
      fs: false
    }
  },
  externals: {
    React: 'react',
    ReactDOM: 'react-dom'
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
                '@ant-prefix': 'authing-ant'
              }
            }
          }
        }]
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: ['url-loader']
      }
    ]
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
      filename: 'index.min.css'
    }),
    new webpack.DefinePlugin({
      __react_version__: JSON.stringify(reactVersion)
    })
  ],
  devServer: {
    host: 'localhost',
    port: 3002,
    hot: true,
    open: true
  }
}
