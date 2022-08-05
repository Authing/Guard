const path = require('path')
const rm = require('rimraf')
const webpack = require('webpack')
const getWebpackConfig = require('./webpack.config')

try {
  rm.sync(path.resolve(__dirname, '../', 'dist'))
} catch (e) {
  console.error('\n\n Failed to delete dist directory, please operate manually \n\n')
}

readyGo()

function readyGo () {
  const outputFileName = 'guard.min.js'
  const entryFileName = 'style.ts'

  webpack(getWebpackConfig({
    entryFileName,
    outputFileName
  }), (error) => {
    if (error) {
      return console.error('build guard.js esm bundler error: ', error)
    }

    rm.sync(path.resolve(__dirname, `../dist/${outputFileName}`))
    rm.sync(path.resolve(__dirname, `../dist/${entryFileName}`))
  })
}
