import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import replace from '@rollup/plugin-replace'

const path = require('path')
const pkg = require('../package.json')

const outputConfigs = {
  'esm-bundler': {
    file: path.resolve(`dist/guard.esm.bundler.js`),
    format: `es`
  },
  'esm-browser': {
    file: path.resolve(`dist/guard.esm.browser.js`),
    format: `es`
  },
  cjs: {
    file: path.resolve(`dist/guard.cjs.js`),
    format: `cjs`
  },
  global: {
    file: path.resolve(`dist/guard.global.js`),
    format: `iife`
  },
  amd: {
    file: path.resolve(`dist/guard.amd.js`),
    format: `amd`
  },
  umd: {
    file: path.resolve(`dist/guard.umd.js`),
    format: `umd`
  }
}

const entryFile = path.resolve('src/index.tsx')
const buildOptions = pkg.buildOptions || {}
const packageFormats = buildOptions.formats
const packageConfigs = packageFormats.map(format => createConfig(format, outputConfigs[format]))

packageFormats.forEach(format => {
  if (/^(global|esm-browser)/.test(format)) {
    packageConfigs.push(createMinifiedConfig(format, outputConfigs, createConfig))
  }
})

packageConfigs.push(createDtsConfig())

export default packageConfigs

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  const isUmdBuild = /umd/i.test(format)
  const isGlobalBuild = /global/i.test(format)

  output.exports = 'named'
  output.sourcemap = !!process.env.SOURCE_MAP
  output.externalLiveBindings = false
  output.inlineDynamicImports = true

  if (isGlobalBuild || isUmdBuild) {
    output.name = buildOptions.name
  }

  const tsPlugin = ts({
    tsconfig: path.resolve('tsconfig.json'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: false,
        declarationMap: false
      }
    }
  })

  const config = {
    input: entryFile,
    output,
    plugins: [
      json({
        namedExports: false
      }),
      nodeResolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      commonjs({
        include: ["node_modules/**"]
      }),
      nodePolyfills(),
      babel({ babelHelpers: 'bundled' }),
      tsPlugin,
      ...plugins
    ],
    treeshake: {
      moduleSideEffects: false
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  return config
}

function createMinifiedConfig(format, outputConfigs, createConfig) {
  const { terser } = require('rollup-plugin-terser')
  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.min.js'),
      format: outputConfigs[format].format
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true
        },
        format: {
          comments: false
        },
        safari10: true
      })
    ]
  )
}

function createDtsConfig () {
  return {
    input: entryFile,
    output: {
      file: path.resolve('dist/guard.d.ts'), 
      format: 'es'
    },
    plugins: [
      dts()
    ]
  }
}
