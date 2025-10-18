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
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false,
    // Output
    out: './docs',
    theme: 'gobstones'
};
