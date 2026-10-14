const fs = require('fs')
const path = require('path')

function checkReleaseVersion(version, rootDir = path.resolve(__dirname, '..')) {
  if (!version) {
    throw new Error('missing required release version')
  }

  const packageFiles = fs.readdirSync(path.join(rootDir, 'packages'))
    .map(dir => path.join('packages', dir, 'package.json'))
    .filter(file => fs.existsSync(path.join(rootDir, file)))
  const mismatches = ['lerna.json', ...packageFiles].flatMap(file => {
    const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, file), 'utf8'))
    return manifest.version === version ? [] : [`${file}: ${manifest.version}`]
  })

  if (mismatches.length) {
    throw new Error(
      `release version mismatch (expected ${version}):\n${mismatches.join('\n')}\n` +
      'Run lerna version with --force-publish before building the core.'
    )
  }
}

if (require.main === module) {
  try {
    checkReleaseVersion(process.argv[2])
    console.log(`all package versions match ${process.argv[2]}`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

module.exports = { checkReleaseVersion }
