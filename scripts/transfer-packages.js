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
    resolve(`packages/guard-core-v6/dist/esm-react${version}/guard.min.js`),
    resolve(`packages/${dirName}/dist/guard.min.js`)
  )

  // copy css
  fs.copySync(
    resolve(`packages/guard-core-v6/dist/esm-react${version}/guard.min.css`),
    resolve(`packages/${dirName}/dist/guard.min.css`)
  )

  // copy typings
  fs.copySync(
    resolve(`packages/guard-core-v6/dist/typings`),
    resolve(`packages/${dirName}/dist/typings`)
  )
}
