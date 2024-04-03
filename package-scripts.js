module.exports = {
    options: {
        scripts: false,
        logLevel: 'warn',
        'help-style': 'basic'
    },

    scripts: {
        default: {
            script: 'nps help',
            hiddenFromHelp: true
        },

        dev: {
            script: 'tsc --noEmit && tsx ./src/index.ts --ignore-watch',
            description: 'Run "index.ts" in development mode'
        },

        test: {
            script: 'nps lint',
            description: 'Run ESLint on all the files (src and tests)'
        },

        build: {
            script:
                'nps clean.dist ' +
                '&& rollup --config ./rollup.config.js --bundleConfigAsCjs ' +
                '&& chmod +x ./dist/cjs/cli.cjs',
            description: 'Build the application into "dist" folder'
        },

        doc: {
            script: 'nps clean.docs && typedoc',
            description: 'Run Typedoc and generate docs',
            serve: {
                script: 'nps doc && serve ./docs',
                description: 'Run Typedoc and generate docs, then serve the docs as HTML'
            }
        },

        clean: {
            script: 'nps clean.dist && nps clean.docs',
            description: 'Remove all automatically generated files and folders',
            hiddenFromHelp: true,
            dist: {
                script: 'rimraf ./dist',
                description: 'Delete the dist folder',
                hiddenFromHelp: true
            },
            docs: {
                script: 'rimraf ./docs',
                description: 'Delete the docs folder',
                hiddenFromHelp: true
            }
        },

        lint: {
            script: 'eslint ./src --format stylish --ext js,jsx,ts,tsx --color',
            description: 'Run ESLint on all the files (src and tests)',
            fix: {
                script: 'eslint ./src --format stylish --ext js,jsx,ts,tsx --color --fix',
                description: 'Run ESLint on all the files (src and tests) with --fix option'
            }
        },

        prettify: {
            script:
                'prettier --no-error-on-unmatched-pattern --write ./src/{**,.}/*.{js,ts} ' +
                '&& prettier --no-error-on-unmatched-pattern --write ' +
                './project-types/**/*.{ts,tsx,md,json} ' +
                '&& prettier --no-error-on-unmatched-pattern --write ./.github/{**,.}/*.{yml,md} ' +
                '&& prettier --no-error-on-unmatched-pattern --write ./.vscode/*.json ' +
                '&& prettier --no-error-on-unmatched-pattern --write ./*.{json,md,js} ' +
                '&& prettier --no-error-on-unmatched-pattern --write .prettierrc',
            description: 'Run Prettier on all the files, writing the results'
        },

        verdaccio: {
            script:
                'concurrently --kill-others-on-fail --prefix-colors bgBlue.bold,bgMagenta.bold ' +
                '--prefix "[{name}]" --names verdaccio.serve,publish ' +
                '"nps verdaccio.serve" ' +
                '"rimraf ./test/verdaccio/storage/* && npm publish --registry http://localhost:4567"',
            description: 'Run Verdaccio server and publish current version of library to it',
            serve: {
                script: 'verdaccio --config ./test/verdaccio/config.yml',
                description: 'Start the verdaccio server',
                hiddenFromHelp: true
            }
        },

        changelog: {
            script: 'conventional-changelog -p angular -i CHANGELOG.md -s',
            hiddenFromHelp: true,
            description: 'Generate changelog based on tags',
            scratch: {
                script: 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0',
                description: 'Generate changelog based on tags, starting from scratch',
                hiddenFromHelp: true
            }
        },

        license: {
            script:
                'npx tsconfig.js --once --root=./project-types/common/license.config.js --add-comments=none ' +
                '&& license-check-and-add add -f ./project-types/common/license.config.json ' +
                '&& npx rimraf ./project-types/common/license.config.json',
            hiddenFromHelp: true,
            description: 'Add license information to all code files in the project',
            remove: {
                script:
                    'npx tsconfig.js --once --root=./project-types/common/license.config.js --add-comments=none ' +
                    '&& license-check-and-add remove -f ./project-types/common/license.config.json ' +
                    '&& npx rimraf ./project-types/common/license.config.json',

                hiddenFromHelp: true,
                description: 'Add license information to all code files in the project'
            }
        }
    }
};
