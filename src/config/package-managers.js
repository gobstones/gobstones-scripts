/**
 * This module contains the configuration pertaining
 * the different package managers the tool supports.
 *
 * @internal
 * @namespace Config.PackageManager
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const childProcess = require('child_process');

/**
 * The name of all available project manager supported by the application.
 *
 * @type {object}
 *
 * @internal
 * @static
 * @memberof Config.PackageManager
 */
const packageManagers = ['npm', 'yarn'];

/**
 * The configuration of the `npm` package manager
 *
 * @type {object}
 *
 * @internal
 * @static
 * @memberof Config.PackageManager
 */
const npm = {
    install: 'npm install',
    run: 'npx',
    modulesFolders: ['node_modules'],
    binFolders: ['node_modules/bin']
};

/**
 * The configuration of the `pnpm` package manager
 *
 * @type {object}
 *
 * @internal
 * @static
 * @memberof Config.PackageManager
 */
const pnpm = {
    install: 'pnpm install',
    run: 'pnpm exec',
    modulesFolders: ['node_modules', 'node_modules/@gobstones/gobstones-scripts/node_modules'],
    binFolders: ['node_modules/bin', 'node_modules/@gobstones/gobstones-scripts/node_modules/bin']
};

/**
 * The configuration of the `yarn` package manager
 *
 * @type {object}
 *
 * @internal
 * @static
 * @memberof Config.PackageManager
 */
const yarn = {
    install: 'yarn install',
    run: 'npx',
    modulesFolders: ['node_modules'],
    binFolders: ['node_modules/bin']
};

let currentPackageManager;

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
 * @internal
 * @memberof Config.PackageManager
 */
function getPackageManager() {
    if (currentPackageManager) return currentPackageManager;
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
        currentPackageManager = 'pnpm';
    } else if (value && value.indexOf('yarn') >= 0) {
        currentPackageManager = 'yarn';
    } else if (value && value.indexOf('npm') >= 0) {
        currentPackageManager = 'npm';
    }
    return currentPackageManager;
}
getPackageManager();

module.exports = {
    packageManagers,
    npm,
    pnpm,
    yarn,
    currentPackageManager
};
