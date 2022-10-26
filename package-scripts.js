/* eslint-disable */
const { tools } = require('./src/api');

const defaultConfiguration = {
    scripts: {
        default: tools.nps('help'),

        doc: {
            script: tools.series(
                tools.nps('clean.docs'),
                tools.typedoc(),
                tools.copy({ src: './docs/index.html', dest: './docs/globals.html' })
            ),
            description: 'Run JSDocs and generate docs',
            watch: {
                script: tools.series(tools.nps('doc'), tools.typedoc({ watch: true })),
                description: 'Run Typedoc and generate docs and watch for changes.'
            },
            serve: {
                script: tools.series(tools.nps('doc'), tools.serve('./docs')),
                description: 'Run Typedoc and generate docs, then serve the docs as HTML',
                watch: {
                    script: tools.series(
                        tools.nps('doc'),
                        tools.concurrent(tools.typedoc({ watch: true }), tools.serve('./docs'))
                    ),
                    description:
                        'Run Typedoc and generate docs and watch for changes while serving the docs as HTML'
                }
            }
        },

        clean: {
            script: tools.series(tools.nps('clean.docs')),
            description: 'Remove all automatically generated files and folders',
            docs: {
                script: tools.remove({ files: './docs' }),
                description: 'Delete the docs folder',
                silent: true
            }
        },

        lint: {
            script: tools.eslint({ files: './src', extensions: 'js' }),
            description: 'Run ESLint on all the files (src and tests)',
            fix: {
                script: tools.eslint({ files: './src', fix: true }),
                description: 'Run ESLint on all the files (src and tests) with --fix option'
            }
        },

        prettier: {
            script: tools.prettier({ files: './src/{**,.}/*.js' }),
            description: 'Run Prettier on all the files, writing the results'
        }
    }
};

module.exports = defaultConfiguration;
