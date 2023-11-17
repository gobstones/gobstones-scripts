/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { getBin } from './helpers/getBin';

/**
 * Get the string representing the command to run on a bash shell
 * for a particular bin executable of a node's package. If no bin
 * is specified, the name of the package is used as executable name.
 * If the binary is not found, it will use an echo that outputs
 * the not found binary file.
 *
 * @param packageName The package that contains the executable.
 * @param binName The executable binary.
 *
 * @returns The string for the command.
 *
 * @group Main API Functions
 */
export function runBin(packageName: string, binName?: string): string {
    const element = getBin(packageName, binName);
    if (element && element.mode === 'node') {
        return `node --experimental-vm-modules ${element.binFile}`;
    }
    if (element && element.mode === 'sh') {
        return `./${element.binFile}`;
    }
    return `echo "Could not find binary ${binName || packageName}"`;
}
