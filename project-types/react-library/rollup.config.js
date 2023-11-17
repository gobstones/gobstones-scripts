/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const commonjs = require('@rollup/plugin-commonjs');
const image = require('@rollup/plugin-image');
const postcss = require('rollup-plugin-postcss');
const resolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');

const { config } = require('@gobstones/gobstones-scripts');

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.exports.require,
                format: 'cjs',
                sourcemap: true
            },
            {
                file: packageJson.exports.import,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            image(),
            typescript({
                tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile,
                declarationDir: './typings'
            }),
            postcss()
        ],
        external: ['react', 'react-dom', /@gobstones\/.*/]
    }
];
