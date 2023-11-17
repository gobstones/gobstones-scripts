/* eslint-disable @typescript-eslint/no-var-requires */
const { config } = require('@gobstones/gobstones-scripts');

module.exports = {
    'ts-node': {
        compilerOptions: {
            module: 'commonjs'
        }
    },
    compilerOptions: {
        target: 'es2015',
        rootDir: config.projectRootPath + '/src',
        esModuleInterop: true,
        allowJs: true,
        sourceMap: true,
        declaration: true,
        declarationMap: true,
        declarationDir: config.projectRootPath + '/dist/typings',
        moduleResolution: 'node',
        resolveJsonModule: true,
        stripInternal: true,
        composite: false,
        skipLibCheck: true,
        // For react build
        jsx: 'react',
        module: 'ESNext'
    },
    include: [config.projectRootPath + '/src/**/*']
};
