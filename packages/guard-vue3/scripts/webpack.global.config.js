const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir, file = '') {
  return path.resolve(__dirname, '../', dir, file)
}

module.exports = {
  mode: 'production',
  entry: resolve('src/index.ts'),
  output: {
    filename: 'guard.min.js',
    path: resolve('dist/global'),
    library: {
      name: 'GuardFactory',
      type: 'global'
    }
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
    })
  ]
}
