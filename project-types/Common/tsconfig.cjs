const { config } = require('@gobstones/gobstones-scripts');

config.init();
const rootDir = config.locations.projectRoot;

module.exports = {
    'ts-node': {
        compilerOptions: {
            module: 'commonjs'
        }
    },
    compilerOptions: {
        target: 'es2015',
        rootDir: `${rootDir}/src`,
        esModuleInterop: true,
        allowJs: true,
        sourceMap: true,
        declaration: true,
        declarationMap: true,
        declarationDir: `${rootDir}/dist/typings`,
        moduleResolution: 'node',
        resolveJsonModule: true,
        stripInternal: true,
        composite: false,
        skipLibCheck: true,
        // For react build
        jsx: 'react',
        module: 'ESNext'
    },
    include: [`${rootDir}/src/**/*`]
};
