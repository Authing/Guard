const OSS = require('ali-oss')
const path = require('path')
const fs = require('fs')

const map = process.argv.slice(2).reduce((map, arg) => {
  const [key, value] = arg.split('=')
  map[key] = value
  return map
}, {})

const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: map.accessKeyId,
  accessKeySecret: map.accessKeySecret,
  bucket: 'authing-cdn-cn-prod'
})

const packages = fs.readdirSync('packages').filter(f => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }

  const pkg = require(`../packages/${f}/package.json`)

  if (pkg.private) {
    return false
  }

  return true
})

const ossPackages = ['guard']

readyGo()

function readyGo() {
  packages.forEach(package => {
    if (!ossPackages.includes(package)) {
      return
    }
    getAndPutFile(`${process.cwd()}/packages/${package}/dist/global`, package)
  })
}

function getAndPutFile(dir, package) {
  if (!fs.existsSync(dir)) {
    return
  }

  fs.readdirSync(dir).forEach(async item => {
    const fullPath = path.join(dir, item)

    if (fs.statSync(fullPath).isDirectory()) {
      return getAndPutFile(fullPath, package)
    }

    const separator = '/dist/global/'
    const index = fullPath.indexOf(separator)
    const ossPath = fullPath.slice(index + separator.length)
    put(fullPath, ossPath, package)
  })
}

async function put(fullPath, ossPath, package) {
  try {
    const { version } = require(`${process.cwd()}/lerna.json`)
    await client.put(`packages/${package}/${version}/${ossPath}`, fullPath)
  } catch (e) {
    throw new Error(`put oss error(${fullPath}): ` + JSON.stringify(e))
  }
}
