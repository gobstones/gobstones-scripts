/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');

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
            'fs',
            'command-exists'
        ]
    },
    {
        input: 'src/CLI/index.ts',
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
            'fs',
            'command-exists'
        ]
    }
];
