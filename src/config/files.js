/**
 * The file names and extensions for the different tools
 * in use.
 *
 * @internal
 * @namespace Config.Files
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * The configuration file for all files in the application to handle.
 *
 * @type {object}
 *
 * @internal
 * @static
 * @memberof Config.Files
 */
const files = {
    init: {
        src: { folders: ['src'], isCommon: false },
        test: { folders: ['test'], isCommon: false },
        changelog: { files: ['CHANGELOG.md'], isCommon: true },
        'package.json': { files: ['package.json'], isCommon: false },
        readme: { files: ['README.md'], isCommon: true }
    },
    update: {
        storybook: { folders: ['storybook'], renames: ['.storybook'], isCommon: false },
        github: { folders: ['github'], renames: ['.github'], isCommon: true },
        vscode: { folders: ['vscode'], renames: ['.vscode'], isCommon: true },
        license: { files: ['LICENSE'], isCommon: true },
        contributing: { files: ['CONTRIBUTING.md'], isCommon: true },
        editorconfig: { files: ['editorconfig'], renames: ['.editorconfig'], isCommon: true },
        prettier: {
            files: ['prettierignore', 'prettierrc'],
            renames: ['.prettierignore', '.prettierrc'],
            isCommon: true
        },
        npm: {
            files: ['npmignore', 'npmrc'],
            renames: ['.npmignore', '.npmrc'],
            isCommon: true
        },
        eslint: { files: ['eslintrc.js'], renames: ['.eslintrc.js'], isCommon: true },
        git: { files: ['gitignore'], renames: ['.gitignore'], isCommon: true }
    },
    eject: {
        nps: { files: ['package-scripts.js'], isCommon: false },
        rollup: { files: ['rollup.config.js'], isCommon: false },
        ts: { files: ['tsconfig.js'], isCommon: true },
        typedoc: { files: ['typedoc.js'], isCommon: true },
        jest: { files: ['jest.config.js'], isCommon: true }
    }
};

module.exports = {
    files
};
