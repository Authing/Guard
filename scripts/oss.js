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


readyGo()

function readyGo() {
  getAndPutFile(`${process.cwd()}/packages/guard-core/dist/global`)
}

function getAndPutFile(dir) {
  if (!fs.existsSync(dir)) {
    return
  }

  fs.readdirSync(dir).forEach(async item => {
    const fullPath = path.join(dir, item)

    if (fs.statSync(fullPath).isDirectory()) {
      return getAndPutFile(fullPath)
    }

    const separator = '/dist/global/'
    const index = fullPath.indexOf(separator)
    const ossPath = fullPath.slice(index + separator.length)
    put(fullPath, ossPath)
  })
}

async function put(fullPath, ossPath) {
  try {
    const { version } = require(`${process.cwd()}/lerna.json`)
    await client.put(`packages/guard/${version}/${ossPath}`, fullPath)
    await client.put(`packages/guard/latest/${ossPath}`, fullPath)
  } catch (e) {
    throw new Error(`put oss error(${fullPath}): ` + JSON.stringify(e))
  }
}
