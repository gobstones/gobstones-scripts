/* eslint-disable */
module.exports = {
    plugins: ['plugins/markdown'],
    opts: {
        // "template": "templates/default",
        template: 'node_modules/docdash',
        encoding: 'utf8',
        readme: './README.md',
        destination: './docs',
        recurse: true
    },
    recurseDepth: 10,
    markdown: {
        idInHeadings: true
    },
    sourceType: 'module',
    tags: {
        allowUnknownTags: true,
        dictionaries: ['jsdoc', 'closure']
    },
    templates: {
        cleverLinks: false,
        monospaceLinks: false,
        default: {
            outputSourcePath: false,
            outputSourceFiles: false
        }
    },
    source: {
        include: './src',
        includePattern: '\\/.+\\.js(doc|x)?$',
        excludePattern: '(^|\\/|\\\\)_'
    }
};
