/**
 * This module contains the configuration pertaining the data
 * of the tool, including version number and others, current directory
 * and wether or not the tool will use absolute paths.
 *
 * Most of this are constants and cannot be changed at runtime.
 *
 * @internal
 * @namespace Config.Tool
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * The tool version number
 *
 * This needs to be here in order to avoid reading the package.json, which
 * is not reliable between different implementations of package managers
 * and that may lead to false readings.
 *
 * @static
 * @internal
 * @memberof Config.Tool
 */
const version = '0.4.0-alpha8';

module.exports = {
    version,
    currentDir: process.env['PWD'],
    useAbsolutePaths: false
};
