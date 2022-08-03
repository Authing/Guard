import path from "path"
import typescript from "rollup-plugin-typescript2"
import {nodeResolve} from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import postcss from 'rollup-plugin-postcss'
import json from '@rollup/plugin-json'

export default function () {
  return {
    input: path.resolve(__dirname, "../components/index.tsx"),
    context: 'this',
    output:[ {
      file: 'dist/guard.min.js',
      format: 'umd',
      name: 'GuardFactory',
    }, {
      file: 'dist/guard.esm.js',
      format: "esm",
    }],
    plugins: [
      nodeResolve({
        browser: true
      }),

      commonjs({
        transformMixedEsModules: true
      }),
      typescript({
        tsconfig: "tsconfig.json",
      }),
      json(),
      postcss({
        extract:  path.resolve(__dirname,'../dist/guard.css'),
        minimize: true,
      })
    ]
  };
}
