const path = require('path')

const rm = require('rimraf')

const webpack = require('webpack')

const getWebpackConfig = require('./webpack.config')

readyGo()

function readyGo () {
  const outputFileName = 'index.min.js'
  const entryFileName = 'style.ts'

  webpack(getWebpackConfig({
    entryFileName,
    outputFileName
  }), (error) => {
    if (error) {
      return console.error('build guard-angular assets error: ', error)
    }

    rm.sync(path.resolve(__dirname, `../dist/${outputFileName}`))
  })
}
