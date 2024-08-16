import fs from 'fs';

import { config } from '@gobstones/gobstones-scripts';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());

config.init();
const tsConfigPath = config.projectType.tsConfigJSON.toolingFile;

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
                tsconfig: `${tsConfigPath}`,
                declarationDir: './typings'
            }),
            commonjs()
        ],
        external: [/@gobstones\/.*/, /i18next.*/, 'fs', 'path']
    }
];
