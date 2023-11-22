/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');

const { config } = require('@gobstones/gobstones-scripts');

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

module.exports = [
    {
        input: 'src/index.ts',
        output: [
            {
                sourcemap: true,
                file: packageJson.exports['.'].import.default,
                format: 'esm'
            },
            {
                sourcemap: true,
                file: packageJson.exports['.'].require.default,
                format: 'cjs'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile,
                declarationDir: path.join(
                    path.dirname(packageJson.exports['.'].import.default),
                    './typings'
                )
            }),
            commonjs()
        ],
        external: [/@gobstones\/.*/]
    },
    {
        input: 'src/cli.ts',
        output: [
            {
                sourcemap: true,
                file: packageJson.exports['./cli'].import.default,
                format: 'esm'
            },
            {
                sourcemap: true,
                file: packageJson.exports['./cli'].require.default,
                format: 'cjs'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            nodeResolve({ preferBuiltins: true }),
            typescript({
                tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile,
                declarationDir: './typings'
            }),
            commonjs()
        ],
        external: [/@gobstones\/.*/]
    }
];
