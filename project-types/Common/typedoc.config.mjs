import { config } from '@gobstones/gobstones-scripts';

config.init();
const rootDir = config.locations.projectRoot;
const tsConfigPath = config.projectType.typescript.toolingFiles.main;

export default {
    // Configuration
    tsconfig: `${tsConfigPath}`,
    compilerOptions: {
        rootDir: `${rootDir}/src`
    },
    plugin: ['@gobstones/typedoc-theme-gobstones'],
    // Input
    entryPoints: [`${rootDir}/src`],
    entryPointStrategy: 'expand',
    exclude: [
        `${rootDir}/node_modules/**/*`,
        `${rootDir}/**/*.test.ts`,
        `${rootDir}/src/@types/**/*`,
        `${rootDir}/src/index.ts`
    ],
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false,
    // Output
    out: `${rootDir}/docs`,
    theme: 'gobstones'
};
