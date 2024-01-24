/**
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import path from 'path';

import { version } from './about';

import { getBin } from '../helpers/getBin';
import { getGobstonesScriptsRootPath } from '../helpers/getGobstonesScriptsRootPath';
import { getInUsePackageManager } from '../helpers/getInUsePackageManager';
import { getProjectRootPath } from '../helpers/getProjectRootPath';
import { getToolingFile } from '../helpers/getToolingFile';
import { isMacos } from '../helpers/isMacos';
import { isWindows } from '../helpers/isWindows';
import { LogLevel, logger } from '../helpers/Logger';
import { PackageJsonReader } from '../helpers/PackageJsonReader';

// ==========================================
// #region Identifiers Types
// ==========================================
/**
 * Models the possible values of operating systems.
 * @group API: Types
 */
export type OSType = 'macos' | 'posix' | 'windows';

/**
 * Models the different type of executable scripts.
 * @group API: Types
 */
export type ScriptType = 'node' | 'sh' | 'pwsh' | 'cmd';

/**
 * Models the possible values of package managers.
 * @group API: Types
 */
export type PackageManager = keyof ConfigPackageManagers;

/**
 * Models the possible values of project types.
 * @group API: Types
 */
export type ProjectType = keyof ConfigProjectTypes;

/**
 * Models the possible values of project type's file.
 * @group API: Types
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
 * @group API: Types
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
 * @group API: Types
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
    isOverwritable: boolean;
    /**
     * Whether this file contains reference to the generic project
     * name that should be updates.
     */
    requiresReferenceUpdate: boolean;
    /**
     * The detected tooling file to use. Only present if
     * the file is overwritable. The full path of the file is saved.
     * It's automatically calculated.
     */
    toolingFile?: string;
}

/**
 * Models a project type's file definitions.
 * @group API: Types
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
    nps: FileDefinition;
    /** The .tsconfig.js file of the project type. */
    typescript: FileDefinition;
    /** The .rollup.config.js file of the project type. */
    rollup: FileDefinition;
    /** The .typedoc.config.js file of the project type. */
    typedoc: FileDefinition;
    /** The .jest.config.js file of the project type. */
    jest: FileDefinition;
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
    tsConfigJSON: FileDefinition;
}

/**
 * Models a project type's file definition names, after
 * being filtered by category.
 * @group API: Types
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
 * @group API: Types
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
 * @group API: Types
 */
export interface ConfigEnvironment {
    /** The running tool version. */
    toolVersion: string;
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
 * @group API: Types
 */
export interface ConfigLocations {
    /** The root of the currently running project. */
    projectRoot: string;
    /** The root of the gobstones-scripts library. */
    gobstonesScriptsRoot: string;
    /** The root of the gobstones-scripts library project files. */
    gobstonesScriptsProjectsRoot: string;
}

/**
 * Models the configuration for the current execution
 * environment. That is, the loaded state of execution
 * for this particular run. Is one of the main
 * {@link Config} sections.
 * @group API: Types
 */
export interface ConfigExecutionEnvironment {
    /** The currently in use project type. */
    projectType: ProjectType;
    /** The currently in use package manager. */
    packageManager: keyof ConfigPackageManagers;
    /** Whether the tool should use full paths when displaying any. */
    useFullPaths: boolean;
    /** Whether the tool is running in debug mode. */
    isDebugMode: boolean;
    /** Whether the tool is running in test mode. */
    isTestMode: boolean;
}

/**
 * Models the configuration for the different types
 * of project templates that exist. It's one of the main
 * {@link Config} sections.
 * @group API: Types
 */
export interface ConfigProjectTypes {
    /** The **library** project type. */
    library: ProjectTypeDefinition;
    /** The **cli-library** project type. */
    cliLibrary: ProjectTypeDefinition;
    /** The **react-library** project type. */
    reactLibrary: ProjectTypeDefinition;
    /** The **web-library** project type. */
    webLibrary: ProjectTypeDefinition;
}

/**
 * Models the configuration of filtered file definitions
 * for the different types of project templates that exist.
 * It's one of the main {@link Config} sections.
 * @group API: Types
 */
export interface ConfigFilteredProjectTypes {
    /** The **library** filtered project type files. */
    library: FilteredFilesDefinition;
    /** The **cli-library** filtered project type files. */
    cliLibrary: FilteredFilesDefinition;
    /** The **react-library** filtered project type files. */
    reactLibrary: FilteredFilesDefinition;
    /** The **web-library** filtered project type files. */
    webLibrary: FilteredFilesDefinition;
}

// ==========================================
// #endregion Configuration Part Types
// ==========================================

// ==========================================
// #region Script File Types
// ==========================================
/**
 * Models an executable file path and characteristics.
 * @group API: Types
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
 *
 * @group API: Main
 */
export class Config {
    // ------------------------------------------
    // #region Private Properties
    // ------------------------------------------
    /** Whether the configuration has been initialized. */
    private _lastInitializationValues?: {
        apiGivenProjectType?: string;
        apiGivenPackageManager?: string;
        isDebugMode: boolean;
        isTestMode: boolean;
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
    private _binaryFilesCache: Record<string, ExecutableScriptDefinition>;
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
        isDebugMode: boolean = false,
        isTestMode: boolean = false
    ): Config {
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
            this._lastInitializationValues.apiGivenProjectType !== apiGivenProjectType ||
            this._lastInitializationValues.apiGivenPackageManager !== apiGivenPackageManager ||
            this._lastInitializationValues.isDebugMode !== isDebugMode ||
            this._lastInitializationValues.isTestMode !== isTestMode
        ) {
            logger.debug(`[config] Already initialized, updating CLI/API parameters`);
            this._initializeExecutionEnvironment(apiGivenProjectType, apiGivenPackageManager, isDebugMode, isTestMode);
            this._lastInitializationValues = {
                apiGivenProjectType,
                apiGivenPackageManager,
                isDebugMode,
                isTestMode
            };
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
     * @param dir The directory to change to
     *
     * @group Internal API Function
     */
    public changeDir(dir: string): string {
        process.chdir(dir);
        config._environment.workingDirectory = dir;
        config._locations.projectRoot = dir;
        return dir;
    }

    /**
     * Return the information for executing a binary file, if it can be found
     * by the configuration system. Additionally, and differently from the
     * simple {@link getBin} helper, this method provides caching, as to not
     * attempt to find the element twice.
     *
     * @param packageName The package name that contains the binary file.
     * @param binName The binary file to execute.
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
            operatingSystem: isWindows() ? 'windows' : isMacos() ? 'macos' : 'posix',
            workingDirectory: process.env['PWD'] ?? process.cwd() ?? path.resolve('.'),
            detectedPackageManager: getInUsePackageManager(this._packageManagers, 'npm')
        };
    }

    /**
     * Initialize the different locations by attempting to detect the current
     * folder containing a project and the folder containing the gobstones-scripts library.
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
     * @param apiGivenProjectType The CLI/API given value for project type to use, if any.
     * @param apiGivenPackageManager The CLI/API given value for package manager to use, if any.
     * @param isDebugMode The CLI/API given value to know if we are running in debug mode.
     * @param isTestMode The CLI/API given value to know if we are running in test mode.
     */
    private _initializeExecutionEnvironment(
        apiGivenProjectType?: string,
        apiGivenPackageManager?: string,
        isDebugMode: boolean = false,
        isTestMode: boolean = false
    ): void {
        if (apiGivenProjectType && !Object.keys(this._projectTypes).includes(apiGivenProjectType)) {
            throw new Error('Invalid project type');
        }
        if (apiGivenPackageManager && !Object.keys(this._packageManagers).includes(apiGivenPackageManager)) {
            throw new Error('Invalid package manager');
        }
        const pkgReader = new PackageJsonReader(path.join(this._locations.projectRoot, 'package.json'));
        this._executionEnvironment = {
            projectType: apiGivenProjectType ?? pkgReader.getValueAt('config.gobstones-scripts.type') ?? 'library',
            packageManager: apiGivenPackageManager ?? pkgReader.getValueAt('config.gobstones-scripts.manager') ?? 'npm',
            useFullPaths: pkgReader.getValueAt('config.gobstones-scripts.use-full-paths') ?? false,
            isDebugMode,
            isTestMode
        };
    }

    /**
     * Initialize the different project type definitions with all their
     * file information.
     */
    private _loadProjectTypeDefinitions(): void {
        this._projectTypes = {
            library: this._joinProjectTypeDefinitions(this._getCommonProjectTypeDefinition('library')),
            cliLibrary: this._joinProjectTypeDefinitions(this._getCommonProjectTypeDefinition('cliLibrary')),
            reactLibrary: this._joinProjectTypeDefinitions(
                this._getCommonProjectTypeDefinition('reactLibrary'),
                this._getReactLibraryProjectTypeDefinition()
            ),
            webLibrary: this._joinProjectTypeDefinitions(
                this._getCommonProjectTypeDefinition('webLibrary'),
                this._getWebLibraryProjectTypeDefinition()
            )
        };
    }

    /**
     * Returns the file information for all files that are common to any
     * project. Expects the route of the project's subfolder.
     *
     * @param projectTypePath The route of the project's subfolder (e.g. 'cli-library')
     *
     * @returns A partial ProjectTypeDefinition.
     */
    private _getCommonProjectTypeDefinition(projectTypePath: string): Partial<ProjectTypeDefinition> {
        return {
            // only on init
            src: this._fileDefinition('src', {
                gobstonesScriptsLocation: [projectTypePath + '/src'],
                projectLocation: ['src'],
                copyOnInit: true
            }),
            test: this._fileDefinition('test', {
                gobstonesScriptsLocation: [projectTypePath + '/test'],
                projectLocation: ['test'],
                copyOnInit: true
            }),
            changelog: this._fileDefinition('changelog', {
                gobstonesScriptsLocation: ['common/CHANGELOG.md'],
                projectLocation: ['CHANGELOG.md'],
                copyOnInit: true
            }),
            packageJson: this._fileDefinition('packageJson', {
                gobstonesScriptsLocation: [projectTypePath + '/package-definition.json'],
                projectLocation: ['package.json'],
                copyOnInit: true
            }),
            readme: this._fileDefinition('readme', {
                gobstonesScriptsLocation: ['common/README.md'],
                projectLocation: ['README.md'],
                copyOnInit: true
            }),
            // on init but also on any update
            husky: this._fileDefinition('husky', {
                gobstonesScriptsLocation: ['common/husky'],
                projectLocation: ['.husky'],
                copyOnInit: true
            }),
            github: this._fileDefinition('github', {
                gobstonesScriptsLocation: ['common/github'],
                projectLocation: ['.github'],
                copyOnInit: true
            }),
            vscode: this._fileDefinition('vscode', {
                gobstonesScriptsLocation: ['common/vscode'],
                projectLocation: ['.vscode'],
                copyOnInit: true
            }),
            license: this._fileDefinition('license', {
                gobstonesScriptsLocation: ['common/LICENSE'],
                projectLocation: ['LICENSE'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            contributing: this._fileDefinition('contributing', {
                gobstonesScriptsLocation: ['common/CONTRIBUTING.md'],
                projectLocation: ['CONTRIBUTING.md'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            editorconfig: this._fileDefinition('editorconfig', {
                gobstonesScriptsLocation: ['common/editorconfig'],
                projectLocation: ['.editorconfig'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            prettier: this._fileDefinition('prettier', {
                gobstonesScriptsLocation: ['common/prettierignore', 'common/prettierrc'],
                projectLocation: ['.prettierignore', '.prettierrc'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            npm: this._fileDefinition('npm', {
                gobstonesScriptsLocation: ['common/npmignore', 'common/npmrc'],
                projectLocation: ['.npmignore', '.npmrc'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            eslint: this._fileDefinition('eslint', {
                gobstonesScriptsLocation: ['common/eslintrc.js'],
                projectLocation: ['.eslintrc.js'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            git: this._fileDefinition('git', {
                gobstonesScriptsLocation: ['common/gitignore'],
                projectLocation: ['.gitignore'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            commitlint: this._fileDefinition('commitlint', {
                gobstonesScriptsLocation: ['common/czrc', 'common/commitlint.config.js'],
                projectLocation: ['.czrc', 'commitlint.config.js'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            // only on eject
            nps: this._fileDefinition('nps', {
                gobstonesScriptsLocation: [projectTypePath + '/package-scripts.js'],
                projectLocation: ['package-scripts.js'],
                copyOnEject: true,
                isOverwritable: true
            }),
            rollup: this._fileDefinition('rollup', {
                gobstonesScriptsLocation: [projectTypePath + '/rollup.config.js'],
                projectLocation: ['rollup.config.js'],
                copyOnEject: true,
                isOverwritable: true
            }),
            typescript: this._fileDefinition('typescript', {
                gobstonesScriptsLocation: ['common/tsconfig.js'],
                projectLocation: ['tsconfig.js'],
                copyOnEject: true,
                isOverwritable: true
            }),
            tsConfigJSON: this._fileDefinition('tsConfigJSON', {
                // This file descriptor is used to find
                // The tsconfig.json generated after running
                // tsconfig.js, that's why it's not a real
                // file in any project type, but it can be.
                gobstonesScriptsLocation: ['common/tsconfig.json'],
                projectLocation: ['tsconfig.json'],
                isOverwritable: true
            }),
            typedoc: this._fileDefinition('typedoc', {
                gobstonesScriptsLocation: ['common/typedoc.config.js'],
                projectLocation: ['typedoc.config.js'],
                copyOnEject: true,
                isOverwritable: true
            }),
            jest: this._fileDefinition('jest', {
                gobstonesScriptsLocation: ['common/jest.config.js'],
                projectLocation: ['jest.config.js'],
                copyOnEject: true,
                isOverwritable: true
            })
        };
    }

    /**
     * Returns the file information for all files that are
     * exclusive to react-library projects
     *
     * @returns A partial ProjectTypeDefinition.
     */
    private _getReactLibraryProjectTypeDefinition(): Partial<ProjectTypeDefinition> {
        return {
            typedoc: this._fileDefinition('typedoc', {
                gobstonesScriptsLocation: ['react-library/typedoc.config.js'],
                projectLocation: ['typedoc.config.js'],
                copyOnEject: true,
                isOverwritable: true
            }),
            jest: this._fileDefinition('jest', {
                gobstonesScriptsLocation: ['common/jest.config.js'],
                projectLocation: ['jest.config.js'],
                copyOnEject: true,
                isOverwritable: true
            }),
            jestproxies: this._fileDefinition('jestproxies', {
                gobstonesScriptsLocation: ['react-library/jest'],
                projectLocation: ['.jest'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            vite: this._fileDefinition('vite', {
                gobstonesScriptsLocation: ['react-library/vite.config.ts'],
                projectLocation: ['vite.config.ts'],
                copyOnInit: true,
                copyOnUpdate: true
            }),
            stories: this._fileDefinition('stories', {
                gobstonesScriptsLocation: ['react-library/stories'],
                projectLocation: ['stories'],
                copyOnInit: true
            }),
            storybook: this._fileDefinition('storybook', {
                gobstonesScriptsLocation: ['react-library/storybook'],
                projectLocation: ['.storybook'],
                copyOnInit: true,
                copyOnUpdate: true
            })
        };
    }

    /**
     * Returns the file information for all files that are
     * exclusive to web-library projects
     *
     * @returns A partial ProjectTypeDefinition.
     */
    private _getWebLibraryProjectTypeDefinition(): Partial<ProjectTypeDefinition> {
        return {
            demos: this._fileDefinition('demos', {
                gobstonesScriptsLocation: ['web-library/demos'],
                projectLocation: ['demos'],
                copyOnInit: true,
                isOverwritable: false
            })
        };
    }

    /**
     * Initialize the different project type definitions with all their
     * file information filtered accordingly to their type.
     */
    private _loadProcessedProjectTypeDefinitions(): void {
        const retainKeysMatching = (o: ProjectTypeDefinition, onKey: string): FileName[] =>
            Object.keys(o).filter((e) => o[e][onKey]) as FileName[];

        const getProcessed = (projectType: ProjectType): FilteredFilesDefinition => ({
            copiedOnInit: retainKeysMatching(this._projectTypes[projectType], 'copyOnInit'),
            copiedOnEject: retainKeysMatching(this._projectTypes[projectType], 'copyOnEject'),
            copiedOnUpdate: retainKeysMatching(this._projectTypes[projectType], 'copyOnUpdate'),
            toolingFiles: retainKeysMatching(this._projectTypes[projectType], 'isOverwritable')
        });

        this._filteredProjectTypes = {
            library: getProcessed('library'),
            cliLibrary: getProcessed('cliLibrary'),
            reactLibrary: getProcessed('reactLibrary'),
            webLibrary: getProcessed('webLibrary')
        };
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
        return Object.assign({}, ...partialInfos);
    }

    /**
     * Return a file definition with defaults, that will be overwritten by the
     * partial file definition given.
     *
     * @param name The name of the file definition.
     * @param partialFileInfo The partial information for this file definition.
     * @returns A full file definition.
     */
    private _fileDefinition(name: FileName, partialFileInfo: Partial<FileDefinition>): FileDefinition {
        const projectTypeInfo = Object.assign(
            {
                name,
                gobstonesScriptsLocation: [],
                projectLocation: [],
                onInit: false,
                onUpdate: false,
                onEject: false,
                isOverwritable: false
            },
            partialFileInfo
        ) as FileDefinition;

        if (projectTypeInfo.isOverwritable) {
            projectTypeInfo.toolingFile = getToolingFile(
                this.locations.projectRoot,
                this.locations.gobstonesScriptsProjectsRoot,
                projectTypeInfo
            );
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
 * @group Internal API
 */
export const config: Config = new Config();
// ==========================================
// #endregion Config Instance
// ==========================================
