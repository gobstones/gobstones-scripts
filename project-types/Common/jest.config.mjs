import { config } from '@gobstones/gobstones-scripts';

config.init();
const tsConfigPath = config.projectType.tsConfigJSON.toolingFile;

export default {
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: `${tsConfigPath}`,
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
    coveragePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/.jest', '<rootDir>/test'],
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
