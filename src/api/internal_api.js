/**
 * This modules provides the internal api, that is helper functions
 * that ought to be called by the API.
 *
 * @internal
 * @module API
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const fs = require("fs-extra");
const process = require("process");
const child_process = require("child_process");
const path = require("path");
const files = require("../config/files");

// Variables for caching intermediate results.
let packagePath;

// General configuration
const configuration = config();


/**
 * Returns the @gobstones/gobstones-scripts folder path. That is, the path to
 * the module in the users node_modules folder.
 *
 * @returns {string}
 */
function getPackagePath() {
    if (packagePath) {
        return packagePath;
    }
    try {
        packagePath = path.join(
            path.dirname(
                require.resolve("@gobstones/gobstones-scripts/package.json")
            )
        );
    } catch (e) {
        let localPath;
        let userPath;
        let globalPath;
        try {
            localPath = child_process.execSync('npm root --location=project').toString().trim();
            userPath = child_process.execSync('npm root --location=user').toString().trim();
            globalPath = child_process.execSync('npm root --location=global').toString().trim();
        } catch {}

        let localPackagePath = path.join(
            localPath || '',
            "@gobstones",
            "gobstones-scripts"
        );
        let userPackagePath = path.join(
            userPath || '',
            "@gobstones",
            "gobstones-scripts"
        );
        let globalPackagePath = path.join(
            globalPath || '',
            "@gobstones",
            "gobstones-scripts"
        );

        if (localPath && fs.existsSync(localPackagePath)) {
            packagePath = localPackagePath;
        } else if (userPath && fs.existsSync(userPackagePath)) {
            packagePath = userPackagePath;
        } else if (globalPath && fs.existsSync(globalPackagePath)) {
            packagePath = globalPackagePath;
        } else {
            packagePath = path.join(
                process.cwd(),
                'node_modules',
                "@gobstones",
                "gobstones-scripts"
            );
        }
    }
    return packagePath;
}

/**
 * Returns the current process path.
 *
 * @returns {string}
 */
function getProcessPath() {
    return process.cwd();
}

/**
 * Change the current directory of the process to another one.
 */
function changeDir(dir) {
    return process.chdir(dir);
}

/**
 * Returns the files definitions loaded from files in
 * both the local project's defined files and the node_modules general files
 * of gobstones-scripts.
 *
 * @returns {any}
 */
function getFilesLoaded(localProjectPath, packageRootPath) {
    let configurationFiles = {};

    for (const fileConf of files) {
        let localOverride = path.join(
            localProjectPath,
            fileConf.filename + fileConf.extension
        );
        let projectDefaults = path.join(
            packageRootPath,
            "config",
            fileConf.filename + fileConf.extension
        );
        let file = fs.existsSync(localOverride)
            ? localOverride
            : projectDefaults;
        configurationFiles[fileConf.name] = file;
    }
    return configurationFiles;
}

/**
 * Run a CLI command as a child process.
 *
 * @returns {void}
 */
function runScript(command, args = [], options = undefined, callback = undefined) {
    /* Override default options if none given */
    if (!options) {
        options = {
            shell: true,
            stdio: "inherit",
            env: {
                ...process.env,
            },
        };
    }
    try {
        const cmd = child_process.spawn(command, args, options);
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
 */
function copyFilesFrom(
    fromFolder,
    toFolder = internal_api.getProcessPath(),
    overwrite = false,
    toHide = []
) {
    const copied = [];

    const filesInFromFolder = fs.readdirSync(fromFolder);
    for (const file of filesInFromFolder) {
        const localFileName = path.join(toFolder, file);
        const localFileNameIfHidden = path.join(toFolder, "." + file);
        const fileShouldBeHidden = toHide.indexOf(file) >= 0;

        if (
            // Should copy the current file?
            (!fileShouldBeHidden && !fs.existsSync(localFileName)) ||
            (fileShouldBeHidden && !fs.existsSync(localFileNameIfHidden)) ||
            overwrite
        ) {
            const fromFullyQualifiedName = path.join(fromFolder, file);
            // If the file already exists, and overwrite is needed, detele it
            if (overwrite && fs.existsSync(localFileName)) {
                fs.removeSync(localFileName);
            }
            // Copy the file as is
            fs.copySync(fromFullyQualifiedName, localFileName);
            // Rename if it should be hidden
            if (fileShouldBeHidden) {
                // And override if needed
                if (overwrite && fs.existsSync(localFileNameIfHidden)) {
                    fs.removeSync(localFileNameIfHidden);
                }
                fs.renameSync(localFileName, localFileNameIfHidden);
                // Remember the file copied for return, as hidden name
                copied.push(path.relative(toFolder, localFileNameIfHidden));
            } else {
                // Remember the file copied for return
                copied.push(path.relative(toFolder, localFileName));
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
 */
function replaceInnerReferencesInFiles(files, reference, newReference) {
    for (const file of files) {
        fs.writeFileSync(file, fs.readFileSync(file, 'utf-8').replace(reference, newReference), 'utf-8');
    }
}

/**
 * Return the runner command, that is, the name of the command to call
 * the package manager, based on the currently used package manager if called
 * through one.
 *
 * @returns {string}
 */
function getRunnerCommand() {
    const userAgent = process.env['npm_config_user_agent'];
    if (userAgent && userAgent.indexOf('pnpm') >= 0) return 'pnpm';
    if (userAgent && userAgent.indexOf('yarn') >= 0) return 'yarn';
    else return 'npm'
}

/**
 * Return the runner executor command, that is, the name of the command to call
 * the package manager executor, based on the currently used package manager if called
 * through one.
 *
 * @returns {string}
 */
function getRunnerExecutorScript() {
    const userAgent = process.env['npm_config_user_agent'];
    if (userAgent && userAgent.indexOf('pnpm') >= 0) return 'pnpm exec';
    if (userAgent && userAgent.indexOf('yarn') >= 0) return 'npx';
    else return 'npx'
}

/**
 * Returns the internal configuration of the tool, which includes all paths.
 *
 * @returns {any}
 */
function config() {
    const root = getProcessPath();
    const package = getPackagePath();
    const files = getFilesLoaded(
        root,
        package
    );
    const tsConfigFile = path.join(path.dirname(files.ts), 'tsconfig.json');
    return { root, package, tsConfigFile, files };
}

module.exports = {
    getPackagePath,
    getProcessPath,
    changeDir,
    getFilesLoaded,
    copyFilesFrom,
    runScript,
    replaceInnerReferencesInFiles,
    getRunnerCommand,
    getRunnerExecutorScript,
    config: configuration
};
