/**
 * The API contains a set of
 *
 * @namespace API.Public
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const tsconfigJs = require('tsconfig.js');

const validators = require('./validators');

const config = require('../config');
const tasks = require('../tasks');

/**
 * Create a new library project in a subfolder with the given name.
 * This includes creating all the required and recommended style files
 * define a package.json, git configuration files, visual studio code
 * files, NPM configuration files, contribution guidelines, a readme,
 * a license (MIT by default), install all dependencies, and initialize
 * a git repository.
 *
 * @param {string} projectName The name of the project to be created.
 * @param {string} [projectType] The project type to create (Defaults to `"library"`).
 * @param {string} [packageManager] The package manager to use when downloading dependencies.
 *
 * @throws If the argument for projectType or packageManager is invalid.
 * @throws If there's already a folder with the project name, or the folder is not empty.
 *
 * @static
 * @memberof API.Public
 */
function create(projectName, projectType, packageManager) {
    // Set defaults if not given, or register loaded options
    [projectType, packageManager] = loadOptions(projectType, packageManager);

    // Validate arguments
    validators.failIfArgumentInvalid(projectType, 'projectType', config.projectTypes);
    validators.failIfArgumentInvalid(packageManager, 'packageManager', config.packageManagers);

    const projectFolder = path.join(config.currentDir, projectName);
    if (!fs.existsSync(projectFolder)) {
        fs.mkdirSync(projectFolder);
    }
    changeDir(projectFolder);
    init(projectType, packageManager);
}

/**
 * The same as {@link create}, but runs on the local folder as a project.
 * That is, initialize a project in the given folder, which default
 * to the root. Note that the folder must be empty in order to
 * initialize a project in the folder.
 *
 * @param {string} [projectType] The project type to initialize (Defaults to `"library"`).
 * @param {string} [packageManager] The package manager to use when downloading dependencies.
 *
 * @throws If the current folder is not empty.
 *
 * @static
 * @memberof API.Public
 */
function init(projectType, packageManager) {
    // Set defaults if not given, or register loaded options
    [projectType, packageManager] = loadOptions(projectType, packageManager);

    // Validate arguments
    validators.failIfArgumentInvalid(projectType, 'projectType', config.projectTypes);
    validators.failIfArgumentInvalid(packageManager, 'packageManager', config.packageManagers);

    const filesInFolder = fs.readdirSync(config.currentDir);
    if (filesInFolder.length !== 0) {
        throw Error('non empty folder');
    }

    copyFilesFrom(config[projectType], config[projectType].onInit, false, false);
    // runScript(config[packageManager].install);
    runScript('git', ['init', '-q']);
}

/**
 * Override the missing configuration files that are created on
 * an **init** or **create** command on the local project. This
 * is intended to be run locally, on an already created project,
 * to update the configuration. By appending **force** as a
 * subcommand, all files are updated to their latest version.
 *
 * @param {boolean} [force] Wether to force the update of files, that is,
 *      override already present files in the project with their newest version
 *      (Defaults to `false`).
 * @param {string} file The file name to update, or "all" if all should be
 *      updated (Defaults to `"all"`).
 * @param {string} [projectType] The project type to update from (Defaults to `"library"`).
 *
 * @returns {string[]} The list of updated files.
 *
 * @static
 * @memberof API.Public
 */
function update(force = false, file = 'all', projectType) {
    // Set defaults if not given, or register loaded options
    [projectType] = loadOptions(projectType, undefined);

    // Validate arguments
    validators.failIfArgumentInvalid(projectType, 'projectType', config.projectTypes);
    if (file !== 'all') {
        validators.failIfArgumentInvalid(file, 'file', config[projectType].onUpdate);
    }

    const filesToCopy = file === 'all' ? config[projectType].onUpdate : [file];
    return copyFilesFrom(config[projectType], filesToCopy, force, false);
}
/**
 * Eject all the general configuration files to the root project.
 * This includes configuration files for Typescript, Typedoc, JEST,
 * Rollup, and nps. This command is intended to be run locally. If
 * **force** is added, all previously created local files are updated
 * to their latest version. If not, only missing files are copied.
 *
 * @param {boolean} [force] Wether to force the ejection of files, that is,
 *      override already present files in the project with their newest version
 *      (Defaults to `false`).
 * @param {string} file The file name to update, or "all" if all should
 *      be updated (Defaults to `"all"`).
 * @param {string} [projectType] The project type to eject from (Defaults to `"library"`).
 *
 * @returns {string[]} The list of updated files.
 *
 * @static
 * @memberof API.Public
 */
function eject(force = false, file = 'all', projectType) {
    // Set defaults if not given, or register loaded options
    [projectType] = loadOptions(projectType, undefined);

    // Validate arguments
    validators.failIfArgumentInvalid(projectType, 'projectType', config.projectTypes);
    if (file !== 'all') {
        validators.failIfArgumentInvalid(file, 'file', config[projectType].onEject);
    }

    const filesToCopy = file === 'all' ? config[projectType].onEject : [file];
    const filesCopied = copyFilesFrom(config[projectType], filesToCopy, force, false);

    replaceInnerReferencesInFiles(
        filesCopied,
        /require\('\.\.\/\.\.\/src\/.*'\)/,
        "require('@gobstones/gobstones-scripts')"
    );
    return filesCopied;
}

/**
 * Run a command using **nps**. nps allows to run different scripts
 * configured, such as scripts for linting, prettyfing, testing,
 * generating documentation, running in development mode, and others.
 *
 * @param {string} [command] The nps command to execute
 * @param {string[]} [userArgs] The nps command additional arguments
 * @param {string} [projectType] The project type to use as configuration (Defaults to `"library"`).
 * @param {string} [packageManager] The package manager to use when running commands.
 *
 * @returns {string[]} The list of updated files.
 *
 * @static
 * @memberof API.Public
 */
function run(command, userArgs = [], projectType, packageManager) {
    // Set defaults if not given, or register loaded options
    [projectType, packageManager] = loadOptions(projectType, packageManager);

    // Validate arguments
    validators.failIfArgumentInvalid(projectType, 'projectType', config.projectTypes);
    validators.failIfArgumentInvalid(packageManager, 'packageManager', config.packageManagers);

    const runCode = (deleteTsConfig = false) => {
        runScript(
            tasks.runBin('nps'),
            ['-c', config.configurationFiles[projectType].nps, command, ...userArgs],
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
 * @static
 * @memberof API.Internal
 */
function changeDir(dir) {
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
 * @param {string} fromFolder The folder to copy from.
 * @param {string} toFolder The folder to copy to.
 * @param {string} overwrite Wether or not to overwrite the files already present.
 * @param {string} toHide A list of files to hide after copying.
 *
 * @returns {string[]} The list of copied files names, full path.
 *
 * @static
 * @memberof API.Internal
 */
function copyFilesFrom(fileDescriptors, filesToCopy, overwrite = false, dryRun = false) {
    const copied = [];

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
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Removing file: ' + fullProjectPath);
                }
            }

            // Ensure always that the file exists prior to copying
            if (fs.existsSync(fullLocalPath)) {
                if (!dryRun) {
                    fs.copySync(fullLocalPath, fullProjectPath);
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Copy file: ' + fullLocalPath + ' to ' + fullProjectPath);
                }
                copied.push(fullProjectPath);
            }
        }
    }

    // Return a list of all copied files
    return copied;
}

/**
 * Run a CLI command as a child process.
 *
 * @returns {void}
 *
 * @static
 * @memberof API.Internal
 */
function runScript(command, args = [], options = undefined, callback = undefined) {
    /* Override default options if none given */
    if (!options) {
        options = {
            shell: true,
            stdio: 'inherit',
            env: {
                ...process.env
            }
        };
    }
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
 * Replace all appearances of **reference** in the contents of all files in
 * **files** by the new string **newReference**.
 *
 * @param {string[]} files The files in which to replace
 * @param {string} reference The text to be replaced
 * @param {string} newReference The new text to replace with
 *
 * @returns {void}
 *
 * @static
 * @memberof API.Internal
 */
function replaceInnerReferencesInFiles(files, reference, newReference) {
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

function loadOptions(projectType, packageManager) {
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

module.exports = {
    create,
    init,
    eject,
    update,
    run,
    version: config.version,
    config,
    tasks
};
