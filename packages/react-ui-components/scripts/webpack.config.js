const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

function resolve(dir, file = '') {
  return path.resolve(__dirname, '../', dir, file)
}

class BuildProgressPlugin {
  apply(compiler) {
    compiler.hooks.compile.tap('BuildProgressPlugin', () => {
      console.log('Webpack 正在编译...')
    })

    compiler.hooks.compilation.tap('BuildProgressPlugin', () => {
      console.log('Webpack 正在创建编译内容...')
    })

    compiler.hooks.emit.tapAsync(
      'BuildProgressPlugin',
      (compilation, callback) => {
        console.log('Webpack 正在生成资源...')
        callback()
      }
    )

    compiler.hooks.done.tap('BuildProgressPlugin', stats => {
      console.log('Webpack 构建完成！')
      if (stats.hasErrors()) {
        console.error('构建过程中出现错误:', stats.compilation.errors)
      }
    })
  }
}

module.exports = {
  mode: 'production',
  entry: resolve('src/index.tsx'),
  output: {
    filename: 'index.min.js',
    path: resolve('lib'),
    library: 'GuardFactory',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
  externals: {
    react: 'react'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: '> 0.25%, not dead' }]
              ],
              plugins: [
                '@babel/plugin-transform-class-properties'
              ]
            }
          },
          'ts-loader'
        ],
        exclude: /node_modules/
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
    new BuildProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: 'index.min.css'
    }),
    new CssMinimizerPlugin()
  ]
}
