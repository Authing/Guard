const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

function resolve(dir, file = '') {
  return path.resolve(__dirname, '../', dir, file)
}

module.exports = {
  mode: 'production',
  entry: resolve('src/index.ts'),
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
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
  externals: {
    'vue': 'vue'
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
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.min.css'
    }),
    new CssMinimizerPlugin(),
  ]
}
