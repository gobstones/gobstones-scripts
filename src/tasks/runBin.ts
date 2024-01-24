/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { config } from '../config';

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
    // Initialize the tool. Will only do it first time getBin is called
    config.init();
    const element = config.getBinary(packageName, binName);
    if (element) return element.command;
    return `echo "Could not find binary ${binName || packageName}"`;
}
