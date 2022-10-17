/* eslint-disable */
const config = require('../../src/api').config();

module.exports = {
    "entryPoints": [
        config.root + "/src"
    ],
    "tsconfig": config.tsConfigFile,
    "compilerOptions": {
        "rootDir": config.root + '/src',
    },
    "entryPointStrategy": "expand",
    "out": config.root + "/docs",
    "includes": config.root + "/src",
    "exclude": [
        config.root + "/**/*.test.ts",
        config.root +  "/src/index.ts",
        config.root +  "/node_modules/**/*"
    ],
    "includeVersion": true,
    "categorizeByGroup": true,
    "excludeExternals": true,
    "excludeInternal": false,
    "excludePrivate": false,
    "hideGenerator": true,
    "disableSources": true,
    "githubPages": true,
    "mergeModulesMergeMode": "module"
}
