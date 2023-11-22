/**
 * @module API
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import childProcess from 'child_process';
import { config } from '../config';
import { failIfArgumentInvalid } from './validators';
import fs from 'fs-extra';
import path from 'path';
import { tasks } from '../tasks';
import tsconfigJs from 'tsconfig.js';

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
 *
 * @throws If the argument for projectType or packageManager is invalid.
 * @throws If there's already a folder with the project name, or the folder is not empty.
 *
 * @group Main API Function
 */
export function create(
    projectName: string,
    projectType: string,
    packageManager: string,
    isTest: boolean = false
): void {
    // Set defaults if not given, or register loaded options
    [projectType, packageManager] = loadOptions(projectType, packageManager);

    // Validate arguments
    failIfArgumentInvalid(projectType, 'projectType', Object.keys(config.projectTypes));
    failIfArgumentInvalid(packageManager, 'packageManager', Object.keys(config.packageManagers));

    const projectFolder = path.join(config.currentDir, projectName);
    if (!fs.existsSync(projectFolder)) {
        fs.mkdirSync(projectFolder);
    }
    changeDir(projectFolder);
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
 *
 * @throws If the current folder is not empty.
 *
 * @group Main API Function
 */
export function init(projectType: string, packageManager: string, isTest: boolean = false): void {
    // Set defaults if not given, or register loaded options
    [projectType, packageManager] = loadOptions(projectType, packageManager);

    // Validate arguments
    failIfArgumentInvalid(projectType, 'projectType', Object.keys(config.projectTypes));
    failIfArgumentInvalid(packageManager, 'packageManager', Object.keys(config.packageManagers));

    const filesInFolder = fs.readdirSync(config.currentDir);
    if (filesInFolder.length !== 0) {
        throw Error('non empty folder');
        // TODO A better option will be to update
        // the package.json and overwrite the required
        // files, so it works even with existing projects.
        // That implies reading and writing to the package.json
        // and later call install to update packages. Once
        // that is done, just call the update function with
        // all to overwrite existing files with current configuration.
    }

    const projectName: string = path.basename(config.currentDir);

    replaceInnerReferencesInFiles(
        [path.join(config.currentDir, 'README.md'), path.join(config.currentDir, 'package.json')],
        /<library-name>/g,
        projectName
    );

    runScript(config[packageManager].install);
    runScript('git', ['init', '-q']);
}

/**
 * Override the missing configuration files that are created on
 * an **init** or **create** command on the local project. This
 * is intended to be run locally, on an already created project,
 * to update the configuration. By appending **force** as a
 * subcommand, all files are updated to their latest version.
 *
 * @param force Wether to force the update of files, that is,
 *      override already present files in the project with their newest version
 *      (Defaults to `false`).
 * @param file The file name to update, or "all" if all should be
 *      updated (Defaults to `"all"`).
 * @param projectType The project type to update from (Defaults to `"library"`).
 *
 * @returns The list of updated files.
 *
 * @group Main API Function
 */
export function update(
    force: boolean = false,
    file: string = 'all',
    projectType?: string,
    isTest: boolean = false
): string[] {
    // Set defaults if not given, or register loaded options
    [projectType] = loadOptions(projectType, undefined);

    // Validate arguments
    failIfArgumentInvalid(projectType, 'projectType', Object.keys(config.projectTypes));
    if (file !== 'all') {
        failIfArgumentInvalid(file, 'file', config[projectType].onUpdate);
    }

    const filesToCopy = file === 'all' ? config[projectType].onUpdate : [file];
    return copyFilesFrom(config[projectType], filesToCopy, force, false, isTest);
}
/**
 * Eject all the general configuration files to the root project.
 * This includes configuration files for Typescript, Typedoc, JEST,
 * Rollup, and nps. This command is intended to be run locally. If
 * **force** is added, all previously created local files are updated
 * to their latest version. If not, only missing files are copied.
 *
 * @param force Wether to force the ejection of files, that is,
 *      override already present files in the project with their newest version
 *      (Defaults to `false`).
 * @param file The file name to update, or "all" if all should
 *      be updated (Defaults to `"all"`).
 * @param projectType The project type to eject from (Defaults to `"library"`).
 *
 * @returns The list of updated files.
 *
 * @group Main API Function
 */
function eject(force: boolean = false, file: string = 'all', projectType?: string): string[] {
    // Set defaults if not given, or register loaded options
    [projectType] = loadOptions(projectType, undefined);

    // Validate arguments
    failIfArgumentInvalid(projectType, 'projectType', Object.keys(config.projectTypes));
    if (file !== 'all') {
        failIfArgumentInvalid(file, 'file', config[projectType].onEject);
    }

    const filesToCopy = file === 'all' ? config[projectType].onEject : [file];
    const filesCopied = copyFilesFrom(config[projectType], filesToCopy, force, false);

    return filesCopied;
}

/**
 * Run a command using **nps**. nps allows to run different scripts
 * configured, such as scripts for linting, prettyfing, testing,
 * generating documentation, running in development mode, and others.
 *
 * @param command The nps command to execute.
 * @param userArgs The nps command additional arguments.
 * @param projectType The project type to use as configuration (Defaults to `"library"`).
 * @param packageManager The package manager to use when running commands.
 *
 * @returns The list of updated files.
 *
 * @group Main API Function
 */
function run(
    command: string,
    userArgs: string[] = [],
    packageManager: string,
    projectType: string
): void {
    // Set defaults if not given, or register loaded options
    [projectType, packageManager] = loadOptions(projectType, packageManager);

    // Validate arguments
    failIfArgumentInvalid(projectType, 'projectType', Object.keys(config.projectTypes));
    failIfArgumentInvalid(packageManager, 'packageManager', Object.keys(config.packageManagers));

    const runCode = (deleteTsConfig = false): void => {
        runScript(
            tasks.runBin('nps'),
            ['-c', config.configurationFiles[projectType].nps as string, command, ...userArgs],
            undefined,
            function () {
                if (deleteTsConfig) {
                    fs.unlinkSync(config.configurationFiles[projectType].tsConfigFile);
                }
            }
        );
    };

    if (config.configurationFiles[projectType].tsConfigFileLocal) {
        runCode(false);
    } else {
        tsconfigJs
            .once({
                root: config.configurationFiles[projectType].ts,
                addComments: 'none'
            })
            .then(function () {
                runCode(true);
            });
    }
}

/**
 * Change the current directory of the process to another one.
 *
 * @param dir The directory to change to
 *
 * @group Internal API Function
 */
function changeDir(dir: string): string {
    process.chdir(dir);
    config.currentDir = dir;
    config.projectRootPath = dir;
    return dir;
}

/**
 * Copy all files from a folder to another. If overwrite is true, any existing
 * file will be overwritten. The toHide array may contain a set of files or
 * folder names that will be prefixed with "." after copying.
 *
 * @param fromFolder The folder to copy from.
 * @param toFolder The folder to copy to.
 * @param overwrite Wether or not to overwrite the files already present.
 * @param toHide A list of files to hide after copying.
 *
 * @returns The list of copied files names, full path.
 *
 * @group Internal API Function
 */
function copyFilesFrom(
    fileDescriptors: string[],
    filesToCopy: string[],
    overwrite: boolean = false,
    dryRun: boolean = false,
    addTestLine: boolean = false
): string[] {
    const copied: string[] = [];

    // Retain only file descriptors to copy
    const fileDescriptorsToCopy = [];
    for (const fileToCopy of filesToCopy) {
        fileDescriptorsToCopy.push(fileDescriptors[fileToCopy]);
    }

    // Copy those files
    for (const fileDescriptor of fileDescriptorsToCopy) {
        for (let i = 0; i < fileDescriptor.localPath.length; i++) {
            const localPath = fileDescriptor.localPath[i];
            const projectPath = fileDescriptor.projectPath[i];

            const fullLocalPath = path.join(config.gobstonesScriptProjectPath, localPath);
            const fullProjectPath = path.join(config.projectRootPath, projectPath);

            // If files should be overwritten, then delete
            // file prior to copying
            if (overwrite && fs.existsSync(fullProjectPath)) {
                if (!dryRun) {
                    fs.removeSync(fullProjectPath);
                }
            }

            // Ensure always that the file exists prior to copying
            if (fs.existsSync(fullLocalPath)) {
                if (!dryRun) {
                    fs.copySync(fullLocalPath, fullProjectPath);
                    if (fullProjectPath.endsWith('.npmrc') && addTestLine) {
                        fs.appendFileSync(
                            fullProjectPath,
                            '@gobstones:registry=http://localhost:4567'
                        );
                    }
                }
                copied.push(fullProjectPath);
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
 */
function replaceInnerReferencesInFiles(
    files: string[],
    reference: string | RegExp,
    newReference: string
): void {
    for (const file of files) {
        if (fs.existsSync(file)) {
            fs.writeFileSync(
                file,
                fs.readFileSync(file, 'utf-8').replace(reference, newReference),
                'utf-8'
            );
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
 * @group Internal API Function
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
        const cmd = childProcess.spawn(command, args, options);
        if (callback) {
            cmd.on('close', callback);
        }
    } catch (e) {
        process.stderr.write(e.toString());
        process.exit(1);
    }
}

/**
 * Load the options for a given project type and package manager.
 *
 * @param projectType The project type, if any.
 * @param packageManager The package manager, if any.
 *
 * @returns A pair with the project type loaded and the package manager to use.
 *
 * @group Internal API Function
 */
function loadOptions(projectType?: string, packageManager?: string): [string, string] {
    if (projectType) {
        config.loadedOptions.type = projectType;
        config.loadedOptions.status.type = 'cli';
    } else {
        projectType = config.loadedOptions.type;
    }
    if (packageManager) {
        config.loadedOptions.manager = projectType;
        config.loadedOptions.status.manager = 'cli';
    } else {
        packageManager = config.loadedOptions.manager;
    }
    return [projectType, packageManager];
}

/**
 * The api object contains all the available functions
 * of the API.
 *
 * @group Main API
 */
export const api = {
    create,
    init,
    eject,
    update,
    run
};
