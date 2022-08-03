import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import css from 'rollup-plugin-postcss'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

const isProd = argv.mode === 'production'

export default {
  input: './components/index.ts',
  output: [
    {
      file: 'dist/guard.cjs.js',
      format: 'umd',
      name: 'Guard',
      sourcemap: !isProd
    },
    {
      file: 'dist/guard.esm.js',
      format: 'es',
      sourcemap: !isProd
    }
  ],
  context: 'this',
  external: ['react', 'react-dom'],
  watch: !isProd,
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    }),
    nodeResolve({
      browser: true
    }),
    css()
  ]
}
