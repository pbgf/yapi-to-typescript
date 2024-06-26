// import { terser } from "rollup-plugin-terser"; // 压缩代码
const { babel } = require('@rollup/plugin-babel'); // rollup 的 babel 插件，ES6转ES5
const path = require('path');
const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const dts = require('rollup-plugin-dts').default;
const pkg = require('./package.json');

const extensions = ['.js', '.ts'];

const resolve = function(...args) {
  return path.resolve(__dirname, ...args);
};
export default [
    {
        input: resolve('./src/index.ts'),
        output: {
            file: resolve('./', pkg.main), // 为了项目的统一性，这里读取 package.json 中的配置项
            format: 'cjs',
        },
        plugins: [
            json(),
            commonjs(),
            nodeResolve({
                extensions,
                modulesOnly: true,
            }),
            typescript(),
            babel(),
        ],
    },
    {
        // path to your declaration files root
        input: resolve('./src/index.ts'),
        output: [{ file: './lib/index.d.ts', format: 'es' }],
        plugins: [dts()],
    },
    {
        input: resolve('./src/cli.ts'),
        output: {
            banner: '#!/usr/bin/env node',
            file: './lib/cli.js',
            format: 'cjs',
        },
        plugins: [
            json(),
            commonjs(),
            nodeResolve({
                extensions,
                modulesOnly: true,
            }),
            typescript(),
            babel(),
        ],
        external: ['swagger-client']
    }
];
