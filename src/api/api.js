/**
 * The API contains a set of
 *
 * @namespace API.Public
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const fs = require('fs-extra');
const path = require('path');
const tsconfigJs = require('tsconfig.js');

const internalAPI = require('./internal_api');
const validators = require('./validators');

const { files, project } = require('../config');

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
function create(
    projectName,
    projectType = internalAPI.config().options.type || 'library',
    packageManager = internalAPI.config().options.manager || internalAPI.getPackageManager()
) {
    validators.failIfArgumentInvalid(projectType, 'projectType', project.types);
    validators.failIfArgumentInvalid(packageManager, 'packageManager', project.managers);
    const configuration = internalAPI.config(projectType);
    const projectFolder = path.join(configuration.root, projectName);
    if (!fs.existsSync(projectFolder)) {
        fs.mkdirSync(projectFolder);
    }
    internalAPI.changeDir(projectFolder);
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
function init(
    projectType = internalAPI.config().options.type || 'library',
    packageManager = internalAPI.config().options.manager || internalAPI.getPackageManager()
) {
    validators.failIfArgumentInvalid(projectType, 'projectType', project.types);
    validators.failIfArgumentInvalid(packageManager, 'packageManager', project.managers);
    const configuration = internalAPI.config(projectType);
    const filesInFolder = fs.readdirSync(configuration.root);
    if (filesInFolder.length !== 0) {
        throw Error('non empty folder');
    }
    internalAPI.copyFilesFrom(files.init, projectType, false);
    internalAPI.copyFilesFrom(files.update, projectType, false);
    const installScript = internalAPI.getPackageManagerInstallCommand(packageManager);
    internalAPI.runScript(installScript);
    internalAPI.runScript('git', ['init', '-q']);
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
function update(
    force = false,
    file = 'all',
    projectType = internalAPI.config().options.type || 'library'
) {
    if (file !== 'all') validators.failIfArgumentInvalid(file, 'file', Object.keys(files.update));
    validators.failIfArgumentInvalid(projectType, 'projectType', project.types);
    const configuration = internalAPI.config(projectType);
    if (!fs.existsSync(path.join(configuration.root, 'package.json'))) {
        throw Error('non root folder');
    }
    const filesToCopy = file === 'all' ? files.update : [files.update[file]];
    return internalAPI.copyFilesFrom(filesToCopy, projectType, force);
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
function eject(
    force = false,
    file = 'all',
    projectType = internalAPI.config().options.type || 'library'
) {
    if (file !== 'all') validators.failIfArgumentInvalid(file, 'file', Object.keys(files.eject));
    validators.failIfArgumentInvalid(projectType, 'projectType', project.types);
    const configuration = internalAPI.config(projectType);
    if (!fs.existsSync(path.join(configuration.root, 'package.json'))) {
        throw Error('non root folder');
    }
    const filesToCopy = file === 'all' ? files.eject : [files.eject[file]];
    const filesCopied = internalAPI.copyFilesFrom(filesToCopy, projectType, force);
    internalAPI.replaceInnerReferencesInFiles(
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
function run(
    command,
    userArgs = [],
    projectType = internalAPI.config().options.type || 'library',
    packageManager = internalAPI.config().options.manager || internalAPI.getPackageManager()
) {
    validators.failIfArgumentInvalid(projectType, 'projectType', project.types);
    validators.failIfArgumentInvalid(packageManager, 'packageManager', project.managers);
    const configuration = internalAPI.config(projectType);

    const runCode = (deleteTsConfig = false) => {
        const runner = internalAPI.getPackageManagerExecuteCommand(packageManager);
        internalAPI.runScript(
            runner,
            ['nps', '-c', configuration.files.nps, command, ...userArgs],
            undefined,
            function () {
                if (deleteTsConfig) {
                    fs.unlinkSync(configuration.tsConfigFile);
                }
            }
        );
    };

    const rootConfigTS = path.join(configuration.root, path.basename(configuration.tsConfigFile));
    if (fs.existsSync(rootConfigTS)) {
        configuration.tsConfigFile = rootConfigTS;
        runCode();
    } else {
        tsconfigJs
            .once({
                root: configuration.files.ts,
                addComments: 'none'
            })
            .then(function () {
                runCode(true);
            });
    }
}

module.exports = {
    create,
    init,
    eject,
    update,
    run,
    version: project.version,
    config: internalAPI.config,
    tools: require('./tools')
};
