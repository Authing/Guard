const assert = require('assert').strict
const { EventEmitter } = require('events')
const https = require('https')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { packageExists, waitForNpmPackage } = require('./release')
const { checkReleaseVersion } = require('./check-release-version')

const packageName = '@authing/guard-shim-react'
const version = '4.5.54-otp.2'
const registry = 'https://registry.npmjs.org/'
const manifest = { name: packageName, version }
const originalRequest = https.request
let responses
let requests

function mockRegistry(queue) {
  responses = queue.slice()
  requests = []
  https.request = (options, callback) => {
    requests.push(options)
    const req = new EventEmitter()
    req.setTimeout = (ms, onTimeout) => { req.onTimeout = onTimeout }
    req.destroy = error => req.emit('error', error)
    req.end = () => process.nextTick(() => {
      const next = responses.shift()
      assert(next, 'unexpected registry request')
      if (next.timeout) return req.onTimeout()
      const res = new EventEmitter()
      res.statusCode = next.status
      res.setEncoding = () => {}
      callback(res)
      res.emit('data', typeof next.body === 'string' ? next.body : JSON.stringify(next.body))
      res.emit('end')
    })
    return req
  }
}

async function main() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'guard-release-version-'))
  const writeVersion = (file, value) => {
    const target = path.join(fixture, file)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, JSON.stringify({ version: value }))
  }
  try {
    writeVersion('lerna.json', '4.5.54-otp.2')
    writeVersion('packages/guard-core-v4/package.json', '4.5.54-otp.2')
    writeVersion('packages/guard-shim-react/package.json', '4.5.55')
    assert.throws(() => checkReleaseVersion('4.5.55', fixture), /guard-core-v4\/package.json: 4\.5\.54-otp\.2/)
    writeVersion('packages/guard-core-v4/package.json', '4.5.55')
    assert.throws(() => checkReleaseVersion('4.5.55', fixture), /lerna.json: 4\.5\.54-otp\.2/)
    writeVersion('lerna.json', '4.5.55')
    assert.doesNotThrow(() => checkReleaseVersion('4.5.55', fixture))
    writeVersion('packages/guard-shim-react/package.json', '4.5.54-otp.2')
    assert.throws(() => checkReleaseVersion('4.5.55', fixture), /guard-shim-react\/package.json/)
    assert.throws(() => checkReleaseVersion('', fixture), /missing required release version/)
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true })
  }

  mockRegistry([{ status: 200, body: manifest }])
  assert.equal(await packageExists(packageName, version, registry), true)
  assert.equal(requests[0].hostname, 'registry.npmjs.org')
  assert.match(requests[0].path, /^\/%40authing%2Fguard-shim-react\/4\.5\.54-otp\.2\?release-check=\d+$/)
  assert.equal(requests[0].headers['Cache-Control'], 'no-cache')
  assert.equal(requests[0].headers.Authorization, undefined)

  mockRegistry([{ status: 404, body: 'Not found' }])
  assert.equal(await packageExists(packageName, version, registry), false)

  for (const status of [401, 403, 429, 500]) {
    mockRegistry([{ status, body: 'Registry unavailable' }])
    await assert.rejects(packageExists(packageName, version, registry), { statusCode: status })
  }

  mockRegistry([{ status: 200, body: { ...manifest, version: '4.5.54-otp.1' } }])
  await assert.rejects(packageExists(packageName, version, registry), /unexpected package metadata/)

  mockRegistry([{ status: 200, body: 'not json' }])
  await assert.rejects(packageExists(packageName, version, registry), SyntaxError)

  mockRegistry([{ timeout: true }])
  await assert.rejects(packageExists(packageName, version, registry), /request timed out/)

  const options = {
    initialWaitMs: 0, intervalMs: 0, registry, registryName: 'test registry', retries: 3, strict: true,
  }
  mockRegistry([
    { status: 404, body: {} },
    { status: 503, body: 'Unavailable' },
    { status: 200, body: manifest },
  ])
  assert.equal(await waitForNpmPackage(packageName, version, options), true)
  assert.equal(requests.length, 3)

  mockRegistry([{ status: 503, body: 'Unavailable' }])
  await assert.rejects(waitForNpmPackage(packageName, version, { ...options, retries: 1 }), /HTTP 503/)

  mockRegistry([{ status: 404, body: {} }])
  assert.equal(await waitForNpmPackage(packageName, version, { ...options, retries: 1, strict: false }), false)
  console.log('release registry checks passed')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
}).finally(() => { https.request = originalRequest })
