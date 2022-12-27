/* eslint-disable */
const { tasks } = require('../../src/api');

const defaultConfiguration = {
    options: { 'help-style': 'basic' },
    scripts: {
        default: tasks.nps('help'),

        dev: {
            script: tasks.tsNode({ file: './src/index.ts' }),
            description: 'Run "index.ts" in development mode',
            watch: {
                script: tasks.tsNode({ file: './src/index.ts', watch: './src/**/*.ts' }),
                description: 'Run "index.ts" in development mode and watch for changes'
            }
        },

        build: {
            script: tasks.serially(tasks.nps('clean.dist'), tasks.rollup()),
            description: 'Build the application into "dist" folder',
            watch: {
                script: tasks.serially(
                    tasks.nps('clean.dist'),
                    tasks.rollup({ watch: './src/**/*' })
                ),
                description: 'Build the application into "dist" folder and watch for changes'
            }
        },

        test: {
            script: tasks.serially(
                tasks.nps('clean.coverage'),
                tasks.nps('lint'),
                tasks.jest({ coverage: true })
            ),
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
                tasks.typedoc(),
                tasks.copy({ src: './docs/index.html', dest: './docs/globals.html' })
            ),
            description: 'Run Typedoc and generate docs',
            watch: {
                script: tasks.serially(tasks.nps('doc'), tasks.typedoc({ watch: true })),
                description: 'Run Typedoc and generate docs and watch for changes.'
            },
            serve: {
                script: tasks.serially(tasks.nps('doc'), tasks.serve('./docs')),
                description: 'Run Typedoc and generate docs, then serve the docs as HTML',
                watch: {
                    script: tasks.serially(
                        tasks.nps('doc'),
                        tasks.concurrently({
                            typedoc: tasks.typedoc({ watch: true }),
                            serve: tasks.serve('./docs')
                        })
                    ),
                    description:
                        'Run Typedoc and generate docs and watch for changes while serving the docs as HTML'
                }
            }
        },

        clean: {
            script: tasks.serially(
                tasks.nps('clean.dist'),
                tasks.nps('clean.docs'),
                tasks.nps('clean.coverage')
            ),
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
            script: tasks.serially(
                tasks.eslint({ files: './src' }),
                tasks.eslint({ files: './test' })
            ),
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
            script: tasks.serially(
                tasks.prettify({ files: './src/{**,.}/*.ts' }),
                tasks.prettify({ files: './test/{**,.}/*.ts' }),
                tasks.prettify({ files: './.github/{**,.}/*.{yml,md}' }),
                tasks.prettify({ files: './.vscode/*.json' }),
                tasks.prettify({ files: './*.{json,md,js}' }),
                tasks.prettify({ files: '.prettierrc' })
            ),
            description: 'Run Prettier on all the files, writing the results'
        },

        husky: {
            commit: {
                script: tasks.serially(tasks.nps('prettify'), tasks.nps('doc')),
                silent: true
            },
            push: {
                script: tasks.serially(tasks.nps('test')),
                silent: true
            }
        }
    }
};

module.exports = defaultConfiguration;
