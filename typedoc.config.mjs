export default {
    // Configuration
    tsconfig: './tsconfig.json',
    compilerOptions: {
        rootDir: './src'
    },
    plugin: ['@gobstones/typedoc-theme-gobstones'],
    // Input
    entryPoints: ['./src'],
    entryPointStrategy: 'expand',
    exclude: ['./node_modules/**/*', './**/*.test.ts', './src/@types/**/*', './src/index.ts'],
    // Output
    out: './docs',
    theme: 'gobstones'
};
