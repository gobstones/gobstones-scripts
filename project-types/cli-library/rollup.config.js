/* eslint-disable @typescript-eslint/no-var-requires */
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
                file: packageJson.exports.require,
                format: 'cjs'
            },
            {
                sourcemap: true,
                dir: packageJson.exports.import,
                format: 'esm'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile
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
                file: packageJson.exports['require/cli'],
                format: 'cjs'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            nodeResolve({ preferBuiltins: true }),
            typescript({
                tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile
            }),
            commonjs()
        ],
        external: [/@gobstones\/.*/]
    }
];
