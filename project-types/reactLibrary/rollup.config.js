/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const { config } = require('@gobstones/gobstones-scripts');
const commonjs = require('@rollup/plugin-commonjs');
const image = require('@rollup/plugin-image');
const resolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

config.init();
const tsConfigPath = config.projectType.tsConfigJSON.toolingFile;

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.exports['.'].import.default,
                format: 'esm',
                sourcemap: true
            },
            {
                file: packageJson.exports['.'].require.default,
                format: 'cjs',
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            image(),
            typescript({
                tsconfig: `${tsConfigPath}`,
                declarationDir: './typings'
            }),
            postcss()
        ],
        external: [/@gobstones\/.*/, 'react', 'react-dom']
    }
];
