const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')

const sourceMap = false

readyGo()

async function readyGo () {
  const pkgDir = path.resolve(__dirname, '../')
  const pkg = require(`${pkgDir}/package.json`)

  if (!pkg.buildOptions) {
    return
  }
  
  await fs.remove('dist')

  await execa(
    'rollup',
    [
      '--config',
      'scripts/rollup.config.js',
      '--environment',
      [
        sourceMap ? `SOURCE_MAP:true` : ``,
        'TYPES:true',
        'BUILD:production'
      ]
        .filter(Boolean)
        .join(',')
    ],
    { stdio: 'inherit' }
  )
}
