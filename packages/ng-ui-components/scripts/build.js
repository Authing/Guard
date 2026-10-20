const path = require('path')

const rm = require('rimraf')

const webpack = require('webpack')

const getWebpackConfig = require('./webpack.config')

readyGo()

function readyGo() {
  const outputFileName = 'index.min.js'
  const entryFileName = 'style.ts'

  webpack(
    getWebpackConfig({
      entryFileName,
      outputFileName
    }),
    (error, stats) => {
      if (error || !stats || stats.hasErrors()) {
        console.error(
          'build guard-angular assets error: ',
          error || stats?.toString({ all: false, errors: true })
        )
        process.exitCode = 1
        return
      }

      rm.sync(path.resolve(__dirname, `../dist/${outputFileName}`))
    }
  )
}
