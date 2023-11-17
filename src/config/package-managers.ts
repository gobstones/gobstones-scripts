/**
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import childProcess from 'child_process';

/**
 * Return the package manager in use based different features. First, by
 * identifying the current runner through the "npm_config_user_agent" environment
 * variable. It such variable is not set, which is common for global runs,
 * attempts to identify the runner by locating the global "gobstones-scripts"
 * command. If no match is found, defaults to npm.
 *
 * @returns The package manager in use
 *
 * @group Internal API Functions
 */
function getPackageManager(): string {
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
        return 'pnpm';
    } else if (value && value.indexOf('yarn') >= 0) {
        return 'yarn';
    } else if (value && value.indexOf('npm') >= 0) {
        return 'npm';
    }
    return undefined;
}

/**
 * Models a package manager definition and basic commands
 *
 * @group Internal API Types
 */
export interface PackageManagerDefinition {
    /**
     * The command used to install dependencies.
     */
    install: string;
    /**
     * The command used to execute a binary related to the package manager.
     */
    run: string;
    /**
     * A set of module folders that the package manager uses.
     */
    modulesFolders: string[];
    /**
     * A set of binary folders that the package manager uses.
     */
    binFolders: string[];
}

/**
 * The configuration of the `npm` package manager
 *
 * @group Internal API Objects
 */
export const npm: PackageManagerDefinition = {
    install: 'npm install',
    run: 'npx',
    modulesFolders: ['node_modules'],
    binFolders: ['node_modules/bin']
};

/**
 * The configuration of the `pnpm` package manager
 *
 * @group Internal API Objects
 */
export const pnpm: PackageManagerDefinition = {
    install: 'pnpm install',
    run: 'pnpm exec',
    modulesFolders: ['node_modules', 'node_modules/@gobstones/gobstones-scripts/node_modules'],
    binFolders: ['node_modules/bin', 'node_modules/@gobstones/gobstones-scripts/node_modules/bin']
};

/**
 * The configuration of the `yarn` package manager
 *
 * @group Internal API Objects
 */
export const yarn: PackageManagerDefinition = {
    install: 'yarn install',
    run: 'npx',
    modulesFolders: ['node_modules'],
    binFolders: ['node_modules/bin']
};

/**
 * The list of all available project manager supported by the application, indexed by name.
 *
 * @group Internal API Objects
 */
export const packageManagers: Record<string, PackageManagerDefinition> = {
    npm,
    yarn
    // , pnpm
};

/**
 * The name of the currently in use package manager, as detected by the tool.
 *
 * @group Internal API Objects
 */
export const currentPackageManager: string = getPackageManager();
