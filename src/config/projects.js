/**
 * The name of all available project manager supported by the application.
 *
 * @type {object}
 *
 * @internal
 * @static
 * @memberof Config.Project
 */
const projectTypes = ['library', 'cli-library', 'react-library'];

/**
 * Each library includes the files/folder it supports,
 * including where to find the file in the project folder.
 */
const library = {
    // only on init
    src: {
        localPath: ['library/src'],
        projectPath: ['src'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    test: {
        localPath: ['library/test'],
        projectPath: ['test'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    changelog: {
        localPath: ['common/CHANGELOG.md'],
        projectPath: ['CHANGELOG.md'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    packageJson: {
        localPath: ['library/package.json'],
        projectPath: ['package.json'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    readme: {
        localPath: ['common/README.md'],
        projectPath: ['README.md'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    // on init but also on any update
    github: {
        localPath: ['common/github'],
        projectPath: ['.github'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    vscode: {
        localPath: ['common/vscode'],
        projectPath: ['.vscode'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    license: {
        localPath: ['common/LICENSE'],
        projectPath: ['LICENSE'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    contributing: {
        localPath: ['common/CONTRIBUTING.md'],
        projectPath: ['CONTRIBUTING.md'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    editorconfig: {
        localPath: ['common/editorconfig'],
        projectPath: ['.editorconfig'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    prettier: {
        localPath: ['common/prettierignore', 'common/prettierrc'],
        projectPath: ['.prettierignore', '.prettierrc'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    npm: {
        localPath: ['common/npmignore', 'common/npmrc'],
        projectPath: ['.npmignore', '.npmrc'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    eslint: {
        localPath: ['common/eslintrc.js'],
        projectPath: ['.eslintrc.js'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    git: {
        localPath: ['common/gitignore'],
        projectPath: ['.gitignore'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    // only on eject
    nps: {
        localPath: ['library/package-scripts.js'],
        projectPath: ['package-scripts.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    rollup: {
        localPath: ['library/rollup.config.js'],
        projectPath: ['rollup.config.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    ts: {
        localPath: ['common/tsconfig.js'],
        projectPath: ['tsconfig.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    typedoc: {
        localPath: ['common/typedoc.js'],
        projectPath: ['typedoc.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    jest: {
        localPath: ['common/jest.config.js'],
        projectPath: ['jest.config.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    }
};

const cliLibrary = {
    // only on init
    src: {
        localPath: ['cli-library/src'],
        projectPath: ['src'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    test: {
        localPath: ['cli-library/test'],
        projectPath: ['test'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    changelog: {
        localPath: ['common/CHANGELOG.md'],
        projectPath: ['CHANGELOG.md'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    packageJson: {
        localPath: ['cli-library/package.json'],
        projectPath: ['package.json'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    readme: {
        localPath: ['common/README.md'],
        projectPath: ['README.md'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    // on init and also on update
    github: {
        localPath: ['common/github'],
        projectPath: ['.github'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    vscode: {
        localPath: ['common/vscode'],
        projectPath: ['.vscode'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    license: {
        localPath: ['common/LICENSE'],
        projectPath: ['LICENSE'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    contributing: {
        localPath: ['common/CONTRIBUTING.md'],
        projectPath: ['CONTRIBUTING.md'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    editorconfig: {
        localPath: ['common/editorconfig'],
        projectPath: ['.editorconfig'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    prettier: {
        localPath: ['common/prettierignore', 'common/prettierrc'],
        projectPath: ['.prettierignore', '.prettierrc'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    npm: {
        localPath: ['common/npmignore', 'common/npmrc'],
        projectPath: ['.npmignore', '.npmrc'],
        onInit: false,
        onUpdate: true,
        onEject: false
    },
    eslint: {
        localPath: ['common/eslintrc.js'],
        projectPath: ['.eslintrc.js'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    git: {
        localPath: ['common/gitignore'],
        projectPath: ['.gitignore'],
        onInit: false,
        onUpdate: true,
        onEject: false
    },
    nps: {
        localPath: ['cli-library/package-scripts.js'],
        projectPath: ['package-scripts.js'],
        onInit: false,
        onUpdate: true,
        onEject: false
    },
    // only on eject
    rollup: {
        localPath: ['cli-library/rollup.config.js'],
        projectPath: ['rollup.config.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    ts: {
        localPath: ['common/tsconfig.js'],
        projectPath: ['tsconfig.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    typedoc: {
        localPath: ['common/typedoc.js'],
        projectPath: ['typedoc.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    jest: {
        localPath: ['common/jest.config.js'],
        projectPath: ['jest.config.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    }
};

const reactLibrary = {
    // only on init
    src: {
        localPath: ['react-library/src'],
        projectPath: ['src'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    test: {
        localPath: ['react-library/test'],
        projectPath: ['test'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    changelog: {
        localPath: ['common/CHANGELOG.md'],
        projectPath: ['CHANGELOG.md'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    packageJson: {
        localPath: ['react-library/package.json'],
        projectPath: ['package.json'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    readme: {
        localPath: ['common/README.md'],
        projectPath: ['README.md'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    stories: {
        localPath: ['react-library/stories'],
        projectPath: ['stories'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    // on init and also on update
    storybook: {
        localPath: ['react-library/storybook'],
        projectPath: ['storybook'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    github: {
        localPath: ['common/github'],
        projectPath: ['.github'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    vscode: {
        localPath: ['common/vscode'],
        projectPath: ['.vscode'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    license: {
        localPath: ['common/LICENSE'],
        projectPath: ['LICENSE'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    contributing: {
        localPath: ['common/CONTRIBUTING.md'],
        projectPath: ['CONTRIBUTING.md'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    editorconfig: {
        localPath: ['common/editorconfig'],
        projectPath: ['.editorconfig'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    prettier: {
        localPath: ['common/prettierignore', 'common/prettierrc'],
        projectPath: ['.prettierignore', '.prettierrc'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    npm: {
        localPath: ['common/npmignore', 'common/npmrc'],
        projectPath: ['.npmignore', '.npmrc'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    eslint: {
        localPath: ['common/eslintrc.js'],
        projectPath: ['.eslintrc.js'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    git: {
        localPath: ['common/gitignore'],
        projectPath: ['.gitignore'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    nps: {
        localPath: ['react-library/package-scripts.js'],
        projectPath: ['package-scripts.js'],
        onInit: false,
        onUpdate: true,
        onEject: false
    },
    // only on eject
    rollup: {
        localPath: ['react-library/rollup.config.js'],
        projectPath: ['rollup.config.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    ts: {
        localPath: ['common/tsconfig.js'],
        projectPath: ['tsconfig.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    typedoc: {
        localPath: ['common/typedoc.js'],
        projectPath: ['typedoc.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    jest: {
        localPath: ['common/jest.config.js'],
        projectPath: ['jest.config.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    }
};

function retainKeysMatching(obj, onKey) {
    return Object.keys(obj).filter((e) => obj[e][onKey]);
}
function addOnInitEjectUpdate(obj) {
    obj.onInit = retainKeysMatching(obj, 'onInit');
    obj.onEject = retainKeysMatching(obj, 'onEject');
    obj.onUpdate = retainKeysMatching(obj, 'onUpdate');
}
addOnInitEjectUpdate(library);
addOnInitEjectUpdate(cliLibrary);
addOnInitEjectUpdate(reactLibrary);

module.exports = {
    projectTypes,
    library,
    'cli-library': cliLibrary,
    'react-library': reactLibrary
};
