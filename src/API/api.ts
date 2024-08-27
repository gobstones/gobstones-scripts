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
 * ----------------------------------------------------
 * @module API
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * ----------------------------------------------------
 */

import childProcess from 'child_process';
import path from 'path';

import fs from 'fs-extra';
import tsconfigJs from 'tsconfig.js';

import { FileSystemError } from './FileSystemError';

import { config } from '../Config';
import { FileDefinition, ProjectTypeDefinition } from '../Config/config';
import { logger } from '../Helpers/Logger';

/**
 * Create a new library project in a subfolder with the given name.
 * This includes creating all the required and recommended style files
 * define a package.json, git configuration files, visual studio code
 * files, NPM configuration files, contribution guidelines, a readme,
 * a license (MIT by default), install all dependencies, and initialize
 * a git repository.
 *
 * @param projectName - The name of the project to be created.
 * @param projectType - The project type to create (Defaults to `"library"`).
 * @param packageManager - The package manager to use when downloading dependencies.
 * @param test - Whether test information should be added to the .npmrc file.
 *
 * @throws
 * {@link FileSystemError}: If the argument for projectType or packageManager is invalid.
 *
 * {@link FileSystemError}: If there's already a folder with the project name, or the folder is not empty.
 */
export const create = (projectName: string, projectType?: string, packageManager?: string, test?: boolean): void => {
    config.init(projectType, packageManager, undefined, test, undefined);

    logger.debug(
        `[api] Requested a create action with values:` +
            `\n\tprojectName: ${projectName}` +
            `\n\tprojectType: ${config.executionEnvironment.projectType}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}` +
            `\n\tisTest: ${config.executionEnvironment.test ? 'true' : 'false'}`
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
    init(projectType, packageManager, test);
};

/**
 * The same as {@link create}, but runs on the local folder as a project.
 * That is, initialize a project in the given folder, which default
 * to the root. Note that the folder must be empty in order to
 * initialize a project in the folder.
 *
 * @param projectType - The project type to initialize (Defaults to `"library"`).
 * @param packageManager - The package manager to use when downloading dependencies.
 * @param test - Whether test information should be added to the .npmrc file.
 *
 * @throws If the current folder is not empty.
 */
export const init = (projectType?: string, packageManager?: string, test?: boolean): void => {
    config.init(projectType, packageManager, undefined, test, undefined);

    logger.debug(
        `[api] Requested an init action with values:` +
            `\n\tprojectType: ${config.executionEnvironment.projectType}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}` +
            `\n\tisTest: ${config.executionEnvironment.test ? 'true' : 'false'}`
    );

    const filesInFolder = fs.readdirSync(config.locations.projectRoot);

    if (filesInFolder.length !== 0) {
        throw new FileSystemError('errors.emptyFolder');
    }

    const projectName: string = path.basename(config.locations.projectRoot);
    logger.debug(`[api] The project name based on the current directory is ${projectName}`);

    copyFilesFrom(config.projectType, config.projectTypeFilteredFiles.copiedOnInit, false, false, test, projectName);

    logger.debug(`[api] Initializing the folder as a git repository`);
    runScript('git', ['init', '-q']);

    logger.debug(`[api] Running the package manager "${packageManager ?? ''}" installation step`);
    runScript(config.packageManager.install);
};

/**
 * Override the missing configuration files that are created on
 * an **init** or **create** command on the local project. This
 * is intended to be run locally, on an already created project,
 * to update the configuration. By appending **force** as a
 * subcommand, all files are updated to their latest version.
 *
 * @param file - The file name to update, or "all" if all should be
 *      updated (Defaults to `"all"`).
 * @param force - Whether to force the update of files, that is,
 *      override already present files in the project with their newest version
 *      (Defaults to `false`).
 * @param projectType - The project type to update from (Defaults to `"library"`).
 * @param test - Whether test information should be added to the .npmrc file.
 *
 * @returns The list of updated files.
 */
export const update = (file: string = 'all', force?: boolean, projectType?: string, test?: boolean): string[] => {
    config.init(projectType, undefined, undefined, undefined, undefined);

    logger.debug(
        `[api] Requested an update action with values:` +
            `\n\tfile: ${file}` +
            `\n\tforce: ${force ? 'true' : 'false'}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}` +
            `\n\tisTest: ${config.executionEnvironment.test ? 'true' : 'false'}`
    );

    const projectName: string = path.basename(config.locations.projectRoot);
    logger.debug(`[api] The project name based on the current directory is ${projectName}`);

    const filesToCopy = file === 'all' ? config.projectTypeFilteredFiles.copiedOnUpdate : [file];

    logger.debug(`[api] About to copy files: ${filesToCopy.join(', ')}`);

    return copyFilesFrom(
        config.projectType,
        filesToCopy as (keyof ProjectTypeDefinition)[],
        force,
        false,
        test,
        projectName
    );
};
/**
 * Eject all the general configuration files to the root project.
 * This includes configuration files for Typescript, Typedoc, JEST,
 * Rollup, and nps. This command is intended to be run locally. If
 * **force** is added, all previously created local files are updated
 * to their latest version. If not, only missing files are copied.
 *
 * @param file - The file name to update, or "all" if all should
 *      be updated (Defaults to `"all"`).
 * @param force - Whether to force the ejection of files, that is,
 *      override already present files in the project with their newest version
 *      (Defaults to `false`).
 * @param projectType - The project type to eject from (Defaults to `"library"`).
 *
 * @returns The list of updated files.
 */
export const eject = (file: string = 'all', force?: boolean, projectType?: string): string[] => {
    config.init(projectType, undefined, undefined, undefined, undefined);

    logger.debug(
        `[api] Requested an eject action with values:` +
            `\n\tfile: ${file}` +
            `\n\tforce: ${force ? 'true' : 'false'}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}`
    );

    const projectName: string = path.basename(config.locations.projectRoot);
    logger.debug(`[api] The project name based on the current directory is ${projectName}`);

    const filesToCopy = file === 'all' ? config.projectTypeFilteredFiles.copiedOnEject : [file];

    logger.debug(`[api] About to copy files: ${filesToCopy.join(', ')}`);

    return copyFilesFrom(
        config.projectType,
        filesToCopy as (keyof ProjectTypeDefinition)[],
        force,
        false,
        false,
        projectName
    );
};

/**
 * Run a command using **nps**. nps allows to run different scripts
 * configured, such as scripts for linting, prettyfing, testing,
 * generating documentation, running in development mode, and others.
 *
 * @param command - The nps command to execute.
 * @param userArgs - The nps command additional arguments.
 * @param projectType - The project type to use as configuration (Defaults to `"library"`).
 * @param packageManager - The package manager to use when running commands.
 * @param usePlainTsConfig - Wether to use the plain tsconfig.json in project
 *                  folder instead of generating one from .js file.
 *
 * @returns The list of updated files.
 */
export const run = (
    command: string,
    userArgs: string[] = [],
    projectType?: string,
    packageManager?: string,
    usePlainTsConfig?: boolean
): void => {
    config.init(projectType, packageManager, undefined, undefined, usePlainTsConfig);

    logger.debug(
        `[api] Requested a run action with values:` +
            `\n\tcommand: ${command}` +
            `\n\tuserArgs: ${userArgs.toString()}` +
            `\n\tprojectType: ${config.executionEnvironment.projectType}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}` +
            `\n\tusePlainTsConfig: ${config.executionEnvironment.useLocalTsconfigJson ? 'yes' : 'no'}`
    );

    if (
        config.executionEnvironment.useLocalTsconfigJson &&
        !fs.existsSync(config.projectType.tsConfigJSON.toolingFile)
    ) {
        throw new FileSystemError('errors.undefinedTsConfig');
    }

    if (config.projectType.tsConfigJSON.toolingFile) {
        logger.debug(`[api] Found a configuration file for TypeScript in the local folder.`);
        if (config.executionEnvironment.useLocalTsconfigJson) {
            logger.debug(`[api] No deletion as the usePlainTsConfig is set to true.`);
        } else {
            logger.debug(
                `[api] Deleting as usePlainTsConfig is set to false, and it's probably a ` +
                    `leftover from previous executions.`
            );
            fs.unlinkSync(config.projectType.tsConfigJSON.toolingFile);
        }
    }

    logger.debug(
        `[api] Configuration file for TypeScript in local folder should ` +
            `be generated for temporary execution. Definition will be copied from: ` +
            (config.projectType.typescript.toolingFile ?? '')
    );

    const runCommand = (filesToDeleteAfterExecution: string[]): void => {
        const deleteCreated = (created: string[]): void => {
            for (const each of created) {
                if (fs.existsSync(each)) {
                    logger.debug(`[api] Deleting configuration file: ${each}`);
                    fs.unlinkSync(each);
                }
            }
        };

        const binary = config.getBinary('nps', 'nps');
        if (!binary) return;

        runScript(
            binary.command,
            ['-c', config.projectType.nps.toolingFile, command, ...userArgs],
            (code: number) => {
                logger.debug(`[api] Execution finished with code: ${code.toString()}`);
                if (code !== 0) {
                    logger.error(`[api] Script execution failed. See details above.`);
                    process.exit(code);
                }
                config.projectType.tsConfigJSON.toolingFile = '';
                config.projectType.licenseHeaderConfig.toolingFile = '';
                deleteCreated(filesToDeleteAfterExecution);
            },
            undefined
        );
    };

    const filesToConvert = (
        config.executionEnvironment.useLocalTsconfigJson
            ? [config.projectType.licenseHeaderConfig.toolingFile ?? '']
            : [
                  config.projectType.typescript.toolingFile ?? '',
                  config.projectType.licenseHeaderConfig.toolingFile ?? ''
              ]
    ).filter((e) => e !== '');

    jsToJson(filesToConvert, (createdFiles: string[]) => {
        for (const createdFile of createdFiles) {
            const createdFileNoPath = path.basename(createdFile);
            const createdFileNoExtension = createdFileNoPath.substring(
                0,
                createdFileNoPath.length - path.extname(createdFileNoPath).length
            );

            if (
                config.projectType.tsConfigJSON.toolingFile !== undefined &&
                path.basename(config.projectType.tsConfigJSON.toolingFile).startsWith(createdFileNoExtension)
            ) {
                config.projectType.tsConfigJSON.toolingFile = createdFile;
            }
            if (
                config.projectType.licenseHeaderConfig.toolingFile !== undefined &&
                path.basename(config.projectType.licenseHeaderConfig.toolingFile).startsWith(createdFileNoExtension)
            ) {
                config.projectType.licenseHeaderConfig.toolingFile = createdFile;
            }
        }
        runCommand(createdFiles);
    });
};

/**
 * Convert a set of .js files in CJS format into a matching
 * JSON files through evaluation. Execute the callback with
 * the converted file paths after all files were converted.
 *
 * @param files - The js files to convert to json files
 * @param callback - The callback to execute after conversion.
 *
 * @internal
 */
const jsToJson = (files: string[], callback: (created: string[]) => void): void => {
    const createdFiles: string[] = [];
    const runChained = (remainingFiles: string[]): void => {
        logger.debug(`[api] Creating configuration file: ${remainingFiles[0]}`);
        tsconfigJs
            .once({
                root: remainingFiles[0],
                addComments: 'none',
                logToConsole: false
            })
            .then(() => {
                for (const remainingFile of remainingFiles) {
                    createdFiles.push(
                        remainingFile.substring(0, remainingFile.length - path.extname(remainingFile).length) + '.json'
                    );
                }
                if (remainingFiles.length === 1) {
                    // If no more files to convert,
                    // run callback and delete elements
                    callback(createdFiles);
                } else {
                    // Else, keep converting
                    const others = [...remainingFiles];
                    others.splice(0, 1);
                    runChained(others);
                }
            })
            .catch((e: unknown) => {
                logger.error(e as string);
            });
    };
    runChained(files);
};
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
 * @param projectTypeDef - The project type definition that contains the
 *  information of the files to copy.
 * @param filesToCopy - The actual list of files to copy.
 * @param overwrite - Whether or not to overwrite already present files
 * @param dryRun - Whether or not thi is a dry run.
 * @param addTestLine - Whether to add the verdaccio information line to the .npmrc file
 *
 * @returns The list of copied files names, full path.
 *
 * @internal
 */
const copyFilesFrom = (
    projectTypeDef: ProjectTypeDefinition,
    filesToCopy: (keyof ProjectTypeDefinition)[],
    overwrite: boolean = false,
    dryRun: boolean = false,
    addTestLine: boolean = false,
    projectName: string
): string[] => {
    const copied: string[] = [];

    // Retain only file descriptors to copy
    const fileDescriptorsToCopy: FileDefinition[] = [];
    for (const fileToCopy of filesToCopy) {
        if (projectTypeDef[fileToCopy]) {
            fileDescriptorsToCopy.push(projectTypeDef[fileToCopy]);
        }
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

                    // Insert testing data if it has to
                    if (fileDescriptor.requiresTestDataInjection && addTestLine) {
                        logger.debug(
                            `[api] Add the registry for verdaccio server to the file, as we are running in test mode`
                        );
                        fs.appendFileSync(fullProjectPath, config.environment.toolTestServer);
                    }

                    // Perform text name replacements if it has to
                    if (fileDescriptor.requiresReferenceUpdate) {
                        logger.debug(`[api] Updated references to project name in file with: ${projectName}`);
                        if (fs.existsSync(fullProjectPath)) {
                            fs.writeFileSync(
                                fullProjectPath,
                                fs.readFileSync(fullProjectPath, 'utf-8').replace(/<library-name>/g, projectName),
                                'utf-8'
                            );
                        } else {
                            logger.debug(`[api] Could not update references, file was not copied.`);
                        }
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
};

/**
 * Run a CLI command as a child process.
 *
 * @param command - The command to run.
 * @param args - The arguments for the command to run.
 * @param callback - A function to call once the command has executed.
 * @param options - The options for the shell.
 *
 * @internal
 */
const runScript = (
    command: string,
    args: string[] = [],
    callback?: (code: number | null, child: childProcess.ChildProcess, signal: NodeJS.Signals | null) => void,
    options: childProcess.SpawnOptionsWithStdioTuple<'inherit', 'inherit', 'inherit'> = {
        shell: true,
        stdio: ['inherit', 'inherit', 'inherit'],
        env: {
            ...process.env
        }
    }
): void => {
    try {
        logger.debug(`[api] Attempting to execute ${command} with args: ${args.toString()}`);
        const cmd = childProcess.spawn(command, args, options);
        if (typeof callback === 'function') {
            logger.debug('[api] Callback given');
            cmd.on('close', (code, signal) => {
                logger.debug('[api] Command finished, calling callback');
                callback(code, cmd, signal);
            });
        } else {
            logger.debug('[api] No callback given');
        }
    } catch (e: unknown) {
        const error = e as { toString(): string };
        logger.debug(`[api] Execution failed`);
        logger.warn(error.toString());
        process.stderr.write(error.toString());
        process.exit(1);
    }
};
