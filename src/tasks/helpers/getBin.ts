/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module Internal.Tasks
 */

import { config } from '../../config';
import fs from 'fs';
import { getPackageJsonContents } from '../../config/package-json-config';
import path from 'path';

/**
 * Represents the path to binary file, together with
 * such binary type of execution, node or shell script.
 *
 * @group Internal API Types
 */
export interface TaskBinPath {
    /**
     * The binary file path.
     */
    binFile: string;
    /**
     * The mode on which such binary file should run.
     */
    mode: 'node' | 'sh';
}

/**
 * Returns the bin file for a given package and binary file.
 *
 * @param packagePath The path of the requested package's package.json
 * @param concurrentlyDir The path to concurrently directory
 * @param binName The name of the binary that we want the path of.
 *
 * @returns The path to the binary file.
 *
 * @group Internal API Functions
 */
function getBinFile(packagePath: string, concurrentlyDir: string, binName: string): string {
    const pkgJsonContents: any = getPackageJsonContents(packagePath);
    let pkgBinDefinition: any = pkgJsonContents?.bin;

    const binRelativeToPackgeInJson: string =
        typeof pkgBinDefinition === 'object'
            ? (pkgBinDefinition = pkgBinDefinition[binName])
            : pkgBinDefinition;

    const fullBinPath = path.join(concurrentlyDir, binRelativeToPackgeInJson);
    return path.relative(process.cwd(), fullBinPath);
}

/**
 * Get the path to one of the bin scripts exported by a package.
 *
 * @param packageName The name of the npm package
 * @param binName The name of the script if different from the package.
 *
 * @returns The path for the binary relative to process.cwd(),
 *      together with the mode in which it was found, or undefined if not found.
 *
 * @group Internal API Functions
 */
export function getBin(packageName: string, binName?: string): TaskBinPath | undefined {
    try {
        // Attempt to get the bin by resolving the package.json
        const packagePath = require.resolve(`${packageName}/package.json`);
        const concurrentlyDir = path.dirname(packagePath);

        const binFile = getBinFile(packagePath, concurrentlyDir, binName ?? packageName);
        return {
            binFile,
            mode: 'node'
        };
    } catch (e) {
        if (packageName.startsWith('replace-in-files')) {
            // eslint-disable-next-line no-console
            console.log('catching');
        }
        // if not found, attempt to find by searching the bin
        // folders of the currently running tool.
        // console.log(e);
        const managerConfig = config[config.loadedOptions.manager];
        for (const modulesFolder of managerConfig.modulesFolders) {
            const packageNamePath = path.join(
                config.projectRootPath,
                modulesFolder,
                packageName,
                'package.json'
            );
            if (fs.existsSync(packageNamePath)) {
                const concurrentlyDir = path.dirname(packageNamePath);
                const binFile = getBinFile(
                    packageNamePath,
                    concurrentlyDir,
                    binName ?? packageName
                );
                return {
                    binFile,
                    mode: 'node'
                };
            } else {
                const binFile = path.join(
                    config.projectRootPath,
                    modulesFolder,
                    '.bin',
                    binName ?? packageName
                );
                if (fs.existsSync(binFile)) {
                    const contents = fs.readFileSync(binFile).toString();
                    const heading = contents.length > 0 ? contents.split('\n')[0] : '';
                    const mode = heading.includes('node') ? 'node' : 'sh';
                    return {
                        binFile,
                        mode
                    };
                }
            }
        }
        return undefined;
    }
}
