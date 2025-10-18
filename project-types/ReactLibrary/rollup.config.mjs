import fs from 'fs';
import path from 'path';

import { config } from '@gobstones/gobstones-scripts';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';

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
            resolve(),
            commonjs(),
            image(),
            typescript({
                tsconfig: tsConfigPath,
                compilerOptions: {
                    declarationDir: fullOutputFolder
                }
            }),
            postcss(),
            copy({
                targets: [{ src: './src/@i18n', dest: fullOutputFolder }]
            }),
            ...extraPlugins
        ],
        external: [/@gobstones\/.*/, /i18next.*/, 'react', 'react-dom', ...extraExternal]
    };
};

export default [
    // ESM
    configFor('esm', 'src/index.ts', packageJson.exports['.'].default)
];
