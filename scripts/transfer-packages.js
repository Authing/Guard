const path = require('path')
const fs = require('fs-extra')
const rm = require('rimraf')

const resolve = (dir, file = '') =>{
  return path.resolve(__dirname, '../', dir, file)
}

const reactVersions = [16, 18]

readyGo()

function readyGo () {
  reactVersions.forEach(version => {
    copyFiles(version)
  })
}

function copyFiles (version) {
  const dirName = version === 16
    ? 'guard-shim-react'
    : 'guard-shim-react18'

  rm.sync(resolve(`packages/${dirName}/dist`))

  // copy js
  fs.copySync(
    resolve(`packages/guard-core/dist/esm-react${version}/index.min.js`),
    resolve(`packages/${dirName}/dist/index.min.js`)
  )

  // copy css
  fs.copySync(
    resolve(`packages/guard-core/dist/esm-react${version}/index.min.css`),
    resolve(`packages/${dirName}/dist/index.min.css`)
  )

  // copy typings
  fs.copySync(
    resolve(`packages/guard-core/dist/typings`),
    resolve(`packages/${dirName}/dist/typings`)
  )
}
