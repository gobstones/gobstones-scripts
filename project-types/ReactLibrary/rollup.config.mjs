import fs from 'fs';

import { config } from '@gobstones/gobstones-scripts';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

config.init();
const tsConfigPath = config.projectType.tsConfigJSON.toolingFile;

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.exports['.'].import.default,
                format: 'esm',
                sourcemap: true
            },
            {
                file: packageJson.exports['.'].require.default,
                format: 'cjs',
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            image(),
            typescript({
                tsconfig: `${tsConfigPath}`,
                declarationDir: './typings'
            }),
            postcss()
        ],
        external: [/@gobstones\/.*/, 'react', 'react-dom']
    }
];
