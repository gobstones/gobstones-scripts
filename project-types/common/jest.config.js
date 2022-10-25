const fs = require('fs');
const path = require('path');

/* eslint-disable */
const config = require('../../src/api').config();

module.exports = {
    preset: 'ts-jest',
    transform: {
        "^.+\\.tsx?$": ['ts-jest', {
            tsconfig: config.tsConfigFile,
            importHelpers: true
        }],
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
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "identity-obj-proxy",
        "\\.(css|less|scss|less|sass)$": "identity-obj-proxy"
    }
};
