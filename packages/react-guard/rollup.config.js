import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import css from 'rollup-plugin-postcss';

export default {
  input: './components/index.ts',
  sourcemap: true,
  output: [
    {
      file: 'dist/guard.cjs.js',
      format: 'umd',
      name: 'Guard',
    },
    {
      file: 'dist/guard.esm.js',
      format: 'es',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    nodeResolve({
      browser: true,
    }),
    css(),
  ],
};
