/* eslint-disable */
const config = require('../../src/api').config;

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
        config.projectRootPath + '/**/*.test.ts',
        config.projectRootPath + '/src/index.ts',
        config.projectRootPath + '/node_modules/**/*'
    ],
    includeVersion: true,
    categorizeByGroup: true,
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false,
    hideGenerator: true,
    disableSources: true,
    githubPages: true,
    plugin: ['typedoc-plugin-merge-modules'],
    // options added by typedoc-plugin-merge-modules
    mergeModulesMergeMode: 'module'
    // end of typedoc-plugin-merge-modules options
};
