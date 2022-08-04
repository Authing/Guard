const { resolve } = require('path')
const { remove } = require('fs-extra')
const execa = require('execa')
const { feLog } = require('./tag')
const signale = require('signale')

const env = 'production'
const configFile = resolve(__dirname, '../rollup.config.js')

const pkgDir = resolve(__dirname, '../')

async function run() {
  // clean
  await remove(`${pkgDir}/dist`)
  // Authing Tag
  feLog()
  // build
  await execa('rollup', ['-c', [configFile]], {
    stdio: 'inherit'
  })
  // done
  signale.success(`${env} mode: build done.`)
}

run()
