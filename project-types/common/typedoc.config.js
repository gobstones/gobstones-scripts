/* eslint-disable @typescript-eslint/no-var-requires */
const { config } = require('@gobstones/gobstones-scripts');

module.exports = {
    entryPoints: [config.projectRootPath + '/src'],
    tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile,
    compilerOptions: {
        rootDir: config.projectRootPath + '/src'
    },
    entryPointStrategy: 'expand',
    out: config.projectRootPath + '/docs',
    includes: config.projectRootPath + '/src',
    exclude: [
        config.projectRootPath + '/node_modules/**/*',
        config.projectRootPath + '/**/*.test.ts',
        config.projectRootPath + '/src/index.ts'
    ],
    includeVersion: true,
    categorizeByGroup: true,
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false,
    hideGenerator: true,
    disableSources: true,
    githubPages: true,
    plugin: [
        'typedoc-plugin-merge-modules',
        'typedoc-plugin-remove-references',
        'typedoc-plugin-extras'
    ],
    // options added by typedoc-plugin-merge-modules
    mergeModulesMergeMode: 'module',
    // end of typedoc-plugin-merge-modules options
    // options added by typedoc-plugin-extras
    favicon: '.github/favicon.ico'
    // end of typedoc-plugin-extras options
};
