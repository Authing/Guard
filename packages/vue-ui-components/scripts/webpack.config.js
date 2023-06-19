const path = require('path')

const { VueLoaderPlugin } = require('vue-loader')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

function resolve(dir, file = '') {
  return path.resolve(__dirname, '../', dir, file)
}

module.exports = {
  mode: 'production',
  entry: resolve('src/index.ts'),
  output: {
    filename: 'guard.min.js',
    path: resolve(`dist/esm`),
    library: {
      type: 'umd'
    }
  },
  externals: {
    'vue': 'vue'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json']
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
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: '3.22'
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'guard.min.css'
    }),
    new CssMinimizerPlugin(),
    new VueLoaderPlugin()
  ]
}
