/**
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Add the onInit, onEject and onUpdate attributes to
 * the given object.
 *
 * @param obj One of the objects that define a project.
 *
 * @group Internal API Functions
 */
function addOnInitEjectUpdate(obj: ProjectTypeDefinition): ProjectTypeDefinition {
    const retainKeysMatching = (o: ProjectTypeDefinition, onKey: string): string[] =>
        Object.keys(o).filter((e) => o[e][onKey]);

    obj.onInit = retainKeysMatching(obj, 'onInit');
    obj.onEject = retainKeysMatching(obj, 'onEject');
    obj.onUpdate = retainKeysMatching(obj, 'onUpdate');
    return obj;
}

/**
 * This type represents the configuration of a particular
 * gobstones-script configuraton file.
 *
 * @group Internal API Types
 */
export interface FileConfiguration {
    /**
     * Where the file should be located in the project's local path.
     */
    localPath: string[];
    /**
     * Where the file should be located in the gobstones-script project's path.
     */
    projectPath: string[];
    /**
     * Whether this file should be copied on project initialization.
     */
    onInit: boolean;
    /**
     * Whether this file should be copied on project update.
     */
    onUpdate: boolean;
    /**
     * Whether this file should be copied on project ejection.
     */
    onEject: boolean;
}

/**
 * A project type definition contains all the file definitions
 * for such a project, together with onInit, onUpdate and onEject
 * file lists.
 *
 * @group Internal API Types
 */
export type ProjectTypeDefinition = Record<string, FileConfiguration | string[]>;

/**
 * Get the configuration for any project, given the project path.
 *
 * @param path The project path.
 *
 * @returns The project type definition.
 *
 * @group Internal API Objects
 */
const getClassicConfigForPath = (path: string): ProjectTypeDefinition => ({
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
        localPath: [path + '/package-definition.json'],
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
        localPath: ['common/typedoc.config.js'],
        projectPath: ['typedoc.config.js'],
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
});

/**
 * The library definition.
 *
 * @group Internal API Objects
 */
export const library: ProjectTypeDefinition = addOnInitEjectUpdate(
    getClassicConfigForPath('library')
);

/**
 * The cli-library definition.
 *
 * @group Internal API Objects
 */
export const cliLibrary: ProjectTypeDefinition = addOnInitEjectUpdate(
    getClassicConfigForPath('cli-library')
);

/**
 * The web-library definition.
 *
 * @group Internal API Objects
 */
export const webLibrary: ProjectTypeDefinition = addOnInitEjectUpdate(
    Object.assign(getClassicConfigForPath('web-library'), {
        demos: {
            localPath: ['web-library/demos'],
            projectPath: ['demos'],
            onInit: true,
            onUpdate: false,
            onEject: false
        }
    })
);

/**
 * The react-library definition.
 *
 * @group Internal API Objects
 */
export const reactLibrary: ProjectTypeDefinition = addOnInitEjectUpdate(
    Object.assign(getClassicConfigForPath('react-library'), {
        typedoc: {
            localPath: ['react-library/typedoc.config.js'],
            projectPath: ['typedoc.config.js'],
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
    })
);

/**
 * The name of all available project manager supported by the application.
 *
 * @returns An object containing the project types availables as keys, and
 * their definitions as values.
 *
 * @group Internal API Objects
 */
export const projectTypes: Record<string, ProjectTypeDefinition> = {
    library,
    'cli-library': cliLibrary,
    'react-library': reactLibrary
    // , 'web-library': webLibrary
};
