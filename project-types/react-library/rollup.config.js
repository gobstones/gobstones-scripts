// eslint-disable @typescript-eslint/no-var-requires
import commonjs from '@rollup/plugin-commonjs';
import dtsImport from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const packageJson = require('./package.json');
const config = require('../../src/api').config();

const dts = typeof dtsImport === 'function' ? dtsImport : dtsImport.default;

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [resolve(), commonjs(), typescript({ tsconfig: config.tsConfigFile }), postcss()]
    },
    {
        input: 'dist/esm/index.d.ts',
        output: [{ file: 'dist/typings/index.d.ts', format: 'esm' }],
        plugins: [dts()],
        external: [/\.(css|less|scss)$/]
    }
];
