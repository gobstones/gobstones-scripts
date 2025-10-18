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
 * @module API
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import childProcess from 'child_process';
import path from 'path';

import fs from 'fs-extra';
import tsconfigJs from 'tsconfig.js';

import { FileSystemError } from './FileSystemError';

import { config } from '../Config';
import {
    FileDefinition,
    FileDefinitionWithTooling,
    FileName,
    ProjectTypeDefinition
} from '../Config/helpers/project-types';
import { logger } from '../Helpers/Logger';
import { CommandExecutionError } from './CommandExecutionError';

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
    config.init(projectType, packageManager, undefined, test);

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
    config.init(projectType, packageManager, undefined, test);

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
    runScript('git', ['init', '-q'], 'ignore');

    logger.debug(`[api] Running the package manager "${packageManager ?? ''}" installation step`);
    runScript(config.packageManager.install, [], 'ignore');
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
    config.init(projectType, undefined, undefined, undefined);

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
    config.init(projectType, undefined, undefined, undefined);

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
 *
 * @returns The list of updated files.
 */
export const run = (command: string, userArgs: string[] = [], projectType?: string, packageManager?: string): void => {
    config.init(projectType, packageManager, undefined, undefined);

    logger.debug(
        `[api] Requested a run action with values:` +
            `\n\tcommand: ${command}` +
            `\n\tuserArgs: ${userArgs.toString()}` +
            `\n\tprojectType: ${config.executionEnvironment.projectType}` +
            `\n\tpackageManager: ${config.executionEnvironment.packageManager}`
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

        const binary = config.getBinary('zx', 'zx');
        if (!binary) return;

        runScript(binary.command, ['./.scripts/_cli.ts', command, ...userArgs], 'inherit', (code: number) => {
            logger.debug(`[api] Execution finished with code: ${code.toString()}`);
            if (code !== 0) {
                logger.error(`[api] Script execution failed. See details above.`);
                deleteCreated(filesToDeleteAfterExecution);
                process.exit(code);
            }
            config.projectType.typescript.toolingFiles.main = '';
            deleteCreated(filesToDeleteAfterExecution);
        });
    };

    jsToJson(config.projectTypeGenerateableFiles, runCommand);
};

/**
 * Convert a set of .js files in CJS format into a matching
 * JSON files through evaluation. Execute the callback with
 * the converted file paths after all files were converted.
 *
 * @param creatableFiles - The js files to convert to json files
 * @param callback - The callback to execute after conversion.
 *
 * @internal
 */
const jsToJson = (
    creatableFiles: Partial<Record<FileName, Record<string, string>>>,
    callback: (created: string[]) => void
): void => {
    const createdFiles: string[] = [];
    const runChained = (fileDefinitions: [FileName, Record<string, string>][], onFinished: () => void): void => {
        if (fileDefinitions.length === 0) {
            // Nothing to convert, finish
            onFinished();
            return;
        }
        if (Object.keys(fileDefinitions[1]).length === 0) {
            // Nothing more to convert for this filename, go to next.
            const [_, ...restOfFiles] = fileDefinitions;
            runChained(restOfFiles, onFinished);
            return;
        }
        const [currentFileDef, ...remainingFilesDef] = fileDefinitions;
        const currentFilename = currentFileDef[0];
        const filesToConvert = currentFileDef[1];

        const currentFileToConvertKey = Object.keys(filesToConvert)[0];
        const currentFileToConvert = filesToConvert[currentFileToConvertKey];
        const remainingFilesToConvert = { ...filesToConvert };
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete remainingFilesToConvert[currentFileToConvertKey];

        logger.debug(`[api] Creating configuration file: ${currentFileToConvert}`);
        tsconfigJs
            .once({
                root: currentFileToConvert,
                addComments: 'none',
                logToConsole: false
            })
            .then(() => {
                const convertedFileName =
                    currentFileToConvert.substring(
                        0,
                        currentFileToConvert.length - path.extname(currentFileToConvert).length
                    ) + '.json';
                createdFiles.push(convertedFileName);
                const toolingFile = (config?.projectType[currentFilename] as FileDefinitionWithTooling)?.toolingFiles;
                toolingFile[currentFileToConvertKey] = convertedFileName;
                runChained([[currentFilename, remainingFilesToConvert], ...remainingFilesDef], onFinished);
            })
            .catch((e: unknown) => {
                logger.error(e as string);
            });
    };
    runChained(
        Object.keys(creatableFiles).map((k) => [k as FileName, creatableFiles[k] as Record<string, string>]),
        () => {
            callback(createdFiles);
        }
    );
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
 * @param stdio - The stdio configuration.
 * @param callback - A function to call once the command has executed.
 *
 * @internal
 */
const runScript = (
    command: string,
    args: string[] = [],
    stdio: childProcess.StdioNull | childProcess.StdioPipe = 'inherit',
    callback?: (code: number | null) => void
): void => {
    const options: childProcess.SpawnOptionsWithStdioTuple<
        childProcess.StdioNull | childProcess.StdioPipe,
        childProcess.StdioNull | childProcess.StdioPipe,
        childProcess.StdioNull | childProcess.StdioPipe
    > = {
        shell: true,
        stdio: [stdio, stdio, stdio],
        env: {
            ...process.env
        }
    };
    try {
        logger.debug(`[api] Attempting to execute ${command} with args: ${args.join(' ')}`);
        const cmd = childProcess.spawnSync(command, args, options);
        const code = cmd.status;
        if (code && code > 0) {
            throw new CommandExecutionError('errors.commandExecutionFailed', command, code);
        }
        if (typeof callback === 'function') {
            logger.debug('[api] Callback given');
            // cmd.on('close', (code, signal) => {
            logger.debug('[api] Command finished, calling callback');
            callback(code);
            // });
        } else {
            logger.debug('[api] No callback given');
        }
    } catch (e: unknown) {
        const error = e as { toString(): string };
        logger.debug(`[api] Execution failed`);
        logger.debug(error.toString(), 'red');
        throw e;
    }
};
