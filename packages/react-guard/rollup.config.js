import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './components/index.ts',
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
  ],
};
