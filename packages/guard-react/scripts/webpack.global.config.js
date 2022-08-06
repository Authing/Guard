const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir, file = '') {
  return path.resolve(__dirname, '../', dir, file)
}

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: resolve('src/index.tsx'),
  output: {
    filename: 'guard.min.js',
    path: resolve('dist/global'),
    library: {
      name: 'GuardFactory',
      type: 'global'
    }
  },
  externals: {
    react: 'React'
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
