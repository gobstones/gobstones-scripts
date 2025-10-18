/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { ConfigLocations } from './locations';

import { getToolingFile } from '../../Helpers/getToolingFile';

/**
 * Models the possible values of project type's file.
 */
export type FileName = keyof ProjectTypeDefinition;

/**
 * Models the possible values of project types.
 */
export type ProjectType = keyof ConfigProjectTypes;

/**
 * Models a project type's file definition and the expected behavior of
 * the file.
 */
export interface FileDefinition {
    /**
     * The internal name for this file descriptor. Will automatically
     * be set to the key name when creating the list of files.
     */
    name: FileName;
    /** The location of one or more files in the gobstones-script's path. */
    gobstonesScriptsLocation: string[];
    /** The location that the files should have in the local project's folder. */
    projectLocation: string[];
    /** Whether this file should be copied on project initialization. */
    copyOnInit: boolean;
    /** Whether this file should be copied on project update. */
    copyOnUpdate: boolean;
    /** Whether this file should be copied on project ejection. */
    copyOnEject: boolean;
    /**
     * Whether this file represents tooling configuration files
     * that can be overwritten with local configurations.
     */
    isOverridable: boolean;
    /**
     * Whether this file contains reference to the generic project
     * name that should be updates.
     */
    requiresReferenceUpdate: boolean;
    /**
     * Whether this file requires the data for testing (verdaccio server
     * data) to be inserted to it.
     */
    requiresTestDataInjection: boolean;
}

/**
 * Models a project type's file definition that has tooling content
 */
export interface FileDefinitionWithTooling extends FileDefinition {
    /**
     * The detected tooling file to use. Only present if
     * the file is overridable. The full path of the file is saved.
     * It's automatically calculated.
     */
    toolingFiles: Record<string, string>;
}

export interface GeneratableFileDefinitionWithTooling extends FileDefinitionWithTooling {
    /**
     * The file used to generate the tooling file.
     */
    generatableFiles: Record<string, string>;
}

/**
 * Models a project type's file definitions.
 */
export interface ProjectTypeDefinition {
    /** The package.json file of the project type. */
    packageJson: FileDefinition;
    /** The LICENSE file of the project type. */
    license: FileDefinition;
    /** The README.md file of the project type. */
    readme: FileDefinition;
    /** The CHANGELOG.md file of the project type. */
    changelog: FileDefinition;
    /** The CONTRIBUTING.md file of the project type. */
    contributing: FileDefinition;
    /** The .gitignore folder of the project type. */
    git: FileDefinition;
    /** The .npmignore and .npmrc files of the project type. */
    npm: FileDefinition;
    /** The src folder of the project type. */
    src: FileDefinition;
    /** The test folder of the project type. */
    test: FileDefinition;
    /** The scripts folder of the project type. */
    scripts: FileDefinition;
    /** The .husky folder of the project type. */
    husky: FileDefinition;
    /** The .vscode folder of the project type. */
    vscode: FileDefinition;
    /** The .github folder of the project type. */
    github: FileDefinition;
    /** The .editorconfig file of the project type. */
    editorconfig: FileDefinition;
    /** The .prettierrc and .prettierignore files of the project type. */
    prettier: FileDefinition;
    /** The .commitlint and .czrc files of the project type. */
    commitlint: FileDefinition;
    /** The .eslint file of the project type. */
    eslint: FileDefinition;
    /** The .tsconfig.json and .tsconfig.test.json files of the project type. */
    typescript: FileDefinitionWithTooling;
    /** The .rollup.config.js file of the project type. */
    rollup: FileDefinitionWithTooling;
    /** The .typedoc.config.js file of the project type. */
    typedoc: FileDefinitionWithTooling;
    /** The .jest.config.js file of the project type. */
    jest: FileDefinitionWithTooling;
    /** The .jestproxies folder of the project type. */
    jestproxies?: FileDefinition;
    /** The demos folder of the project type. */
    demos?: FileDefinition;
    /** The .vite.config.js file of the project type. */
    vite?: FileDefinition;
    /** The stories folder of the project type. */
    stories?: FileDefinition;
    /** The .storybook folder of the project type. */
    storybook?: FileDefinition;
    /** The LICENSE_HEADER file of the project type. */
    licenseHeader: FileDefinitionWithTooling;
}

/**
 * Models the configuration for the different types
 * of project templates that exist. It's one of the main
 * {@link Config} sections.
 */
export interface ConfigProjectTypes {
    /** The **Library** project type. */
    Library: ProjectTypeDefinition;
    /** The **CLILibrary** project type. */
    CLILibrary: ProjectTypeDefinition;
    /** The **ReactLibrary** project type. */
    ReactLibrary: ProjectTypeDefinition;
    /** The **NonCode** project type. */
    NonCode: ProjectTypeDefinition;
}

/**
 * Initialize the different project type definitions with all their
 * file information.
 */
export const projectTypes = (locations: ConfigLocations): ConfigProjectTypes => ({
    Library: _joinProjectTypeDefinitions(
        _getCommonProjectTypeDefinition(
            locations,
            'Library',
            ['src', 'test', 'packageJson', 'typescript', 'rollup'],
            ['jestproxies', 'vite', 'stories', 'storybook', 'demos']
        )
    ),
    CLILibrary: _joinProjectTypeDefinitions(
        _getCommonProjectTypeDefinition(
            locations,
            'CLILibrary',
            ['src', 'test', 'packageJson', 'typescript', 'rollup'],
            ['jestproxies', 'vite', 'stories', 'storybook', 'demos']
        )
    ),
    ReactLibrary: _joinProjectTypeDefinitions(
        _getCommonProjectTypeDefinition(
            locations,
            'ReactLibrary',
            [
                'src',
                'test',
                'packageJson',
                'typescript',
                'rollup',
                'typedoc',
                'jest',
                'jestproxies',
                'vite',
                'stories',
                'storybook'
            ],
            ['demos']
        )
    ),
    NonCode: _joinProjectTypeDefinitions(
        _getCommonProjectTypeDefinition(
            locations,
            'NonCode',
            ['src', 'test', 'packageJson'],
            [
                'eslint',
                'typescript',
                'rollup',
                'typedoc',
                'jest',
                'jestproxies',
                'vite',
                'stories',
                'storybook',
                'demos'
            ]
        )
    )
});

/**
 * Joins multiple partial project type definitions into a single cohesive one.
 * Does not verify that the result contains all keys.
 */
const _joinProjectTypeDefinitions = (...partialInfos: Partial<ProjectTypeDefinition>[]): ProjectTypeDefinition =>
    Object.assign({}, ...partialInfos) as ProjectTypeDefinition;

/**
 * Returns the file information for all files that are common to any
 * project. Expects the route of the project's subfolder.
 *
 * @param projectTypePath - The route of the project's subfolder (e.g. 'CLILibrary' or 'NonCode')
 * @param noCommonFiles - The filenames to search in the project specific folder, instead of the common.
 * @param excludedFiles - Files from the common folder to exclude from this project definition.
 *
 * @returns A partial ProjectTypeDefinition.
 */
const _getCommonProjectTypeDefinition = (
    locations: ConfigLocations,
    projectTypePath: string,
    noCommonFiles: FileName[],
    excludedFiles: FileName[]
): ProjectTypeDefinition => ({
    // only on init
    src: _fileDefinition('src', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/src'],
        projectLocation: ['src'],
        copyOnInit: true
    }),
    test: _fileDefinition('test', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/test'],
        projectLocation: ['test'],
        copyOnInit: true
    }),
    scripts: _fileDefinition('scripts', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/scripts'],
        projectLocation: ['.scripts'],
        copyOnInit: true
    }),
    changelog: _fileDefinition('changelog', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/CHANGELOG.md'],
        projectLocation: ['CHANGELOG.md'],
        copyOnInit: true
    }),
    packageJson: _fileDefinition('packageJson', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/package-definition.json'],
        projectLocation: ['package.json'],
        copyOnInit: true,
        requiresReferenceUpdate: true
    }),
    readme: _fileDefinition('readme', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/README.md'],
        projectLocation: ['README.md'],
        copyOnInit: true,
        requiresReferenceUpdate: true
    }),
    // on init but also on any update
    husky: _fileDefinition('husky', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/husky'],
        projectLocation: ['.husky'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    github: _fileDefinition('github', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/github'],
        projectLocation: ['.github'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    vscode: _fileDefinition('vscode', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/vscode'],
        projectLocation: ['.vscode'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    license: _fileDefinition('license', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/LICENSE'],
        projectLocation: ['LICENSE'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    contributing: _fileDefinition('contributing', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/CONTRIBUTING.md'],
        projectLocation: ['CONTRIBUTING.md'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    editorconfig: _fileDefinition('editorconfig', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/editorconfig'],
        projectLocation: ['.editorconfig'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    prettier: _fileDefinition('prettier', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/prettier.config.mjs'],
        projectLocation: ['prettier.config.mjs'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    npm: _fileDefinition('npm', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/npmignore', '<projectTypePath>/npmrc'],
        projectLocation: ['.npmignore', '.npmrc'],
        copyOnInit: true,
        copyOnUpdate: true,
        requiresTestDataInjection: true
    }),
    eslint: _fileDefinition('eslint', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/eslint.config.mjs'],
        projectLocation: ['eslint.config.mjs'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    git: _fileDefinition('git', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/gitignore'],
        projectLocation: ['.gitignore'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    commitlint: _fileDefinition('commitlint', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/czrc', '<projectTypePath>/commitlint.config.mjs'],
        projectLocation: ['.czrc', 'commitlint.config.mjs'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    // only on eject
    rollup: _fileDefinitionWithTooling(
        'rollup',
        projectTypePath,
        noCommonFiles,
        excludedFiles,
        {
            gobstonesScriptsLocation: ['<projectTypePath>/rollup.config.mjs'],
            projectLocation: ['rollup.config.mjs'],
            copyOnEject: true,
            isOverridable: true
        },
        locations
    ),
    typescript: _fileDefinitionWithTooling(
        'typescript',
        projectTypePath,
        noCommonFiles,
        excludedFiles,
        {
            gobstonesScriptsLocation: ['<projectTypePath>/tsconfig.json', '<projectTypePath>/tsconfig.test.json'],
            projectLocation: ['tsconfig.json', 'tsconfig.test.json'],
            copyOnInit: true,
            copyOnEject: true,
            isOverridable: true
        },
        locations,
        (key) => (key === 'tsconfig.json' ? 'main' : 'test')
    ),
    licenseHeader: _fileDefinitionWithTooling(
        'licenseHeader',
        projectTypePath,
        noCommonFiles,
        excludedFiles,
        {
            // This file descriptor is used to find
            // The LICENSE_HEADER. In principle it should not be
            // overridden at all.
            gobstonesScriptsLocation: ['Common/LICENSE_HEADER'],
            projectLocation: ['LICENSE_HEADER'],
            isOverridable: true
        },
        locations
    ),
    typedoc: _fileDefinitionWithTooling(
        'typedoc',
        projectTypePath,
        noCommonFiles,
        excludedFiles,
        {
            gobstonesScriptsLocation: ['<projectTypePath>/typedoc.config.mjs'],
            projectLocation: ['typedoc.config.mjs'],
            copyOnEject: true,
            isOverridable: true
        },
        locations
    ),
    jest: _fileDefinitionWithTooling(
        'jest',
        projectTypePath,
        noCommonFiles,
        excludedFiles,
        {
            gobstonesScriptsLocation: ['<projectTypePath>/jest.config.mjs'],
            projectLocation: ['jest.config.mjs'],
            copyOnEject: true,
            isOverridable: true
        },
        locations
    ),
    // Project specific
    jestproxies: _fileDefinition('jestproxies', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/jest'],
        projectLocation: ['.jest'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    vite: _fileDefinition('vite', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/vite.config.mjs'],
        projectLocation: ['vite.config.mjs'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    stories: _fileDefinition('stories', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/stories'],
        projectLocation: ['stories'],
        copyOnInit: true
    }),
    storybook: _fileDefinition('storybook', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/storybook'],
        projectLocation: ['.storybook'],
        copyOnInit: true,
        copyOnUpdate: true
    }),
    demos: _fileDefinition('demos', projectTypePath, noCommonFiles, excludedFiles, {
        gobstonesScriptsLocation: ['<projectTypePath>/demos'],
        projectLocation: ['demos'],
        copyOnInit: true,
        isOverridable: false
    })
});

/**
 * Return a file definition with defaults, that will be overwritten by the
 * partial file definition given.
 *
 * @param name - The name of the file definition.
 * @param partialFileInfo - The partial information for this file definition.
 * @returns A full file definition.
 */
const _fileDefinition = (
    name: FileName,
    projectTypePath: string,
    noCommonFiles: FileName[],
    excludedFiles: FileName[],
    partialFileInfo: Partial<FileDefinition>
): FileDefinition => {
    // An empty FileDefinition will be ignored when processed
    const baseElement: FileDefinition = {
        name,
        gobstonesScriptsLocation: [],
        projectLocation: [],
        copyOnInit: false,
        copyOnUpdate: false,
        copyOnEject: false,
        isOverridable: false,
        requiresReferenceUpdate: false,
        requiresTestDataInjection: false
    };
    // If this file is ought to be excluded, just return the empty element
    if (excludedFiles.includes(name)) {
        return baseElement;
    }

    // This is a not excluded file, overwrite default values with the ones provided
    const projectTypeInfo: FileDefinition = Object.assign(baseElement, partialFileInfo);

    // Update the internal paths to the corresponding ones
    projectTypeInfo.gobstonesScriptsLocation = projectTypeInfo.gobstonesScriptsLocation.map((e) =>
        e.replace('<projectTypePath>', noCommonFiles.includes(name) ? projectTypePath : 'Common')
    );

    return projectTypeInfo;
};

/**
 * Return a file definition with defaults, that will be overwritten by the
 * partial file definition given.
 *
 * @param name - The name of the file definition.
 * @param partialFileInfo - The partial information for this file definition.
 * @returns A full file definition.
 */
const _fileDefinitionWithTooling = (
    name: FileName,
    projectTypePath: string,
    noCommonFiles: FileName[],
    excludedFiles: FileName[],
    partialFileInfo: Partial<FileDefinition>,
    locations: ConfigLocations,
    renameDefinitions: (def: string) => string = (_) => 'main'
): FileDefinitionWithTooling => {
    const projectTypeInfo = _fileDefinition(
        name,
        projectTypePath,
        noCommonFiles,
        excludedFiles,
        partialFileInfo
    ) as FileDefinitionWithTooling;
    // If it's overridable, update the tooling file reference
    if (projectTypeInfo.isOverridable) {
        const toolingFile = getToolingFile(
            locations.projectRoot,
            locations.gobstonesScriptsProjectsRoot,
            projectTypeInfo
        );
        if (Object.keys(toolingFile).length >= 1) {
            const defs: Record<string, string> = {};
            for (const key of Object.keys(toolingFile)) {
                const value = toolingFile[key];
                defs[renameDefinitions(key)] = value;
            }
            projectTypeInfo.toolingFiles = defs;
        }
    }
    return projectTypeInfo;
};
