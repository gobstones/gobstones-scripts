/**
 * @module API
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import childProcess from 'child_process';
import path from 'path';

import fs from 'fs-extra';
import tsconfigJs from 'tsconfig.js';

import { FileDefinition, ProjectTypeDefinition, config } from '../config';
import { logger } from '../helpers/Logger';
import { tasks } from '../tasks';

/**
 * Create a new library project in a subfolder with the given name.
 * This includes creating all the required and recommended style files
 * define a package.json, git configuration files, visual studio code
 * files, NPM configuration files, contribution guidelines, a readme,
 * a license (MIT by default), install all dependencies, and initialize
 * a git repository.
 *
 * @param projectName The name of the project to be created.
 * @param projectType The project type to create (Defaults to `"library"`).
 * @param packageManager The package manager to use when downloading dependencies.
 * @param isTest Whether test information should be added to the .npmrc file.
 *
 * @throws If the argument for projectType or packageManager is invalid.
 * @throws If there's already a folder with the project name, or the folder is not empty.
 *
 * @group API: Functions
 */
function create(projectName: string, projectType?: string, packageManager?: string, isTest: boolean = false): void {
    config.init(projectType, packageManager, false, isTest);

    logger.debug(
        `[api] Requested a create action with values:` +
            `\n\tprojectName: ${projectName}` +
            `\n\tprojectType: ${config.executionEnvironment.projectType}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}` +
            `\n\tisTest: ${config.executionEnvironment.isTestMode}`
    );

    const projectFolder = path.join(config.environment.workingDirectory, projectName);

    logger.debug(`[api] Attempting to create project in the following folder: ${projectFolder}`);

    if (!fs.existsSync(projectFolder)) {
        logger.debug(`[api] Folder does not exist, creating folder at: ${projectFolder}`);
        fs.mkdirSync(projectFolder);
    }

    logger.debug(`[api] Changing current directory to: ${projectFolder}`);
    config.changeDir(projectFolder);

    logger.debug(`[api] Calling project initialization`);
    init(projectType, packageManager, isTest);
}

/**
 * The same as {@link create}, but runs on the local folder as a project.
 * That is, initialize a project in the given folder, which default
 * to the root. Note that the folder must be empty in order to
 * initialize a project in the folder.
 *
 * @param projectType The project type to initialize (Defaults to `"library"`).
 * @param packageManager The package manager to use when downloading dependencies.
 * @param isTest Whether test information should be added to the .npmrc file.
 *
 * @throws If the current folder is not empty.
 *
 * @group API: Functions
 */
function init(projectType?: string, packageManager?: string, isTest: boolean = false): void {
    config.init(projectType, packageManager, false, isTest);

    logger.debug(
        `[api] Requested an init action with values:` +
            `\n\tprojectType: ${config.executionEnvironment.projectType}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}` +
            `\n\tisTest: ${config.executionEnvironment.isTestMode}`
    );

    const filesInFolder = fs.readdirSync(config.locations.projectRoot);

    if (filesInFolder.length !== 0) {
        throw Error('non empty folder');
    }

    const projectName: string = path.basename(config.locations.projectRoot);
    logger.debug(`[api] The project name based on the current directory is ${projectName}`);

    copyFilesFrom(config.projectType, config.projectTypeFilteredFiles.copiedOnInit, false, false, isTest);

    logger.debug(`[api] Updated references to project name in files with: ${projectName}`);
    replaceInnerReferencesInFiles(
        [
            path.join(config.environment.workingDirectory, 'README.md'),
            path.join(config.environment.workingDirectory, 'package.json')
        ],
        /<library-name>/g,
        projectName
    );

    logger.debug(`[api] Initializing the folder as a git repository`);
    runScript('git', ['init', '-q']);

    logger.debug(`[api] Running the package manager "${packageManager}" installation step`);
    runScript(config.packageManager.install);
}

/**
 * Override the missing configuration files that are created on
 * an **init** or **create** command on the local project. This
 * is intended to be run locally, on an already created project,
 * to update the configuration. By appending **force** as a
 * subcommand, all files are updated to their latest version.
 *
 * @param files The file name to update, or "all" if all should be
 *      updated (Defaults to `"all"`).
 * @param force Whether to force the update of files, that is,
 *      override already present files in the project with their newest version
 *      (Defaults to `false`).
 * @param projectType The project type to update from (Defaults to `"library"`).
 * @param isTest Whether test information should be added to the .npmrc file.
 *
 * @returns The list of updated files.
 *
 * @group API: Functions
 */
function update(file: string = 'all', force: boolean = false, projectType?: string, isTest: boolean = false): string[] {
    config.init(projectType, undefined, false, false);

    logger.debug(
        `[api] Requested an update action with values:` +
            `\n\tfile: ${file}` +
            `\n\tforce: ${force}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}` +
            `\n\tisTest: ${config.executionEnvironment.isTestMode}`
    );

    const filesToCopy = file === 'all' ? config.projectTypeFilteredFiles.copiedOnUpdate : [file];

    logger.debug(`[api] About to copy files: ${filesToCopy.join(', ')}`);

    return copyFilesFrom(config.projectType, filesToCopy, force, false, isTest);
}
/**
 * Eject all the general configuration files to the root project.
 * This includes configuration files for Typescript, Typedoc, JEST,
 * Rollup, and nps. This command is intended to be run locally. If
 * **force** is added, all previously created local files are updated
 * to their latest version. If not, only missing files are copied.
 *
 * @param file The file name to update, or "all" if all should
 *      be updated (Defaults to `"all"`).
 * @param force Whether to force the ejection of files, that is,
 *      override already present files in the project with their newest version
 *      (Defaults to `false`).
 * @param projectType The project type to eject from (Defaults to `"library"`).
 *
 * @returns The list of updated files.
 *
 * @group API: Functions
 */
function eject(file: string = 'all', force: boolean = false, projectType?: string): string[] {
    config.init(projectType, undefined, false, false);

    logger.debug(
        `[api] Requested an eject action with values:` +
            `\n\tfile: ${file}` +
            `\n\tforce: ${force}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}`
    );

    const filesToCopy = file === 'all' ? config.projectTypeFilteredFiles.copiedOnEject : [file];

    logger.debug(`[api] About to copy files: ${filesToCopy.join(', ')}`);

    return copyFilesFrom(config.projectType, filesToCopy, force, false);
}

/**
 * Run a command using **nps**. nps allows to run different scripts
 * configured, such as scripts for linting, prettyfing, testing,
 * generating documentation, running in development mode, and others.
 *
 * @param command The nps command to execute.
 * @param userArgs The nps command additional arguments.
 * @param projectTypeName The project type to use as configuration (Defaults to `"library"`).
 * @param packageManagerName The package manager to use when running commands.
 *
 * @returns The list of updated files.
 *
 * @group API: Functions
 */
function run(command: string, userArgs: string[] = [], projectType?: string, packageManager?: string): void {
    config.init(projectType, packageManager, false, false);

    logger.debug(
        `[api] Requested a run action with values:` +
            `\n\tcommand: ${command}` +
            `\n\tuserArgs: ${userArgs}` +
            `\n\tprojectType: ${config.executionEnvironment.projectType}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}`
    );

    const runCode = (deleteTsConfig = false): void => {
        logger.debug(
            `[api] Running code. Will ${deleteTsConfig ? '' : 'NOT'} delete configuration file after running.`
        );
        runScript(
            tasks.runBin('nps'),
            ['-c', config.projectType.nps.toolingFile, command, ...userArgs],
            undefined,
            function () {
                logger.debug(`[api] Execution finished.`);
                if (deleteTsConfig) {
                    logger.debug(`[api] Deleting configuration file.`);
                    fs.unlinkSync(config.projectType.tsConfigJSON.toolingFile);
                }
            }
        );
    };

    if (config.projectType.tsConfigJSON.toolingFile) {
        logger.debug(`[api] Found a configuration file for TypeScript in the local folder.`);
        runCode(false);
    } else {
        logger.debug(
            `[api] Configuration file for TypeScript in local folder should ` +
                `be generated for temporary execution. Definition will be copied from: ` +
                `${config.projectType.typescript.toolingFile}`
        );
        tsconfigJs
            .once({
                root: config.projectType.typescript.toolingFile,
                addComments: 'none'
            })
            .then(function () {
                runCode(true);
            });
    }
}

/**
 * Copy all files in a given project type definition that are present
 * in the list of files to copy. If the file already exists in the
 * final location stated in file definition, it will not be copied unless
 * the overwrite option is set to true.
 *
 * If the dryRun option is set to true,
 * no files will be copied, but the list of files that should have been copied
 * is returned.
 *
 * If the addTestLine is set to true, then, if the file .npmrc is copied,
 * the verdaccio test information will be written to the contents of the file.
 *
 * @param projectTypeDef The project type definition that contains the
 *  information of the files to copy.
 * @param filesToCopy The actual list of files to copy.
 * @param overwrite Whether or not to overwrite already present files
 * @param dryRun Whether or not thi is a dry run.
 * @param addTestLine Whether to add the verdaccio information line to the .npmrc file
 *
 * @returns The list of copied files names, full path.
 *
 * @group Internal: Functions
 */
function copyFilesFrom(
    projectTypeDef: ProjectTypeDefinition,
    filesToCopy: string[],
    overwrite: boolean = false,
    dryRun: boolean = false,
    addTestLine: boolean = false
): string[] {
    const copied: string[] = [];

    // Retain only file descriptors to copy
    const fileDescriptorsToCopy: FileDefinition[] = [];
    for (const fileToCopy of filesToCopy) {
        fileDescriptorsToCopy.push(projectTypeDef[fileToCopy]);
    }

    // Copy those files
    for (const fileDescriptor of fileDescriptorsToCopy) {
        logger.debug(
            `[api] Attempting to copy the files ` +
                `"${fileDescriptor.gobstonesScriptsLocation.join(', ')}" ` +
                `as "${fileDescriptor.projectLocation.join(', ')}"`
        );
        for (let i = 0; i < fileDescriptor.gobstonesScriptsLocation.length; i++) {
            const gScriptsRelativePath = fileDescriptor.gobstonesScriptsLocation[i];
            const projectPath = fileDescriptor.projectLocation[i];

            const gScriptsFullPath = path.join(config.locations.gobstonesScriptsProjectsRoot, gScriptsRelativePath);
            const fullProjectPath = path.join(config.locations.projectRoot, projectPath);

            // If files should be overwritten, then delete
            // file prior to copying
            if (overwrite && fs.existsSync(fullProjectPath)) {
                logger.debug(`[api] File already exists in project and "force" set, deleting file.`);
                if (!dryRun) {
                    fs.removeSync(fullProjectPath);
                }
            }

            // Ensure always that the file exists prior to copying
            if (fs.existsSync(gScriptsFullPath)) {
                logger.debug(`[api] Copying the file ${gScriptsFullPath}`);
                if (!dryRun) {
                    fs.copySync(gScriptsFullPath, fullProjectPath);
                    if (fullProjectPath.endsWith('.npmrc') && addTestLine) {
                        logger.debug(
                            `[api] Add the registry for verdaccio server to .npmrc, as we are running in test mode`
                        );
                        fs.appendFileSync(fullProjectPath, '@gobstones:registry=http://localhost:4567');
                    }
                }
                copied.push(fullProjectPath);
            } else {
                logger.debug(`[api] Attempted to copy the file ${gScriptsFullPath}, but not found.`);
            }
        }
    }

    // Return a list of all copied files
    return copied;
}

/**
 * Replace all appearances of **reference** in the contents of all files in
 * **files** by the new string **newReference**.
 *
 * @param files The files in which to replace
 * @param reference The text to be replaced
 * @param newReference The new text to replace with
 *
 * @group Internal: Functions
 */
function replaceInnerReferencesInFiles(files: string[], reference: string | RegExp, newReference: string): void {
    for (const file of files) {
        logger.debug(`[api] Updating reference in file: ${file}`);
        if (fs.existsSync(file)) {
            logger.debug(`[api] File found. Updating reference`);
            fs.writeFileSync(file, fs.readFileSync(file, 'utf-8').replace(reference, newReference), 'utf-8');
        } else {
            logger.debug(`[api] File not found`);
        }
    }
}

/**
 * Run a CLI command as a child process.
 *
 * @param command The command to run.
 * @param args The arguments for the command to run.
 * @param options The options for the shell.
 * @param callback A function to call once the command has executed.
 *
 * @group Internal: Functions
 */
function runScript(
    command: string,
    args: string[] = [],
    options: childProcess.SpawnOptionsWithStdioTuple<'inherit', 'inherit', 'inherit'> = {
        shell: true,
        stdio: ['inherit', 'inherit', 'inherit'],
        env: {
            ...process.env
        }
    },
    callback: (code: number, signal: NodeJS.Signals) => void | undefined = undefined
): void {
    try {
        logger.debug(`[api] Attempting to execute ${command} with args: ${args}`);
        const cmd = childProcess.spawn(command, args, options);
        if (callback) {
            cmd.on('close', callback);
        }
    } catch (e) {
        logger.debug(`[api] Execution failed`);
        logger.warn(e.toString());
        process.stderr.write(e.toString());
        process.exit(1);
    }
}

/**
 * The api object contains all the available functions
 * of the API.
 *
 * @group API: Main
 */
export const api = {
    create,
    init,
    eject,
    update,
    run
};
