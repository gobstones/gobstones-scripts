const config = require('../../src/api').config;

module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: config.configurationFiles[config.loadedOptions.type].tsConfigFile,
                importHelpers: true
            }
        ]
    },
    coverageReporters: ['text', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10
        }
    },
    testPathIgnorePatterns: ['<rootDir>/src/test.ts'],
    transformIgnorePatterns: [],
    moduleNameMapper: {
        // styles
        '\\.(css|less|scss|less|sass)$': '<rootDir>/.jest/proxies/identity-obj-proxy-esm',
        // images
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/.jest/proxies/identity-obj-proxy-esm',
        // fonts
        '\\.(eot|otf|ttf|woff|woff2)$': '<rootDir>/.jest/proxies/identity-obj-proxy-esm',
        // audio
        '\\.(wav|mp3|m4a|aac|oga)$': '<rootDir>/.jest/proxies/identity-obj-proxy-esm',
        // video
        '\\.(mp4|webm)$': '<rootDir>/.jest/proxies/identity-obj-proxy-esm'
        // others (add below if needed)
    }
};
