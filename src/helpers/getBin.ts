/**
 * @module Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import fs from 'fs';
import path from 'path';

import { isWindows } from './isWindows';
import { logger } from './Logger';

import { ScriptType } from '../config';
import { ExecutableScriptDefinition, PackageManagerDefinition } from '../config/config';
import { PackageJsonReader } from '../helpers/PackageJsonReader';

/**
 * Get the path to one of the bin scripts exported by a package.
 * If the bin name is different from the package name, it should
 * be given, if not given, the name of the binary is assumed to be the same
 * of that of the package.
 *
 * @param projectRootPath The currently identified project's root path.
 * @param packageManagerDefinition The definition to all available package managers.
 * @param packageName The name of the package holding the binary.
 * @param binName The name of the binary that it's intended to be retrieved.
 *
 * @returns The information for the binary execution, or undefined if no binary was found.
 *
 * @group Internal: Helpers
 */
export function getBin(
    projectRootPath: string,
    packageManagerDefinition: PackageManagerDefinition,
    packageName: string,
    binName?: string
): ExecutableScriptDefinition | undefined {
    if (!binName) {
        binName = packageName;
    }

    // Hold the result of the file found for caching it at the end.
    let result: Partial<ExecutableScriptDefinition>;

    logger.debug(`[getBin]: Attempting to find binary file "${binName}" for the package "${packageName}"`, 'magenta');

    try {
        logger.debug(`[getBin]: Trying to retrieve the package.json information through require.resolve`, 'magenta');

        // Attempt to get the bin by resolving the package.json
        const packageJsonPath = require.resolve(`${packageName}/package.json`);
        const packageRootDir = path.dirname(packageJsonPath);

        const binFile = getBinFile(packageJsonPath, packageRootDir, binName);

        result = {
            scriptFile: binFile,
            command: `node --experimental-vm-modules ${binFile}`,
            mode: 'node' as ScriptType
        };
    } catch (e) {
        logger.debug(`[getBin]: Could not detect through require.resolve`, 'magenta');

        logger.debug(`[getBin]: Attempting to find binary in binary folders of current package manager`, 'magenta');

        for (const modulesFolder of packageManagerDefinition.modulesFolders) {
            logger.debug(`[getBin]: Verifying at: ${modulesFolder}`);

            const packageNamePath = path.join(projectRootPath, modulesFolder, packageName, 'package.json');
            if (fs.existsSync(packageNamePath)) {
                logger.debug(`[getBin]: Found a package.json file at: ${packageNamePath}`, 'magenta');

                const packageRootDir = path.dirname(packageNamePath);
                const binFile = getBinFile(packageNamePath, packageRootDir, binName);

                result = {
                    scriptFile: binFile,
                    command: `node --experimental-vm-modules ${binFile}`,
                    mode: 'node' as ScriptType
                };
                break;
            } else {
                logger.debug(`[getBin]: No package with name found. Attempting to find native binary.`, 'magenta');

                const binFile = path.join(projectRootPath, modulesFolder, '.bin', binName ?? packageName);

                if (fs.existsSync(binFile)) {
                    // We found a possible binary, but in some cases
                    // this are actually node files that were not reported.
                    // We need to check the heading to see that.
                    const contents = fs.readFileSync(binFile).toString();
                    const heading = contents.length > 0 ? contents.split('\n')[0] : '';

                    if (heading.includes('node')) {
                        // If the heading mentions node, it's a javascript file.

                        logger.debug(`[getBin]: Found a javascript executable at: ${binFile}`, 'magenta');

                        result = {
                            scriptFile: binFile,
                            command: `node --experimental-vm-modules ${binFile}`,
                            mode: 'node' as ScriptType
                        };
                        break;
                    }

                    // If not, it's a binary file, but there may be
                    // many depending on the OS. Verify to see if we have
                    // a powershell, command, or sh.
                    if (isWindows()) {
                        if (fs.existsSync(`${binFile}.ps1`)) {
                            logger.debug(`[getBin]: Found a powershell executable at: ${binFile}.ps1`, 'magenta');

                            result = {
                                scriptFile: `${binFile}.ps1`,
                                command: `powershell ${binFile}.ps1`,
                                mode: 'pwsh' as ScriptType
                            };
                            break;
                        }

                        if (fs.existsSync(`${binFile}.cmd`)) {
                            logger.debug(
                                `[getBin]: Found a windows command line executable at: ${binFile}.cmd`,
                                'magenta'
                            );

                            result = {
                                scriptFile: `${binFile}.cmd`,
                                command: `${binFile}.cmd`,
                                mode: 'cmd' as ScriptType
                            };
                            break;
                        }
                    }

                    // Default to shell script
                    logger.debug(`[getBin]: Found a shell script at: ${binFile}`, 'magenta');

                    result = {
                        scriptFile: binFile,
                        command: `sh ${binFile}`,
                        mode: 'sh'
                    };
                    break;
                }
            }
        }
    }
    if (!result) {
        logger.debug(`[getBin]: Could not find a binary file`, 'magenta');
        return undefined;
    }

    return Object.assign(result, {
        packageName,
        binName
    }) as ExecutableScriptDefinition;
}

/**
 * Returns the bin file for a given package and binary file.
 *
 * @param packageJsonPath The path of the requested package's package.json
 * @param packageRootDir The path to root of the package that contains the binary directory
 * @param binName The name of the binary that we want the path of.
 *
 * @returns The path to the binary file.
 *
 * @group Internal API Functions
 */
function getBinFile(packageJsonPath: string, packageRootDir: string, binName: string): string {
    logger.debug(`[getBin] Attempting to find the binary file: ${binName} using root: ${packageJsonPath}`, 'magenta');

    const pkgJsonReader = new PackageJsonReader(packageJsonPath);
    let pkgBinDefinition: any = pkgJsonReader.getValueAt('bin');

    const binRelativeToPackgeInJson: string =
        pkgBinDefinition && typeof pkgBinDefinition === 'object'
            ? (pkgBinDefinition = pkgBinDefinition[binName])
            : pkgBinDefinition;

    logger.debug(`[getBin] Found a package.json with bin file declared as: ${binRelativeToPackgeInJson}`, 'magenta');

    const fullBinPath = path.join(packageRootDir, binRelativeToPackgeInJson);

    logger.debug(`[getBin] Path for binary found as: ${fullBinPath}`, 'magenta');

    return fullBinPath;
}
