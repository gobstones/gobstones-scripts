/* eslint-disable @typescript-eslint/no-var-requires */
const { tasks } = require('@gobstones/gobstones-scripts');

const defaultConfiguration = {
    options: {
        scripts: false,
        logLevel: 'warn',
        'help-style': 'basic'
    },

    scripts: {
        default: {
            script: tasks.nps('help'),
            hiddenFromHelp: true
        },

        dev: {
            script: tasks.echo('No action specified for dev. You should configure this task.', 'red'),
            description: 'Execute in development mode'
        },

        build: {
            script: tasks.echo('No action specified for build. You should configure this task.', 'red'),
            description: 'Build the application into "dist" folder'
        },

        test: {
            script: tasks.serially(
                tasks.nps('lint'),
                tasks.echo('No action specified for test. You should configure this task.', 'red')
            ),
            description: 'Run the tests, including linting'
        },

        doc: {
            script: tasks.echo('No action specified for doc. You should configure this task.', 'red'),
            description: 'Generate the documentation in the "docs" folder',
            serve: {
                script: tasks.serially(tasks.nps('doc'), tasks.serve({ dir: './docs' })),
                description: 'Generate the documentation in the "docs" folder, then serve the docs as HTML'
            }
        },

        lint: {
            script: tasks.echo('No action specified for lint. You should configure this task.', 'red'),
            description: 'Run the linter on all the files (src and tests)',
            fix: {
                script: tasks.echo('No action specified for lint with autofix. You should configure this task.', 'red'),
                description: 'Run the linter with automatic fixing option'
            }
        },

        prettify: {
            script: tasks.echo('No action specified for test. You should configure this task.', 'red'),
            description: 'Run Prettier on all the files, writing the results'
        },

        changelog: {
            script: tasks.npx('conventional-changelog -p angular -i CHANGELOG.md -s'),
            description: 'Generate changelog based on commits',
            scratch: {
                script: tasks.npx('conventional-changelog -p angular -i CHANGELOG.md -s -r 0'),
                description: 'Generate changelog based on tags, starting from scratch',
                hiddenFromHelp: true
            },
            hiddenFromHelp: true
        }
    }
};

module.exports = defaultConfiguration;
