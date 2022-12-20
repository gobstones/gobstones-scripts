/* eslint-disable */
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const config = require('../../src/api').config;

// Expected arguments:
export default (commandLineArgs) => [
    {
        input: 'src/index.ts',
        output: [
            {
                sourcemap: true,
                dir: 'dist',
                format: 'es'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({ tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile }),
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
