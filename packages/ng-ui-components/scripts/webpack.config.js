const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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

module.exports = function getWebpackConfig({ entryFileName, outputFileName }) {
  return {
    mode: 'production',
    entry: resolve(`projects/guard/src/${entryFileName}`),
    output: {
      filename: outputFileName,
      path: resolve('dist')
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
      new BuildProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: 'guard.min.css'
      })
    ]
  }
}
