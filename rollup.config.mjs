import fs from 'fs';
import path from 'path';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import remove from 'rollup-plugin-delete';

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

export default [
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
            commonjs(),
            copy({
                targets: [{ src: './src/@i18n', dest: path.dirname(packageJson.exports['.'].import.default) }]
            }),
            remove({ targets: path.join(path.dirname(packageJson.exports['.'].import.default), '@i18n', 'index.ts') })
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
            commonjs(),
            copy({
                targets: [{ src: './src/@i18n', dest: path.dirname(packageJson.exports['.'].require.default) }]
            }),
            remove({ targets: path.join(path.dirname(packageJson.exports['.'].require.default), '@i18n', 'index.ts') })
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
