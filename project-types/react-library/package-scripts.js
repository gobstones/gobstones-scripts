/* eslint-disable */
const { tools } = require('../../src/api');

const defaultConfiguration = {
    options: { 'help-style': 'basic' },
    scripts: {
        default: tools.nps('help'),

        dev: {
            script: 'start-storybook -p 3001',
            description: 'Run a storybook webpage with the component'
        },

        build: {
            script: tools.series(tools.nps('clean.dist'), tools.rollup()),
            description: 'Build the application into "dist" folder',
            watch: {
                script: tools.series(tools.nps('clean.dist'), tools.rollup({ watch: './src/**/*' })),
                description: 'Build the application into "dist" folder and watch for changes'
            }
        },

        test: {
            script: tools.series(/*tools.nps('clean.coverage'), tools.nps('lint'), */ tools.jest({ coverage: true })),
            description: 'Run the tests, including linting',
            watch: {
                script: tools.series(tools.jest({ coverage: true, watch: true })),
                description: 'Run the tests with no linting, and wait for changes'
            },
            serve: {
                script: tools.series(
                    tools.nps('clean.coverage'),
                    tools.jest({ coverage: true, noThreshold: true }),
                    tools.serve('./coverage')
                ),
                description:
                    'Run the tests, including linting, and serve the coverage reports in HTML',
                watch: {
                    script: tools.series(
                        tools.nps('clean.coverage'),
                        tools.concurrent(
                            tools.jest({ coverage: true, noThreshold: true, watch: true }),
                            tools.serve('./coverage')
                        )
                    ),
                    description:
                        'Run the tests with no linting, and wait for changes, and serve the coverage report'
                }
            }
        },

        doc: {
            script: tools.series(
                tools.nps('clean.docs'),
                'build-storybook --output-dir docs'
            ),
            description: 'Generate a static storybook as documentation for the exported components',
            serve: {
                script: tools.series(tools.nps('doc'), tools.serve('./docs')),
                description: 'Generate a static storybook as documentation for the exported components, then serve the docs as HTML',
            },
        },

        clean: {
            script: tools.series(tools.nps('clean.dist'), tools.nps('clean.docs'), tools.nps('clean.coverage')),
            description: 'Remove all automatically generated files and folders',
            dist: {
                script: tools.remove({ files: './dist' }),
                description: 'Delete the dist folder',
                silent: true
            },
            docs: {
                script: tools.remove({ files: './docs' }),
                description: 'Delete the docs folder',
                silent: true
            },
            coverage: {
                script: tools.remove({ files: './coverage' }),
                description: 'Delete the coverage folder',
                silent: true
            }
        },

        lint: {
            script: tools.series(tools.eslint({ files: './src' }), tools.eslint({ files: './test' })),
            description: 'Run ESLint on all the files (src and tests)',
            fix: {
                script: tools.series(
                    tools.eslint({ files: './src', fix: true }),
                    tools.eslint({ files: './test', fix: true })
                ),
                description: 'Run ESLint on all the files (src and tests) with --fix option'
            }
        },

        prettier: {
            script: tools.prettier({ files: './src/{**,.}/*.ts' }),
            description: 'Run Prettier on all the files, writing the results'
        }
    }
};

module.exports = defaultConfiguration;
