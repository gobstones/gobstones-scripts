/* eslint-disable */
const { tasks } = require('../../src/api');

const defaultConfiguration = {
    options: { 'help-style': 'basic' },
    scripts: {
        default: tasks.nps('help'),

        dev: {
            script: tasks.storybook.start({port: 3001}),
            description: 'Run a storybook webpage with the component'
        },

        build: {
            script: tasks.serially(
                tasks.nps('clean.dist'),
                tasks.rollup()
            ),
            description: 'Build the application into "dist" folder',
            watch: {
                script: tasks.serially(tasks.nps('clean.dist'), tasks.rollup({ watch: './src/**/*' })),
                description: 'Build the application into "dist" folder and watch for changes'
            }
        },

        test: {
            script: tasks.serially(tasks.nps('clean.coverage'), tasks.nps('lint'), tasks.jest({ coverage: true })),
            description: 'Run the tests, including linting',
            watch: {
                script: tasks.serially(tasks.jest({ coverage: true, watch: true })),
                description: 'Run the tests with no linting, and wait for changes'
            },
            serve: {
                script: tasks.serially(
                    tasks.nps('clean.coverage'),
                    tasks.jest({ coverage: true, noThreshold: true }),
                    tasks.serve('./coverage')
                ),
                description:
                    'Run the tests, including linting, and serve the coverage reports in HTML',
                watch: {
                    script: tasks.serially(
                        tasks.nps('clean.coverage'),
                        tasks.concurrently({
                            jest: tasks.jest({ coverage: true, noThreshold: true, watch: true }),
                            serve: tasks.serve('./coverage')
                        })
                    ),
                    description:
                        'Run the tests with no linting, and wait for changes, and serve the coverage report'
                }
            }
        },

        doc: {
            script: tasks.serially(
                tasks.nps('clean.docs'),
                tasks.storybook.build({dir: 'docs'})
            ),
            description: 'Generate a static storybook as documentation for the exported components',
            serve: {
                script: tasks.serially(tasks.nps('doc'), tasks.serve('./docs')),
                description: 'Generate a static storybook as documentation for the exported components, then serve the docs as HTML',
            },
        },

        clean: {
            script: tasks.serially(tasks.nps('clean.dist'), tasks.nps('clean.docs'), tasks.nps('clean.coverage')),
            description: 'Remove all automatically generated files and folders',
            dist: {
                script: tasks.remove({ files: './dist' }),
                description: 'Delete the dist folder',
                silent: true
            },
            docs: {
                script: tasks.remove({ files: './docs' }),
                description: 'Delete the docs folder',
                silent: true
            },
            coverage: {
                script: tasks.remove({ files: './coverage' }),
                description: 'Delete the coverage folder',
                silent: true
            }
        },

        lint: {
            script: tasks.serially(tasks.eslint({ files: './src' }), tasks.eslint({ files: './test' })),
            description: 'Run ESLint on all the files (src and tests)',
            fix: {
                script: tasks.serially(
                    tasks.eslint({ files: './src', fix: true }),
                    tasks.eslint({ files: './test', fix: true })
                ),
                description: 'Run ESLint on all the files (src and tests) with --fix option'
            }
        },

        prettify: {
            script: tasks.prettify({ files: './src/{**,.}/*.ts' }),
            description: 'Run Prettier on all the files, writing the results'
        },

        husky: {
            commit: {
                script: tasks.serially(
                    tasks.nps('prettify'),
                    tasks.nps('doc')
                ),
                silent: true
            },
            push: {
                script: tasks.serially(
                    tasks.nps('test')
                ),
                silent: true
            }
        }
    }
};

module.exports = defaultConfiguration;
