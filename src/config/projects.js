/**
 * This module contains the configuration pertaining the data
 * for all possible types of project the user may create with this tool.
 *
 * @internal
 * @namespace Config.Projects
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * The name of all available project manager supported by the application.
 *
 * @type {object}
 *
 * @static
 * @internal
 * @memberof Config.Project
 */
const projectTypes = ['library', 'cli-library', 'react-library' /* , 'web-library' */];

function getClassicConfigForPath(path) {
    return {
        // only on init
        src: {
            localPath: [path + '/src'],
            projectPath: ['src'],
            onInit: true,
            onUpdate: false,
            onEject: false
        },
        test: {
            localPath: [path + '/test'],
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
            localPath: [path + '/package.json'],
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
        husky: {
            localPath: ['common/husky'],
            projectPath: ['.husky'],
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
        commitlint: {
            localPath: ['common/czrc', 'common/commitlint.config.js'],
            projectPath: ['.czrc', 'commitlint.config.js'],
            onInit: true,
            onUpdate: true,
            onEject: false
        },
        // only on eject
        nps: {
            localPath: [path + '/package-scripts.js'],
            projectPath: ['package-scripts.js'],
            onInit: false,
            onUpdate: false,
            onEject: true
        },
        rollup: {
            localPath: [path + '/rollup.config.js'],
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
}

/**
 * The library definition.
 *
 * @static
 * @internal
 * @memberof Config.Projects
 */
const library = getClassicConfigForPath('library');

/**
 * The cli-library definition.
 *
 * @static
 * @internal
 * @memberof Config.Projects
 */
const cliLibrary = getClassicConfigForPath('cli-library');

/**
 * The web-library definition.
 *
 * @static
 * @internal
 * @memberof Config.Projects
 */
const webLibrary = Object.assign(getClassicConfigForPath('web-library'), {
    demos: {
        localPath: ['web-library/demos'],
        projectPath: ['demos'],
        onInit: true,
        onUpdate: false,
        onEject: false
    }
});

/**
 * The react-library definition.
 *
 * @static
 * @internal
 * @memberof Config.Projects
 */
const reactLibrary = Object.assign(getClassicConfigForPath('react-library'), {
    typedoc: {
        localPath: ['react-library/typedoc.js'],
        projectPath: ['typedoc.js'],
        onInit: false,
        onUpdate: false,
        onEject: true
    },
    jest: {
        localPath: ['common/jest.config.js'],
        projectPath: ['jest.config.js'],
        onInit: false,
        onUpdate: true,
        onEject: false
    },
    jestproxies: {
        localPath: ['react-library/jest'],
        projectPath: ['.jest'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    vite: {
        localPath: ['react-library/vite.config.ts'],
        projectPath: ['vite.config.ts'],
        onInit: true,
        onUpdate: true,
        onEject: false
    },
    stories: {
        localPath: ['react-library/stories'],
        projectPath: ['stories'],
        onInit: true,
        onUpdate: false,
        onEject: false
    },
    storybook: {
        localPath: ['react-library/storybook'],
        projectPath: ['.storybook'],
        onInit: true,
        onUpdate: true,
        onEject: false
    }
});

/**
 * Return only the keys of the object that, as value, have a
 * given key.
 *
 * @param {*} obj One of the objects that define a project.
 * @param {string} onKey The key to filter for.
 *
 * @static
 * @internal
 * @memberof Config.Projects
 */
function retainKeysMatching(obj, onKey) {
    return Object.keys(obj).filter((e) => obj[e][onKey]);
}

/**
 * Add the onInit, onEject and onUpdate attributes to
 * the given object.
 *
 * @param {*} obj One of the objects that define a project.
 *
 * @static
 * @internal
 * @memberof Config.Projects
 */
function addOnInitEjectUpdate(obj) {
    obj.onInit = retainKeysMatching(obj, 'onInit');
    obj.onEject = retainKeysMatching(obj, 'onEject');
    obj.onUpdate = retainKeysMatching(obj, 'onUpdate');
}
addOnInitEjectUpdate(library);
addOnInitEjectUpdate(cliLibrary);
addOnInitEjectUpdate(webLibrary);
addOnInitEjectUpdate(reactLibrary);

module.exports = {
    projectTypes,
    library,
    'cli-library': cliLibrary,
    'web-library': webLibrary,
    'react-library': reactLibrary
};
