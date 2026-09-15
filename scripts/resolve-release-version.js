const fs = require('fs')
const { execFileSync } = require('child_process')

function resolveVersion(requested, branch, current, tags) {
  const input = (requested || 'auto').trim().replace(/^v(?=\d)/, '')
  if (input !== 'auto') {
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(input)) {
      throw new Error(`Invalid release version: ${input}`)
    }
    return input
  }
  if (branch !== 'custom/shjw') {
    throw new Error('Auto version is only supported for custom/shjw; enter an explicit version for this branch.')
  }
  const base = current.split('-')[0]
  const prefix = `${base}-shjw.`
  const versions = [current, ...tags.map(tag => tag.replace(/^v/, ''))]
  const highest = versions.reduce((max, version) => {
    if (!version.startsWith(prefix)) return max
    const suffix = version.slice(prefix.length)
    return /^\d+$/.test(suffix) ? Math.max(max, Number(suffix)) : max
  }, 0)
  return `${prefix}${highest + 1}`
}

if (require.main === module) {
  const version = resolveVersion(
    process.env.VERSION,
    process.env.GITHUB_REF_NAME,
    JSON.parse(fs.readFileSync('lerna.json', 'utf8')).version,
    execFileSync('git', ['tag', '--list'], { encoding: 'utf8' }).trim().split('\n')
  )
  fs.appendFileSync(process.env.GITHUB_ENV, `VERSION=${version}\n`)
  console.log(`Release version: ${version}`)
}

module.exports = { resolveVersion }
