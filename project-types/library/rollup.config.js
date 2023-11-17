/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');

const { config } = require('@gobstones/gobstones-scripts');

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

export default [
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
                file: packageJson.exports.import,
                format: 'esm'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile,
                declarationDir: './typings'
            }),
            commonjs()
        ],
        external: [/@gobstones\/.*/]
    }
];
