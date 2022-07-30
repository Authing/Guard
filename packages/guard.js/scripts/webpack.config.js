const path = require('path')
const NpmDtsPlugin = require('npm-dts-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir, file = '') {
  return path.resolve(__dirname, '../', dir, file)
}

module.exports = {
  mode: 'production',
  entry: resolve('components/index.tsx'),
  output: {
    filename: 'guard.min.js',
    path: resolve('dist'),
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
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
    new NpmDtsPlugin({
      output: resolve('dist/guard.d.ts'),
      entry: resolve('components/guard.tsx')
    }),
    new MiniCssExtractPlugin({
      filename: 'guard.css'
    })
  ]
}
