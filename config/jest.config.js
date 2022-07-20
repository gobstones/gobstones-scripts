/* eslint-disable */
const config = require('../src/api').config;

module.exports = {
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            tsconfig: config.files.ts,
            importHelpers: true
        }
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
    transformIgnorePatterns: []
};
