/* eslint-disable @typescript-eslint/no-var-requires */
const commonjs = require('@rollup/plugin-commonjs');
const fs = require('fs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

module.exports = [
    {
        input: 'src/index.ts',
        output: [
            {
                sourcemap: true,
                file: packageJson.exports.require.default,
                format: 'cjs'
            },
            {
                sourcemap: true,
                file: packageJson.exports.import.default,
                format: 'esm'
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declarationDir: './typings'
            }),
            commonjs()
        ],
        external: [
            /@gobstones\/.*/,
            'child_process',
            'fs-extra',
            'path',
            'tsconfig.js',
            'process',
            'common-tags',
            'ansi-colors',
            'figlet',
            'fs'
        ]
    },
    {
        input: 'src/cli/index.ts',
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
                tsconfig: './tsconfig.json'
            }),
            commonjs()
        ],
        external: [
            /@gobstones\/.*/,
            'child_process',
            'fs-extra',
            'path',
            'tsconfig.js',
            'process',
            'common-tags',
            'ansi-colors',
            'figlet',
            'fs'
        ]
    }
];