/* eslint-disable */
const config = require('../src/api').config;

module.exports = {
    "compilerOptions": {
        "target": "es2015",
        "rootDir": config.root + "/src",
        "esModuleInterop": true,
        "allowJs": true,
        "sourceMap": true,
        "declaration": true,
        "declarationMap": true,
        "declarationDir": "dist/typings",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "stripInternal": true,
        "composite": false,
        "skipLibCheck": true
    },
    "include": [
        config.root + "/src/**/*"
    ]
}
