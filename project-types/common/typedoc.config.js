/* eslint-disable @typescript-eslint/no-var-requires */
const { config } = require('@gobstones/gobstones-scripts');

config.init();
const rootDir = config.locations.projectRoot;
const tsConfigPath = config.projectType.tsConfigJSON.toolingFile;

module.exports = {
    entryPoints: [`${rootDir}/src`],
    tsconfig: `${tsConfigPath}`,
    compilerOptions: {
        rootDir: `${rootDir}/src`
    },
    entryPointStrategy: 'expand',
    out: `${rootDir}/docs`,
    includes: `${rootDir}/src`,
    exclude: [`${rootDir}/node_modules/**/*`, `${rootDir}/**/*.test.ts`, `${rootDir}/src/index.ts`],
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
