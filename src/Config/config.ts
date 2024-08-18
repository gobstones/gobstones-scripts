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

import path from 'path';

import { testServer, version } from './about';

import { getBin } from '../Helpers/getBin';
import { getGobstonesScriptsRootPath } from '../Helpers/getGobstonesScriptsRootPath';
import { getInUsePackageManager } from '../Helpers/getInUsePackageManager';
import { getProjectRootPath } from '../Helpers/getProjectRootPath';
import { getToolingFile } from '../Helpers/getToolingFile';
import { isMacos } from '../Helpers/isMacos';
import { isWindows } from '../Helpers/isWindows';
import { LogLevel, logger } from '../Helpers/Logger';
import { PackageJsonReader } from '../Helpers/PackageJsonReader';

// ==========================================
// #region Identifiers Types
// ==========================================
/**
 * Models the possible values of operating systems.
 */
export type OSType = 'macos' | 'posix' | 'windows';

/**
 * Models the different type of executable scripts.
 */
export type ScriptType = 'node' | 'sh' | 'pwsh' | 'cmd';

/**
 * Models the possible values of package managers.
 */
export type PackageManager = keyof ConfigPackageManagers;

/**
 * Models the possible values of project types.
 */
export type ProjectType = keyof ConfigProjectTypes;

/**
 * Models the possible values of project type's file.
 */
export type FileName = keyof ProjectTypeDefinition;

// ==========================================
// #endregion Identifiers Types
// ==========================================

// ==========================================
// #region Data Definition Types
// ==========================================
/**
 * Models a package manager definition and basic commands and folder it has.
 */
export interface PackageManagerDefinition {
    /** The name of this package manager */
    name: string;
    /** The regular command name. */
    cmd: string;
    /** The command used to install dependencies. */
    install: string;
    /** The command used to execute a binary related to the package manager. */
    run: string;
    /** A set of module folders that the package manager uses. */
    modulesFolders: string[];
    /** A set of binary folders that the package manager uses. */
    binFolders: string[];
}

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
    toolingFile: string;
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
    /** The package-scripts.js file of the project type. */
    nps: FileDefinitionWithTooling;
    /** The .tsconfig.js file of the project type. */
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
    /** The .tconfig.json file of the project type. */
    tsConfigJSON: FileDefinitionWithTooling;
    /** The LICENSE_HEADER file of the project type. */
    licenseHeader: FileDefinitionWithTooling;
    /** The license.config.js file of the project type. */
    licenseHeaderConfig: FileDefinitionWithTooling;
}

/**
 * Models a project type's file definition names, after
 * being filtered by category.
 */
export interface FilteredFilesDefinition {
    /** The list of file names to be copied on init. */
    copiedOnInit: FileName[];
    /** The list of file names to be copied on update. */
    copiedOnUpdate: FileName[];
    /** The list of file names to be copied on eject. */
    copiedOnEject: FileName[];
    /** The list of file names that are part of the tooling
     * and require to identify the configuration file location. */
    toolingFiles: FileName[];
}

// ==========================================
// #endregion Data Definition Types
// ==========================================

// ==========================================
// #region Configuration Part Types
// ==========================================
/**
 * Models the configuration for all the available
 * package managers. It's one of the main {@link Config}
 * sections.
 */
export interface ConfigPackageManagers {
    /** The configuration for **npm**. */
    npm: PackageManagerDefinition;
    /** The configuration for **yarn**. */
    yarn: PackageManagerDefinition;
    /** The configuration for **pnpm**. */
    pnpm: PackageManagerDefinition;
}

/**
 * Models the configuration for the system's
 * environment, as detected by node. Is one of the
 * main {@link Config} sections.
 */
export interface ConfigEnvironment {
    /** The running tool version. */
    toolVersion: string;
    /** The running tool test server. */
    toolTestServer: string;
    /** The current working directory, as detected through environment. */
    workingDirectory: string;
    /** The current operating system, as detected through environment. */
    operatingSystem: OSType;
    /** The current package manager, as detected through environment. */
    detectedPackageManager: PackageManager;
}

/**
 * Models the configuration for all the different
 * locations this tool manages. It's one of the main
 * {@link Config} sections.
 */
export interface ConfigLocations {
    /** The root of the currently running project. */
    projectRoot: string;
    /** The root of the gobstones-scripts Library. */
    gobstonesScriptsRoot: string;
    /** The root of the gobstones-scripts Library project files. */
    gobstonesScriptsProjectsRoot: string;
}

/**
 * Models the configuration for the current execution
 * environment. That is, the loaded state of execution
 * for this particular run. Is one of the main
 * {@link Config} sections.
 */
export interface ConfigExecutionEnvironment {
    /** The currently in use project type. */
    projectType: ProjectType;
    /** The currently in use package manager. */
    packageManager: keyof ConfigPackageManagers;
    /** Whether the tool should use full paths when displaying any. */
    useFullPaths: boolean;
    /** Whether the tool is running in debug mode. */
    debug: boolean;
    /** Whether the tool is running in test mode. */
    test: boolean;
    /** Whether the tool should expect a local tsconfig.json file instead of building from a .js one. */
    useLocalTsconfigJson: boolean;
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
 * Models the configuration of filtered file definitions
 * for the different types of project templates that exist.
 * It's one of the main {@link Config} sections.
 */
export interface ConfigFilteredProjectTypes {
    /** The **Library** filtered project type files. */
    Library: FilteredFilesDefinition;
    /** The **cli-Library** filtered project type files. */
    CLILibrary: FilteredFilesDefinition;
    /** The **react-Library** filtered project type files. */
    ReactLibrary: FilteredFilesDefinition;
    /** The **NonCode** project type. */
    NonCode: FilteredFilesDefinition;
}

// ==========================================
// #endregion Configuration Part Types
// ==========================================

// ==========================================
// #region Script File Types
// ==========================================
/**
 * Models an executable file path and characteristics.
 */
export interface ExecutableScriptDefinition {
    /** The node package name this executable belongs to. */
    packageName: string;
    /** The binary name of this executable. */
    binName: string;
    /** The script file that should be executed. */
    scriptFile: string;
    /** The command to execute in the terminal */
    command: string;
    /**
     * The mode on which such binary file should run.
     * It may be a full JS file to be executed by node,
     * a Shell script supported by any POSIX file,
     * of a Windows "PowerShell" script or "cmd" script.
     */
    mode: ScriptType;
}
// ==========================================
// #endregion Script File Types
// ==========================================

// ==========================================
// #region Config
// ==========================================
/**
 * This class represents the main configuration object generated by the application.
 * The configuration is automatically loaded once the {@link init} method is called.
 * This object is also the main entry point to obtain configuration options of the tool
 * as to obtain the located directories, tooling files and obtain location for the
 * executable scripts for different tools.
 */
export class Config {
    // ------------------------------------------
    // #region Private Properties
    // ------------------------------------------
    /** Whether the configuration has been initialized. */
    private _lastInitializationValues?: {
        apiGivenProjectType?: string;
        apiGivenPackageManager?: string;
        debug: boolean;
        test: boolean;
        useLocalTsconfigJson: boolean;
    };

    /** The subpart of the configuration corresponding to package managers. */
    private _packageManagers: ConfigPackageManagers;
    /** The subpart of the configuration corresponding to the environment. */
    private _environment: ConfigEnvironment;
    /** The subpart of the configuration corresponding to the different path locations. */
    private _locations: ConfigLocations;
    /** The subpart of the configuration corresponding to the current execution environment. */
    private _executionEnvironment: ConfigExecutionEnvironment;
    /** The subpart of the configuration corresponding to the different project types. */
    private _projectTypes: ConfigProjectTypes;
    /** The subpart of the configuration corresponding to the different project type filtered files. */
    private _filteredProjectTypes: ConfigFilteredProjectTypes;
    /** A cache for the executable scripts already detected. */
    private _binaryFilesCache: Record<string, ExecutableScriptDefinition | undefined>;
    // ------------------------------------------
    // #endregion Private Properties
    // ------------------------------------------

    /**
     * Create a new instance of the configuration.
     */
    public constructor() {
        /*
         * We need to set the logger on if debug was sent from the CLI,
         * as this i the first thing that happens, even after running any code.
         * This is clearly a violation of the concern of 'config', but
         * there doesn't seem to be a better way without recurring to
         * dynamic imports, which implies changing the build system.
         */
        if (process.argv.includes('-D') || process.argv.includes('--debug')) {
            logger.level = LogLevel.Debug;
            logger.on();
        }
        logger.debug('[config] Creating configuration object');
        // has not yet been initialized
        this._lastInitializationValues = undefined;
        this._binaryFilesCache = {};
    }

    // ------------------------------------------
    // #region Accessing
    // ------------------------------------------
    /** Returns the subpart of the configuration corresponding to package managers. */
    public get packageManagers(): ConfigPackageManagers {
        return this._packageManagers;
    }

    /** Returns subpart of the configuration corresponding to the environment. */
    public get environment(): ConfigEnvironment {
        return this._environment;
    }

    /** Returns the subpart of the configuration corresponding to the different path locations. */
    public get locations(): ConfigLocations {
        return this._locations;
    }

    /** Returns the subpart of the configuration corresponding to the current execution environment. */
    public get executionEnvironment(): ConfigExecutionEnvironment {
        return this._executionEnvironment;
    }

    /** Returns the subpart of the configuration corresponding to the different project types. */
    public get projectTypes(): ConfigProjectTypes {
        return this._projectTypes;
    }

    /** The subpart of the configuration corresponding to the different project type filtered files. */
    public get filteredProjectTypes(): ConfigFilteredProjectTypes {
        return this._filteredProjectTypes;
    }

    public get packageManager(): PackageManagerDefinition {
        return this._packageManagers[this._executionEnvironment.packageManager];
    }

    public get projectType(): ProjectTypeDefinition {
        return this._projectTypes[this._executionEnvironment.projectType];
    }

    public get projectTypeFilteredFiles(): FilteredFilesDefinition {
        return this._filteredProjectTypes[this._executionEnvironment.projectType];
    }
    // ------------------------------------------
    // #endregion Accessing
    // ------------------------------------------

    // ------------------------------------------
    // #region Initialization
    // ------------------------------------------
    /**
     * Orchestrate the initialization of the Config object.
     * This initialization is needed in order to access any of the
     * sub-configuration sections, except for retrieving
     * executable scripts.
     */
    public init(
        apiGivenProjectType?: string,
        apiGivenPackageManager?: string,
        debug?: boolean,
        test?: boolean,
        useLocalTsconfigJson?: boolean
    ): this {
        if (!this._lastInitializationValues) {
            logger.debug(`[config] Initializing configuration from scratch`);

            this._initAvailablePackageManagers();
            this._detectEnvironment();
            this._initializeLocations();
            this._loadProjectTypeDefinitions();
            this._loadProcessedProjectTypeDefinitions();
        }

        if (
            !this._lastInitializationValues ||
            (apiGivenProjectType && this._lastInitializationValues.apiGivenProjectType !== apiGivenProjectType) ||
            (apiGivenPackageManager &&
                this._lastInitializationValues.apiGivenPackageManager !== apiGivenPackageManager) ||
            (debug && this._lastInitializationValues.debug !== debug) ||
            (test && this._lastInitializationValues.test !== test)
        ) {
            logger.debug(`[config] Already initialized, updating CLI/API parameters`);
            this._initializeExecutionEnvironment(
                apiGivenProjectType,
                apiGivenPackageManager,
                debug,
                test,
                useLocalTsconfigJson
            );
            this._lastInitializationValues = this._executionEnvironment;
        }
        return this;
    }
    // ------------------------------------------
    // #endregion Initialization
    // ------------------------------------------

    // ------------------------------------------
    // #region Public API
    // ------------------------------------------
    /**
     * Change the current directory of the process to another one.
     * Additionally, update the global configuration to match.
     *
     * @param dir - The directory to change to
     */
    public changeDir(dir: string): string {
        process.chdir(dir);
        this._environment.workingDirectory = dir;
        this._locations.projectRoot = dir;
        return dir;
    }

    /**
     * Return the information for executing a binary file, if it can be found
     * by the configuration system. Additionally, and differently from the
     * simple {@link getBin} helper, this method provides caching, as to not
     * attempt to find the element twice.
     *
     * @param packageName - The package name that contains the binary file.
     * @param binName - The binary file to execute.
     *
     * @returns The executable to run, or undefined if not found.
     */
    public getBinary(packageName: string, binName: string): ExecutableScriptDefinition | undefined {
        if (!this._binaryFilesCache[`${packageName}-${binName}`]) {
            this._binaryFilesCache[`${packageName}-${binName}`] = getBin(
                this._locations.projectRoot,
                this.packageManager,
                packageName,
                binName
            );
        }
        return this._binaryFilesCache[`${packageName}-${binName}`];
    }
    // ------------------------------------------
    // #endregion Public API
    // ------------------------------------------

    /* ******************************************************** */

    // ------------------------------------------
    // #region Private Initialization
    // ------------------------------------------

    /** Initialize the different available package managers. */
    private _initAvailablePackageManagers(): void {
        this._packageManagers = {
            npm: {
                name: 'npm',
                cmd: 'npm',
                install: 'npm install',
                run: 'npx',
                modulesFolders: ['node_modules'],
                binFolders: ['node_modules/bin']
            },
            yarn: {
                name: 'yarn',
                cmd: 'yarn',
                install: 'yarn install',
                run: 'npx',
                modulesFolders: ['node_modules'],
                binFolders: ['node_modules/bin']
            },
            pnpm: {
                name: 'pnpm',
                cmd: 'pnpm',
                install: 'pnpm install',
                run: 'pnpm exec',
                modulesFolders: ['node_modules', 'node_modules/@gobstones/gobstones-scripts/node_modules'],
                binFolders: ['node_modules/bin', 'node_modules/@gobstones/gobstones-scripts/node_modules/bin']
            }
        };
    }

    /** Initialize the current environment from detected information. */
    private _detectEnvironment(): void {
        this._environment = {
            toolVersion: version,
            toolTestServer: testServer,
            operatingSystem: isWindows() ? 'windows' : isMacos() ? 'macos' : 'posix',
            workingDirectory: process.env.PWD ?? process.cwd() ?? path.resolve('.'),
            detectedPackageManager: getInUsePackageManager(this._packageManagers, 'npm')
        };
    }

    /**
     * Initialize the different locations by attempting to detect the current
     * folder containing a project and the folder containing the gobstones-scripts Library.
     */
    private _initializeLocations(): void {
        const projectRoot = getProjectRootPath(this._environment.operatingSystem);
        const gobstonesScriptsRoot = getGobstonesScriptsRootPath(this._environment.operatingSystem, projectRoot);
        this._locations = {
            projectRoot,
            gobstonesScriptsRoot,
            gobstonesScriptsProjectsRoot: path.join(gobstonesScriptsRoot, 'project-types')
        };
    }

    /**
     * Initialize the current execution environment. This is obtained by a
     * mix between possible CLI/API given parameters (such as using -t or -m),
     * given as input, and the information read in the current's project package.json,
     * as well as defaults in case no configuration is provided.
     *
     * Priority is given to CLI/API given, then the package.json configuration
     * and lastly defaults.
     *
     * @param apiGivenProjectType - The CLI/API given value for project type to use, if any.
     * @param apiGivenPackageManager - The CLI/API given value for package manager to use, if any.
     * @param debug - The CLI/API given value to know if we are running in debug mode.
     * @param test - The CLI/API given value to know if we are running in test mode.
     * @param useLocalTsconfigJson - The CLI/API given value to know if we should use the default tsconfig.json file.
     */
    private _initializeExecutionEnvironment(
        apiGivenProjectType?: string,
        apiGivenPackageManager?: string,
        debug?: boolean,
        test?: boolean,
        useLocalTsconfigJson?: boolean
    ): void {
        if (apiGivenProjectType && !Object.keys(this._projectTypes).includes(apiGivenProjectType)) {
            throw new Error('Invalid project type');
        }
        if (apiGivenPackageManager && !Object.keys(this._packageManagers).includes(apiGivenPackageManager)) {
            throw new Error('Invalid package manager');
        }
        const pkgReader = new PackageJsonReader(path.join(this._locations.projectRoot, 'package.json'));
        this._executionEnvironment = {
            projectType: (apiGivenProjectType ??
                pkgReader.getValueAt('config.gobstones-scripts.type') ??
                'Library') as keyof ConfigProjectTypes,
            packageManager: (apiGivenPackageManager ??
                pkgReader.getValueAt('config.gobstones-scripts.manager') ??
                'npm') as keyof ConfigPackageManagers,
            useFullPaths: (pkgReader.getValueAt('config.gobstones-scripts.use-full-paths') ?? false) as boolean,
            useLocalTsconfigJson: (useLocalTsconfigJson ??
                pkgReader.getValueAt('config.gobstones-scripts.use-local-tsconfig-json') ??
                false) as boolean,
            debug: (debug ?? pkgReader.getValueAt('config.gobstones-scripts.debug') ?? false) as boolean,
            test: (test ?? pkgReader.getValueAt('config.gobstones-scripts.test') ?? false) as boolean
        };
    }

    /**
     * Initialize the different project type definitions with all their
     * file information.
     */
    private _loadProjectTypeDefinitions(): void {
        this._projectTypes = {
            Library: this._joinProjectTypeDefinitions(
                this._getCommonProjectTypeDefinition(
                    'Library',
                    ['src', 'test', 'packageJson', 'rollup', 'nps'],
                    ['jestproxies', 'vite', 'stories', 'storybook', 'demos']
                )
            ),
            CLILibrary: this._joinProjectTypeDefinitions(
                this._getCommonProjectTypeDefinition(
                    'CLILibrary',
                    ['src', 'test', 'packageJson', 'rollup', 'nps'],
                    ['jestproxies', 'vite', 'stories', 'storybook', 'demos']
                )
            ),
            ReactLibrary: this._joinProjectTypeDefinitions(
                this._getCommonProjectTypeDefinition(
                    'ReactLibrary',
                    [
                        'src',
                        'test',
                        'packageJson',
                        'rollup',
                        'nps',
                        'typedoc',
                        'jestproxies',
                        'vite',
                        'stories',
                        'storybook'
                    ],
                    ['demos']
                )
            ),
            NonCode: this._joinProjectTypeDefinitions(
                this._getCommonProjectTypeDefinition(
                    'NonCode',
                    [],
                    [
                        'eslint',
                        'tsConfigJSON',
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
                ),
                {
                    // On node code, nps should always be copied to the project's root
                    nps: this._fileDefinitionWithTooling('nps', 'NonCode', [], [], {
                        gobstonesScriptsLocation: ['<projectTypePath>/package-scripts.js'],
                        projectLocation: ['package-scripts.js'],
                        copyOnInit: true,
                        isOverridable: true
                    })
                }
            )
        };
    }

    /**
     * Returns the file information for all files that are common to any
     * project. Expects the route of the project's subfolder.
     *
     * @param projectTypePath - The route of the project's subfolder (e.g. 'cli-Library')
     *
     * @returns A partial ProjectTypeDefinition.
     */
    private _getCommonProjectTypeDefinition(
        projectTypePath: string,
        noCommonFiles: FileName[],
        excludedFiles: FileName[]
    ): ProjectTypeDefinition {
        return {
            // only on init
            src: this._fileDefinition('src', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/src'],
                projectLocation: ['src'],
                copyOnInit: true
            }),
            test: this._fileDefinition('test', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/test'],
                projectLocation: ['test'],
                copyOnInit: true
            }),
            changelog: this._fileDefinition('changelog', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/CHANGELOG.md'],
                projectLocation: ['CHANGELOG.md'],
                copyOnInit: true
            }),
            packageJson: this._fileDefinition('packageJson', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/package-definition.json'],
                projectLocation: ['package.json'],
                copyOnInit: true,
                requiresReferenceUpdate: true
            }),
            readme: this._fileDefinition('readme', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/README.md'],
                projectLocation: ['README.md'],
                copyOnInit: true,
                requiresReferenceUpdate: true
            }),
            // on init but also on any update
            husky: this._fileDefinition('husky', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/husky'],
                projectLocation: ['.husky'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            github: this._fileDefinition('github', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/github'],
                projectLocation: ['.github'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            vscode: this._fileDefinition('vscode', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/vscode'],
                projectLocation: ['.vscode'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            license: this._fileDefinition('license', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/LICENSE'],
                projectLocation: ['LICENSE'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            contributing: this._fileDefinition('contributing', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/CONTRIBUTING.md'],
                projectLocation: ['CONTRIBUTING.md'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            editorconfig: this._fileDefinition('editorconfig', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/editorconfig'],
                projectLocation: ['.editorconfig'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            prettier: this._fileDefinition('prettier', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/prettierrc'],
                projectLocation: ['.prettierrc'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            npm: this._fileDefinition('npm', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/npmignore', '<projectTypePath>/npmrc'],
                projectLocation: ['.npmignore', '.npmrc'],
                copyOnInit: true,
                copyOnUpdate: true,
                requiresTestDataInjection: true
            }),
            eslint: this._fileDefinition('eslint', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/eslint.config.mjs'],
                projectLocation: ['eslint.config.mjs'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            git: this._fileDefinition('git', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/gitignore'],
                projectLocation: ['.gitignore'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            commitlint: this._fileDefinition('commitlint', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/czrc', '<projectTypePath>/commitlint.config.mjs'],
                projectLocation: ['.czrc', 'commitlint.config.mjs'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            // only on eject
            nps: this._fileDefinitionWithTooling('nps', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/package-scripts.js'],
                projectLocation: ['package-scripts.js'],
                copyOnEject: true,
                isOverridable: true
            }),
            rollup: this._fileDefinitionWithTooling('rollup', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/rollup.config.mjs'],
                projectLocation: ['rollup.config.mjs'],
                copyOnEject: true,
                isOverridable: true
            }),
            typescript: this._fileDefinitionWithTooling('typescript', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/tsconfig.cjs'],
                projectLocation: ['tsconfig.cjs'],
                copyOnEject: true,
                isOverridable: true
            }),
            tsConfigJSON: this._fileDefinitionWithTooling(
                'tsConfigJSON',
                projectTypePath,
                noCommonFiles,
                excludedFiles,
                {
                    // This file descriptor is used to find
                    // The tsconfig.json generated after running
                    // tsconfig.js, that's why it's not a real
                    // file in any project type, but it can be.
                    gobstonesScriptsLocation: ['<projectTypePath>/tsconfig.json'],
                    projectLocation: ['tsconfig.json'],
                    isOverridable: true
                }
            ),
            licenseHeader: this._fileDefinitionWithTooling(
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
                }
            ),
            licenseHeaderConfig: this._fileDefinitionWithTooling(
                'licenseHeaderConfig',
                projectTypePath,
                noCommonFiles,
                excludedFiles,
                {
                    // This file descriptor is used to find
                    // The license.config.js. In principle it should not be
                    // overridden at all.
                    gobstonesScriptsLocation: ['Common/license.config.cjs'],
                    projectLocation: ['license.config.cjs'],
                    isOverridable: true
                }
            ),
            typedoc: this._fileDefinitionWithTooling('typedoc', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/typedoc.config.mjs'],
                projectLocation: ['typedoc.config.mjs'],
                copyOnEject: true,
                isOverridable: true
            }),
            jest: this._fileDefinitionWithTooling('jest', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/jest.config.mjs'],
                projectLocation: ['jest.config.mjs'],
                copyOnEject: true,
                isOverridable: true
            }),
            // Project specific
            jestproxies: this._fileDefinition('jestproxies', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/jest'],
                projectLocation: ['.jest'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            vite: this._fileDefinition('vite', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/vite.config.mjs'],
                projectLocation: ['vite.config.mjs'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            stories: this._fileDefinition('stories', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/stories'],
                projectLocation: ['stories'],
                copyOnInit: true
            }),
            storybook: this._fileDefinition('storybook', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/storybook'],
                projectLocation: ['.storybook'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            demos: this._fileDefinition('demos', projectTypePath, noCommonFiles, excludedFiles, {
                gobstonesScriptsLocation: ['<projectTypePath>/demos'],
                projectLocation: ['demos'],
                copyOnInit: true,
                isOverridable: false
            })
        };
    }

    /**
     * Initialize the different project type definitions with all their
     * file information filtered accordingly to their type.
     */
    private _loadProcessedProjectTypeDefinitions(): void {
        const retainKeysMatching = (o: ProjectTypeDefinition, onKey: string): FileName[] =>
            (Object.keys(o) as (keyof ProjectTypeDefinition)[]).filter((e) => o[e]?.[onKey]);

        const getProcessed = (projectType: ProjectType): FilteredFilesDefinition => ({
            copiedOnInit: retainKeysMatching(this._projectTypes[projectType], 'copyOnInit'),
            copiedOnEject: retainKeysMatching(this._projectTypes[projectType], 'copyOnEject'),
            copiedOnUpdate: retainKeysMatching(this._projectTypes[projectType], 'copyOnUpdate'),
            toolingFiles: retainKeysMatching(this._projectTypes[projectType], 'isOverridable')
        });

        const filteredProjectTypes: Partial<ConfigFilteredProjectTypes> = {};

        for (const projectType of Object.keys(this._projectTypes) as ProjectType[]) {
            filteredProjectTypes[projectType] = getProcessed(projectType);
        }
        this._filteredProjectTypes = filteredProjectTypes as ConfigFilteredProjectTypes;
    }
    // ------------------------------------------
    // #endregion Private Initialization
    // ------------------------------------------

    // ------------------------------------------
    // #region Private Initialization Helpers
    // ------------------------------------------

    /**
     * Joins multiple partial project type definitions into a single cohesive one.
     * Does not verify that the result contains all keys.
     */
    private _joinProjectTypeDefinitions(...partialInfos: Partial<ProjectTypeDefinition>[]): ProjectTypeDefinition {
        return Object.assign({}, ...partialInfos) as ProjectTypeDefinition;
    }

    /**
     * Return a file definition with defaults, that will be overwritten by the
     * partial file definition given.
     *
     * @param name - The name of the file definition.
     * @param partialFileInfo - The partial information for this file definition.
     * @returns A full file definition.
     */
    private _fileDefinition(
        name: FileName,
        projectTypePath: string,
        noCommonFiles: FileName[],
        excludedFiles: FileName[],
        partialFileInfo: Partial<FileDefinition>
    ): FileDefinition {
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
    }

    /**
     * Return a file definition with defaults, that will be overwritten by the
     * partial file definition given.
     *
     * @param name - The name of the file definition.
     * @param partialFileInfo - The partial information for this file definition.
     * @returns A full file definition.
     */
    private _fileDefinitionWithTooling(
        name: FileName,
        projectTypePath: string,
        noCommonFiles: FileName[],
        excludedFiles: FileName[],
        partialFileInfo: Partial<FileDefinition>
    ): FileDefinitionWithTooling {
        const projectTypeInfo = this._fileDefinition(
            name,
            projectTypePath,
            noCommonFiles,
            excludedFiles,
            partialFileInfo
        ) as FileDefinitionWithTooling;
        // If it's overridable, update the tooling file reference
        if (projectTypeInfo.isOverridable) {
            const toolingFile = getToolingFile(
                this.locations.projectRoot,
                this.locations.gobstonesScriptsProjectsRoot,
                projectTypeInfo
            );
            if (toolingFile) {
                projectTypeInfo.toolingFile = toolingFile;
            }
        }
        return projectTypeInfo;
    }
    // ------------------------------------------
    // #endregion Private Initialization Helpers
    // ------------------------------------------
}
// ==========================================
// #endregion Config
// ==========================================

// ==========================================
// #region Config Instance
// ==========================================
/**
 * The config object exports all configuration functions in
 * a convenient element.
 *
 * @internal
 */
export const config: Config = new Config();
// ==========================================
// #endregion Config Instance
// ==========================================
