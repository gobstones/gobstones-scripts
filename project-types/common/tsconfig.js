/* eslint-disable */
const config = require('../../src/api').config;

module.exports = {
    "compilerOptions": {
        "target": "es2015",
        "rootDir": config.projectRootPath + "/src",
        "esModuleInterop": true,
        "allowJs": true,
        "sourceMap": true,
        "declaration": true,
        "declarationMap": true,
        "declarationDir": config.projectRootPath + "/dist/typings",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "stripInternal": true,
        "composite": false,
        "skipLibCheck": true,
        // For react build
        "jsx": "react",
        "module": "ESNext"
    },
    "include": [
        config.projectRootPath + "/src/**/*"
    ]
}
