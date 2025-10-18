import fs from 'fs';
import path from 'path';

import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import remove from 'rollup-plugin-delete';
import execute from 'rollup-plugin-execute';

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

const tsConfigPath = './tsconfig.json';

export const configFor = (moduleFormat, inputFile, outputFile, extraPlugins = [], extraExternal = []) => {
    const fullInputFile = path.resolve(inputFile);
    const fullOutputFile = path.resolve(outputFile);
    const fullOutputFolder = path.resolve(path.dirname(outputFile));

    return {
        input: fullInputFile,
        output: [
            {
                sourcemap: true,
                file: fullOutputFile,
                format: moduleFormat
            }
        ],
        preserveSymlinks: true,
        plugins: [
            typescript({
                tsconfig: tsConfigPath,
                compilerOptions: {
                    declarationDir: fullOutputFolder
                }
            }),
            commonjs(),
            copy({
                targets: [{ src: './src/@i18n', dest: fullOutputFolder }]
            }),
            remove({ targets: path.join(fullOutputFolder, '@i18n', 'index.ts') }),
            ...extraPlugins
        ],
        external: [
            /@gobstones\/.*/,
            'path',
            'fs',
            'url',
            'process',
            'child_process',
            'fs-extra',
            'tsconfig.js',
            'common-tags',
            'chalk',
            'figlet',
            'command-exists',
            ...extraExternal
        ]
    };
};

export default [
    // ESM
    configFor('esm', 'src/index.ts', packageJson.exports['.'].default),
    configFor(
        'esm',
        'src/CLI/index.ts',
        packageJson.exports['./cli'].default,
        [execute([`npx chmodx ${packageJson.exports['./cli'].default}`])],
        ['commander', /i18next.*/]
    )
];
