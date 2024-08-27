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
    exclude: [
        `${rootDir}/node_modules/**/*`,
        `${rootDir}/**/*.test.ts`,
        `${rootDir}/src/@types/**/*`,
        `${rootDir}/src/index.ts`
    ],
    plugin: ['@gobstones/typedoc-theme-gobstones'],
    theme: 'gobstones',
    excludeExternals: true,
    excludeInternal: false,
    excludePrivate: false
};
