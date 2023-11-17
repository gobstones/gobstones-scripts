/**
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * The tool version number
 *
 * This needs to be here in order to avoid reading the package.json, which
 * is not reliable between different implementations of package managers
 * and that may lead to false readings.
 *
 * @group Internal API Objects
 */
export const version = '0.5.1';

/**
 * The current directory, as detected by node.
 *
 * @group Internal API Objects
 */
export const currentDir = process.env['PWD'];

/**
 * Whether or not to use absolute paths for the tool.
 * Can be override by arguments in the cli.
 *
 * @group Internal API Objects
 */
export const useAbsolutePaths = false;
