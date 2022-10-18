/* eslint-disable */
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const config = require('../../src/api').config();

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
            typescript({ tsconfig: config.tsConfigFile }),
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
                tsconfig: config.tsConfigFile,
                declaration: false,
                declarationMap: false,
                declarationDir: undefined
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
                dir: 'dist',
                format: 'cjs'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            nodeResolve({ preferBuiltins: true }),
            typescript(),
            commonjs(),
            commandLineArgs.configMinify && terser(),
            commandLineArgs.configShowSizes && pluginSizes()
        ],
        external: [/@gobstones\/.*/]
    }
];
