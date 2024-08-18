export default {
    entryPoints: ['./src'],
    entryPointStrategy: 'expand',
    tsconfig: './tsconfig.json',
    compilerOptions: {
        rootDir: './src'
    },
    out: './docs',
    exclude: ['./node_modules/**/*', './**/*.test.ts', './src/index.ts'],
    includeVersion: true,
    categorizeByGroup: true,
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false,
    hideGenerator: true,
    disableSources: false,
    githubPages: true,
    plugin: ['@gobstones/typedoc-theme-gobstones'],
    excludeTags: ['@override', '@virtual', '@satisfies', '@overload'],
    visibilityFilters: {
        '@internal': false,
        protected: false,
        private: false,
        inherited: false
    },
    theme: 'gobstones',
    mergeModulesMergeMode: 'module-category'
};
