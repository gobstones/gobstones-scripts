/**
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { hasGobstonesScriptConfiguration, isGobstonesScriptLibrary } from './package-json-config';

import childProcess from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import process from 'process';

/**
 * Returns the current process path, which is supposed to
 * match to the project's root folder. If not, attempt
 * to find the root of the project.
 *
 * Note, this is only calculated once.
 *
 * @group Internal API Functions
 */
function getProjectRootPath(): string {
    let detectedRootPath: string = '';
    // The obvious choice is the the current directory
    let possibleRootPath: string = process.env['PWD'] ?? '/';

    // Attempt to find the root in current directory and above
    // until no more directories are found
    while (!detectedRootPath && possibleRootPath !== '/') {
        // A valid root is one such that there is a package.json
        // that contains the gobstones-scripts entry in config
        if (hasGobstonesScriptConfiguration(path.join(possibleRootPath, 'package.json'))) {
            // Found
            detectedRootPath = possibleRootPath;
        }
        // Go up
        possibleRootPath = path.dirname(possibleRootPath);
    }
    if (!detectedRootPath) {
        detectedRootPath = process.env['PWD'] ?? '.';
    }
    return detectedRootPath;
}

/**
 * Returns the @gobstones/gobstones-scripts folder path. That is, the path to
 * the module in the users node_modules folder.
 *
 * @group Internal API Functions
 */
function getGobstonesScriptsRootPath(): string {
    // Return if previously calculated
    let detectedScriptRootPath: string = '';

    try {
        // First attempt by using require.resolve
        // This method is not reliable and may fail
        // depending on setup
        detectedScriptRootPath = path.join(
            path.dirname(require.resolve('@gobstones/gobstones-scripts/package.json'))
        );
    } catch {
        // First, check if we are running from the project itself, that may be
        // the same folder, or a folder further up
        let possibleRootPath = getProjectRootPath();
        while (possibleRootPath !== '/') {
            if (isGobstonesScriptLibrary(path.join(possibleRootPath, 'package.json'))) {
                // Found
                detectedScriptRootPath = possibleRootPath;
                return detectedScriptRootPath;
            }
            possibleRootPath = path.dirname(possibleRootPath);
        }

        // Return the path to a particular location
        // based on the root folder string, the
        // file does not necessarily exists.
        const getRootPath = function (rootString: string): string {
            try {
                const processGettedPath = childProcess.execSync(rootString).toString().trim();
                return path.join(processGettedPath || '', '@gobstones', 'gobstones-scripts');
            } catch {
                return '';
            }
        };

        // Get the first path that actually has contents fro the
        // ones in the given list
        const getExisting = function (pathList: string[]): string | undefined {
            for (const pathElement of pathList) {
                if (pathElement && fs.existsSync(pathElement)) {
                    return pathElement;
                }
            }
            return undefined;
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
        detectedScriptRootPath = globalBasedOnToolPath || defaultPath;
    }
    // Finally, ensure that the element exists,
    // throw an unrecoverable error if not
    if (!fs.existsSync(detectedScriptRootPath)) {
        throw Error('cannot find script root');
    }
    return detectedScriptRootPath;
}

/**
 * The project's current root directory.
 *
 * @group Internal API Objects
 */
export const projectRootPath: string = getProjectRootPath();

/**
 * The detected gobstones-script project root directory.
 *
 * @group Internal API Objects
 */
export const gobstonesScriptRootPath: string = getGobstonesScriptsRootPath();

/**
 * The gobstones script project path is the gobstones-script location,
 * followed by project-types folder
 *
 * @group Internal API Objects
 */
export const gobstonesScriptProjectPath: string = path.join(
    gobstonesScriptRootPath,
    'project-types'
);
