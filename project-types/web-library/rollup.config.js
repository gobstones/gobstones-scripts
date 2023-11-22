/* eslint-disable */
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');

const { config } = require('@gobstones/gobstones-scripts');

// Expected arguments:
export default [
    {
        input: 'src/index.ts',
        output: [
            {
                sourcemap: true,
                file: packageJson.exports['.'].import.default,
                format: 'umd'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile,
                target: 'es6'
            }),
            commonjs()
        ],
        external: [/@gobstones\/.*/]
    },
    {
        input: 'src/index.ts',
        output: [
            {
                sourcemap: true,
                file: 'dist/index.cjs',
                format: 'cjs'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile,
                declaration: false,
                declarationMap: false,
                declarationDir: undefined
            }),
            commonjs()
        ],
        external: [/@gobstones\/./]
    }
];
