/**
 * The tool version number
 *
 * This needs to be here in order to avoid reading the package.json, which
 * is not reliable between different implementations of package managers
 * and that may lead to false readings.
 *
 * @internal
 * @static
 * @memberof Config.Project
 */
const version = '0.4.0-alpha1';

module.exports = {
    version,
    currentDir: process.env['PWD'],
    useAbsolutePaths: false
};
