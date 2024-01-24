module.exports = {
    entryPoints: ['./src'],
    tsconfig: './tsconfig.json',
    compilerOptions: {
        rootDir: './src'
    },
    entryPointStrategy: 'expand',
    out: './docs',
    includes: './src',
    exclude: ['./node_modules/**/*', './**/*.test.ts', './src/index.ts'],
    includeVersion: true,
    categorizeByGroup: true,
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false,
    hideGenerator: true,
    disableSources: true,
    githubPages: true,
    plugin: ['typedoc-plugin-merge-modules', 'typedoc-plugin-remove-references', 'typedoc-plugin-extras'],
    // options added by typedoc-plugin-merge-modules
    mergeModulesMergeMode: 'module',
    // end of typedoc-plugin-merge-modules options
    // options added by typedoc-plugin-extras
    favicon: '.github/favicon.ico'
    // end of typedoc-plugin-extras options
};
