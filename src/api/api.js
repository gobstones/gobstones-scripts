/**
 * The API contains a set of
 *
 * @module API
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
*/
const fs = require('fs-extra');
const path = require('path');
const tsconfigJs = require('tsconfig.js')

const internal_api = require('./internal_api');
const version = require('../config/version');
const hiddenFiles = require('../config/init-hidden-files');
const files = require("../config/files");

const configuration = internal_api.config;

/**
 * Create a new library project in a subfolder with the given name.
 * This includes creating all the required and recommended style files
 *  define a package.json, git configuration files, visual studio code
 * files, NPM configuration files, contribution guidelines, a readme,
 * a license (MIT by default), install all dependencies, and initialize
 * a git repository.
 *
 * @param {string} projectName
 */
function create(projectName) {
    projectFolder = path.join(configuration.root, projectName);
    if (!fs.existsSync(projectFolder)) {
        fs.mkdirSync(projectFolder);
    }
    internal_api.changeDir(projectFolder);
    init(projectFolder);
}

/**
 * The same as {@link create}, but runs on the local folder as a project.
 * That is, initialize a project in the given folder, which default
 * to the root. Note that the folder must be empty in order to
 * initialize a project in the folder.
 *
 * @param {string} folder
 */
function init(folder = configuration.root) {
    if (fs.readdirSync(folder).length !== 0) {
        throw 'non empty folder';
    }
    internal_api.copyFilesFrom(
        path.join(configuration.package, 'init-files'),
        folder,
        false,
        hiddenFiles);
    const runner = internal_api.getRunnerCommand();
    internal_api.runScript(runner + ' install');
    internal_api.runScript('git', ['init', '-q']);
}

/**
 * Override the missing configuration files that are created on
 *  an **init** or **create** command on the local project. This
 *  is intended to be run locally, on an already created project,
 * to update the configuration. By appending **force** as a
 * subcommand, all files are updated to their latest version.
 *
 * @param {boolean} force
 * @returns The list of updated files.
 */
function update(force = false) {
    if (
        !fs.existsSync(path.join(configuration.root, 'package.json'))
    ) {
        throw 'non root folder';
    }
    return internal_api.copyFilesFrom(
        path.join(configuration.package, 'init-files'),
        configuration.root,
        force,
        hiddenFiles
    );
}
/**
 * Eject all the general configuration files to the root project.
 * This includes configuration files for Typescript, Typedoc, JEST,
 * Rollup, and nps. This command is intended to be run locally. If
 * **force** is added, all previously created local files are updated
 * to their latest version. If not, only missing files are copied.
 *
 * @param {*} force
 * @returns The list of ejected files.
 */
function eject(force = false) {
    if (
        !fs.existsSync(path.join(configuration.root, 'package.json'))
    ) {
        throw 'non root folder';
    }
    const files = internal_api.copyFilesFrom(
        path.join(configuration.package, 'config'),
        configuration.root,
        force
    );
    internal_api.replaceInnerReferencesInFiles(files, /require\('\.\.\/src\/.*'\)/, "require('@gobstones/gobstones-scripts')");
    return files;
}
/**
 * Run a command using **nps**. nps allows to run different scripts
 * configured, such as scripts for linting, prettyfing, testing,
 * generating documentation, running in development mode, and others.
 *
 * @param {string[]} userArgs The command to run, followed by it's arguments
 */
function run(userArgs = []) {
    tsconfigJs.once({
        root: configuration.files.ts,
        addComments: 'none'
    }).then(function() {
        const runner = internal_api.getRunnerExecutorScript();
        internal_api.runScript(
            runner,
            ['nps', '-c', configuration.files.nps, ...userArgs],
            undefined,
            function() {
                fs.unlinkSync(configuration.tsConfigFile);
            }
        );
    });
}

module.exports = {
    create,
    init,
    eject,
    update,
    run,
    version,
    config: configuration,
    tools: require('../tools/tools')
};
