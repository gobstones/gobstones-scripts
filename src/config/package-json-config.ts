/**
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import fs from 'fs';

/**
 * Models an object that represents the available options
 * for configuration into a package.json for gobstones-scripts
 *
 * @group Internal API Types
 */
export interface PackageJsonConfigOptions {
    /** The project type */
    type: string;
    /** The package manager */
    manager: string;
}
/**
 * Return the contents of a package.json file in a given location.
 * If the file does not exists, returns an object whose sole
 * property is "failed" and is set to true.
 *
 * @param packageJsonLocation The location of the packageJSON that wants to be writtern
 *
 * @group Internal API Functions
 */
export function getPackageJsonContents(packageJsonLocation: string): any {
    try {
        const contents = fs.readFileSync(packageJsonLocation);
        return JSON.parse(contents.toString());
    } catch {
        return { failed: true };
    }
}

/**
 * Answers wether the given package.json location exists and it's name
 * matches the one of the gobstones-script library.
 *
 * @param packageJsonLocation The package.json location to check.
 *
 * @returns true if it has gobstones-script name, false otherwise.
 *
 * @group Internal API Functions
 */
export function isGobstonesScriptLibrary(packageJsonLocation): boolean {
    const pkgJson = getPackageJsonContents(packageJsonLocation);
    return !pkgJson.failed && pkgJson['name'] === '@gobstones/gobstones-scripts';
}

/**
 * Answers wether the given package.json location exists and contains
 * a configuration for gobstones-scripts.
 *
 * @param packageJsonLocation The package.json location to check.
 *
 * @returns true if it has gobstones-script configuration, false otherwise.
 *
 * @group Internal API Functions
 */
export function hasGobstonesScriptConfiguration(packageJsonLocation): boolean {
    const pkgJson = getPackageJsonContents(packageJsonLocation);
    return !pkgJson.failed && !!pkgJson['config'] && !!pkgJson['config']['gobstones-scripts'];
}

/**
 * Answers the given package.json a configuration for gobstones-scripts,
 * or undefined if the package.json given does not exist or does
 * not contain a gobstones-script configuration.
 *
 * @param packageJsonLocation The package.json location to check.
 *
 * @returns An object with the configuration or undefined
 *
 * @group Internal API Functions
 */
export function getGobstonesScriptConfiguration(
    packageJsonLocation
): PackageJsonConfigOptions | undefined {
    const pkgJson = getPackageJsonContents(packageJsonLocation);
    if (!pkgJson.failed && !!pkgJson['config'] && !!pkgJson['config']['gobstones-scripts']) {
        return pkgJson['config']['gobstones-scripts'];
    } else {
        return undefined;
    }
}
