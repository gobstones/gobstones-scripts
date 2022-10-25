/**
 * This modules provides the internal api, that is helper functions
 * that ought to be called by the API.
 *
 * @internal
 * @namespace API.Internal
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const fs = require('fs-extra');
const process = require('process');
const childProcess = require('child_process');
const path = require('path');

const { files } = require('../config');

// Variables for caching intermediate results.
let gobstonesScriptRootPath;
let projectRootPath;
let packageManager;
let configuration;

/**
 * Returns the @gobstones/gobstones-scripts folder path. That is, the path to
 * the module in the users node_modules folder.
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Internal
 */
function getGobstonesScriptsRootPath() {
    if (gobstonesScriptRootPath) {
        return gobstonesScriptRootPath;
    }
    try {
        gobstonesScriptRootPath = path.join(
            path.dirname(require.resolve('@gobstones/gobstones-scripts/package.json'))
        );
    } catch (e) {
        let npmLocalPath;
        let npmUserPath;
        let npmGlobalPath;
        let pnpmLocalPath;
        let pnpmGlobalPath;
        try {
            npmLocalPath = childProcess.execSync('npm root --location=project').toString().trim();
            npmUserPath = childProcess.execSync('npm root --location=user').toString().trim();
            npmGlobalPath = childProcess.execSync('npm root --location=global').toString().trim();
            pnpmLocalPath = childProcess.execSync('pnpm root').toString().trim();
            pnpmGlobalPath = childProcess.execSync('pnpm root --global').toString().trim();
        } catch {
            // nothing to do
        }

        const npmLocalPackagePath = path.join(npmLocalPath || '', '@gobstones', 'gobstones-scripts');
        const npmUserPackagePath = path.join(npmUserPath || '', '@gobstones', 'gobstones-scripts');
        const npmGlobalPackagePath = path.join(npmGlobalPath || '', '@gobstones', 'gobstones-scripts');
        const pnpmLocalPackagePath = path.join(pnpmLocalPath || '', '@gobstones', 'gobstones-scripts');
        const pnpmGlobalPackagePath = path.join(pnpmGlobalPath || '', '@gobstones', 'gobstones-scripts');

        if (npmLocalPath && fs.existsSync(npmLocalPackagePath)) {
            gobstonesScriptRootPath = npmLocalPackagePath;
        } else if (npmUserPath && fs.existsSync(npmUserPackagePath)) {
            gobstonesScriptRootPath = npmUserPackagePath;
        } else if (npmGlobalPath && fs.existsSync(npmGlobalPackagePath)) {
            gobstonesScriptRootPath = npmGlobalPackagePath;
        } else if (pnpmLocalPath && fs.existsSync(pnpmLocalPackagePath)) {
            gobstonesScriptRootPath = pnpmLocalPackagePath;
        } else if (pnpmGlobalPath && fs.existsSync(pnpmGlobalPackagePath)) {
            gobstonesScriptRootPath = pnpmGlobalPackagePath;
        } else {
            gobstonesScriptRootPath = path.join(
                process.cwd(),
                'node_modules',
                '@gobstones',
                'gobstones-scripts'
            );
        }
    }
    if (!fs.existsSync(gobstonesScriptRootPath)) {
        throw Error('cannot find script root');
    }
    return gobstonesScriptRootPath;
}

/**
 * Returns the current process path.
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Internal
 */
function getProjectRootPath() {
    if (projectRootPath) return projectRootPath;
    projectRootPath = process.env['PWD'];
    if (process.cwd() !== projectRootPath);
    {
        process.chdir(projectRootPath);
    }
    return projectRootPath;
}

/**
 * Change the current directory of the process to another one.
 *
 * @static
 * @memberof API.Internal
 */
function changeDir(dir, projectType) {
    if (!configuration) {
        configuration.config(projectType);
    }
    process.chdir(dir);
    configuration.root = dir;
    return dir;
}

/**
 * Returns the files definitions loaded from files in
 * both the local project's defined files and the node_modules general files
 * of gobstones-scripts.
 *
 * @returns {any}
 *
 * @static
 * @memberof API.Internal
 */
function getFilesLoaded(projecType, projectPath, gobstonesScriptsPath) {
    const configurationFiles = {};

    for (const fileName in files.eject) {
        const fileUri = files.eject[fileName].files[0];
        const isCommon = files.eject[fileName].isCommon;
        const rootUriForFile = path.join(projectPath, fileUri);
        const gbScriptUriForFile = path.join(
            gobstonesScriptsPath,
            'project-types',
            isCommon ? 'common' : projecType,
            fileUri
        );
        const file = fs.existsSync(rootUriForFile) ? rootUriForFile : gbScriptUriForFile;
        configurationFiles[fileName] = file;
    }
    return configurationFiles;
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
function copyFilesFrom(fileDescriptors, projectType, overwrite = false) {
    const copied = [];

    if (!configuration) {
        configuration = config(projectType);
    }

    for (const fileName in fileDescriptors) {
        const fileDescriptor = fileDescriptors[fileName];
        const gbsScriptsFolder = path.join(
            configuration.packageRoot,
            'project-types',
            fileDescriptor.isCommon ? 'common' : projectType
        );
        const sources = (fileDescriptor.folders || fileDescriptor.files).map((e) =>
            path.join(gbsScriptsFolder, e)
        );
        // Note that if no renames are present, then the full name is
        // present in the following variable.
        const destinations = (
            fileDescriptor.renames ||
            fileDescriptor.folders ||
            fileDescriptor.files
        ).map((e) => path.join(configuration.root, e));

        if (overwrite) {
            // If files should be overwritten, then all root files
            // should be deleted prior to copying.
            for (const destRenamed of destinations) {
                if (fs.existsSync(destRenamed)) {
                    fs.removeSync(destRenamed);
                }
            }
        }

        for (let i = 0; i < sources.length; i++) {
            const nextSrc = sources[i];
            const nextDest = destinations[i];
            if (fs.existsSync(nextSrc)) {
                fs.copySync(nextSrc, nextDest);
                copied.push(nextDest);
            }
        }
    }
    return copied;
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
        fs.writeFileSync(
            file,
            fs.readFileSync(file, 'utf-8').replace(reference, newReference),
            'utf-8'
        );
    }
}

/**
 * Return the package manager in use based different features. First, by
 * identifying the current runner through the "npm_config_user_agent" environment
 * variable. It such variable is not set, which is common for global runs,
 * attempts to identify the runner by locating the global "gobstones-scripts"
 * command. If no match is found, defaults to npm.
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Internal
 */
function getPackageManager() {
    if (packageManager) return packageManager;
    if (configuration) {
        config();
    }
    const userAgent = process.env['npm_config_user_agent'];
    let whichFile;
    if (!userAgent) {
        try {
            whichFile = childProcess
                .spawnSync('which gobstones-scripts', { shell: true })
                .output.toString();
        } catch (e) {
            // Nothing to do
        }
    }
    const value = userAgent || whichFile;
    if (value && value.indexOf('pnpm') >= 0) {
        packageManager = 'pnpm';
    } else if (value && value.indexOf('yarn') >= 0) {
        packageManager = 'yarn';
    } else {
        packageManager = 'npm';
    }
    return packageManager;
}

/**
 * Return the runner command, that is, the name of the command to call
 * the package manager, based on the currently used package manager if called
 * through one.
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Internal
 */
function getPackageManagerInstallCommand(packageManager) {
    return packageManager + ' install';
}

/**
 * Return the runner executor command, that is, the name of the command to call
 * the package manager executor, based on the currently used package manager if called
 * through one.
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Internal
 */
function getPackageManagerExecuteCommand(packageManager) {
    if (packageManager === 'pnpm') return 'pnpm exec';
    else return 'npx';
}

function optionsFormPackageJson(root) {
    if (fs.existsSync(path.join(root, 'package.json'))) {
        const contents = fs.readFileSync(path.join(root, 'package.json'));
        const values = JSON.parse(contents.toString());
        if (values && values['gobstones-scripts']) {
            return values['gobstones-scripts'];
        }
    }
    return {};
}

/**
 * Returns the internal configuration of the tool, which includes all paths.
 *
 * @returns {any}
 *
 * @static
 * @memberof API.Internal
 */
function config(projectType) {
    if (configuration && configuration.projectType === projectType) return configuration;
    const root = getProjectRootPath();
    const packageRoot = getGobstonesScriptsRootPath();
    const options = optionsFormPackageJson(root);
    const files = getFilesLoaded(projectType || options.type || 'library', root, packageRoot);
    const tsConfigFile = path.join(path.dirname(files.ts), 'tsconfig.json');
    configuration = { projectType, root, packageRoot, tsConfigFile, options, files };
    return configuration;
}

module.exports = {
    getGobstonesScriptsRootPath,
    getProjectRootPath,
    changeDir,
    getFilesLoaded,
    copyFilesFrom,
    runScript,
    replaceInnerReferencesInFiles,
    getPackageManager,
    getPackageManagerInstallCommand,
    getPackageManagerExecuteCommand,
    config
};
