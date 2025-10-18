import fs from 'fs';
import path from 'path';

import { config } from '@gobstones/gobstones-scripts';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import execute from 'rollup-plugin-execute';

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

const tsConfigPath = config.init().projectType.typescript.toolingFiles.main;

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
            ...extraPlugins
        ],
        external: [/@gobstones\/.*/, /i18next.*/, ...extraExternal]
    };
};

export default [
    // ESM
    configFor('esm', 'src/index.ts', packageJson.exports['.'].default),
    configFor(
        'esm',
        'src/cli.ts',
        packageJson.exports['./cli'].default,
        [execute([`npx chmodx ${packageJson.exports['./cli'].default}`])],
        ['fs', 'path']
    )
];
