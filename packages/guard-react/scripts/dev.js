const { resolve, join } = require('path')
const minimist = require('minimist')
const execa = require('execa')
const { build } = require('esbuild')
const { feLog } = require('./tag')
const { remove } = require('fs-extra')

const argv = minimist(process.argv.slice(2))

const outdir = resolve(__dirname, '../dist')

const target = argv.target || 'esm' // umd esm

const pkg = JSON.stringify(require(resolve(__dirname, '../package.json')))

function buildTs() {
  return execa('npm', ['run', 'build:ts'], {
    cwd: resolve(__dirname, '../')
  })
    .then(() => console.log('build: Guard types.'))
    .catch(e => console.log('build Ts Error:', e))
}

function buildJs() {
  build({
    entryPoints: [resolve(__dirname, '../components/index.ts')],
    outfile: join(outdir, `index.${argv.target}.js`),
    bundle: true,
    external: ['react', 'react-dom'],
    sourcemap: true,
    format: target,
    globalName: pkg.buildOptions?.name,
    platform: 'browser',
    plugins: [
      // TODO:CSS 插件解决路径命名问题
    ],
    define: {
      __VERSION__: `"${pkg.version}"`
    },
    watch: {
      async onRebuild(error) {
        if (!error) {
          await buildTs()
          console.log(`rebuilt: Guard`)
        }
      }
    }
  })
}

async function main() {
  try {
    await remove(outdir)
    feLog()
    await Promise.all([buildJs(), buildTs()])
    console.log('watching Guard build...')
  } catch (e) {
    console.log(e, 'e')
  }
}

main()
