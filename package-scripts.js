/* eslint-disable */
const { tasks } = require('./src/api');

const defaultConfiguration = {
    options: { 'help-style': 'basic' },
    scripts: {
        default: tasks.nps('help'),

        doc: {
            script: tasks.serially(
                tasks.nps('clean.docs'),
                tasks.typedoc(),
                tasks.copy({ src: './docs/index.html', dest: './docs/globals.html' })
            ),
            description: 'Run JSDocs and generate docs',
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
                        tasks.concurrently(tasks.typedoc({ watch: true }), tasks.serve('./docs'))
                    ),
                    description:
                        'Run Typedoc and generate docs and watch for changes while serving the docs as HTML'
                }
            }
        },

        clean: {
            script: tasks.serially(tasks.nps('clean.docs')),
            description: 'Remove all automatically generated files and folders',
            docs: {
                script: tasks.remove({ files: './docs' }),
                description: 'Delete the docs folder',
                silent: true
            }
        },

        lint: {
            script: tasks.eslint({ files: './src', extensions: 'js' }),
            description: 'Run ESLint on all the files (src and tests)',
            fix: {
                script: tasks.eslint({ files: './src', fix: true }),
                description: 'Run ESLint on all the files (src and tests) with --fix option'
            }
        },

        prettify: {
            script: tasks.prettify({ files: './src/{**,.}/*.js' }),
            description: 'Run Prettier on all the files, writing the results'
        }
    }
};

module.exports = defaultConfiguration;
