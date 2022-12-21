/**
 * This module will autodetect the configurations pertaining
 * the folders used by the tool, both the project's main folder
 * and the tool's folder.
 *
 * @internal
 * @namespace Config.Paths
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const fs = require('fs-extra');
const process = require('process');
const childProcess = require('child_process');
const path = require('path');

let projectRootPath;
let gobstonesScriptRootPath;

/**
 * Returns the current process path, which is supposed to
 * match to the project's root folder. If not, attempt
 * to find the root of the project.
 *
 * Note, this is only calculated once.
 *
 * @returns {string}
 *
 * @static
 * @internal
 * @memberof Config.Paths
 */
function getProjectRootPath() {
    // Return if previously calculated
    if (projectRootPath) {
        return projectRootPath;
    }

    // The obvious choice is the the current directory
    let possibleRootPath = process.env['PWD'];

    // Attempt to find the root in current directory and above
    // until no more directories are found
    while (!projectRootPath && possibleRootPath !== '/') {
        // A valid root is one such that there is a package.json
        // that contains the gobstones-scripts entry
        if (fs.existsSync(path.join(possibleRootPath, 'package.json'))) {
            const contents = fs.readFileSync(path.join(possibleRootPath, 'package.json'));
            const values = JSON.parse(contents.toString());
            if (values['gobstones-scripts']) {
                // Found
                projectRootPath = possibleRootPath;
            }
        }
        // Go up
        possibleRootPath = path.dirname(possibleRootPath);
    }
    if (!projectRootPath) {
        projectRootPath = process.env['PWD'];
    }
    return projectRootPath;
}
getProjectRootPath();

/**
 * Returns the @gobstones/gobstones-scripts folder path. That is, the path to
 * the module in the users node_modules folder.
 *
 * @returns {string}
 *
 * @static
 * @internal
 * @memberof Config.Paths
 */
function getGobstonesScriptsRootPath() {
    // Return if previously calculated
    if (gobstonesScriptRootPath) {
        return gobstonesScriptRootPath;
    }
    try {
        // First attempt by using require.resolve
        // This method is not reliable and may fail
        // depending on setup
        gobstonesScriptRootPath = path.join(
            path.dirname(require.resolve('@gobstones/gobstones-scripts/package.json'))
        );
    } catch (e) {
        // First, check if we are running from the project itself, that may be
        // the same folder, or a folder further up
        let possibleRootPath = getProjectRootPath();
        while (possibleRootPath !== '/') {
            if (fs.existsSync(path.join(possibleRootPath, 'package.json'))) {
                const contents = fs.readFileSync(path.join(possibleRootPath, 'package.json'));
                const values = JSON.parse(contents.toString());
                if (values.name === '@gobstones/gobstones-scripts') {
                    // Found
                    gobstonesScriptRootPath = possibleRootPath;
                    return gobstonesScriptRootPath;
                }
            }
            possibleRootPath = path.dirname(possibleRootPath);
        }

        // Now try other means
        const getRootPath = function (rootString) {
            try {
                const processGettedPath = childProcess.execSync(rootString).toString().trim();
                return path.join(processGettedPath || '', '@gobstones', 'gobstones-scripts');
            } catch (e) {
                return false;
            }
        };

        const getExisting = function (pathList) {
            for (const pathElement of pathList) {
                if (pathElement && fs.existsSync(pathElement)) {
                    return pathElement;
                }
            }
            return false;
        };

        // If running globally, try to find a configuration
        // of the particular tool. That means, get the directory of
        // tool installed (which may fail if not installed), and
        // ensure the directory exists.
        const globalBasedOnToolPath = getExisting([
            getRootPath('npm root --location=project'),
            getRootPath('npm root --location=user'),
            getRootPath('npm root --location=global'),
            getRootPath('pnpm root'),
            getRootPath('pnpm root --global')
        ]);

        // Also get a default path, which requires
        // the project root path, and attempt to find
        // the project under node_modules.
        const defaultPath = path.join(
            getProjectRootPath(),
            'node_modules',
            '@gobstones',
            'gobstones-scripts'
        );

        // Retain the global found, or the default
        gobstonesScriptRootPath = globalBasedOnToolPath || defaultPath;
    }
    // Finally, ensure that the element exists,
    // throw an unrecoverable error if not
    if (!fs.existsSync(gobstonesScriptRootPath)) {
        throw Error('cannot find script root');
    }
    return gobstonesScriptRootPath;
}
getGobstonesScriptsRootPath();

module.exports = {
    projectRootPath,
    gobstonesScriptRootPath,
    gobstonesScriptProjectPath: path.join(gobstonesScriptRootPath, 'project-types')
};
