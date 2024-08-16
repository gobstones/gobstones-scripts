import { config } from '@gobstones/gobstones-scripts';

config.init();
const rootDir = config.locations.projectRoot;
const tsConfigPath = config.projectType.tsConfigJSON.toolingFile;

export default {
    entryPoints: [`${rootDir}/src`],
    entryPointStrategy: 'expand',
    tsconfig: `${tsConfigPath}`,
    compilerOptions: {
        rootDir: `${rootDir}/src`
    },
    out: `${rootDir}/docs`,
    exclude: [`${rootDir}/node_modules/**/*`, `${rootDir}/**/*.test.ts`, `${rootDir}/src/index.ts`],
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
        'protected': false,
        'private': false,
        'inherited': false
    },
    theme: 'gobstones',
    mergeModulesMergeMode: 'module-category'
};
