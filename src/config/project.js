/**
 * The available project types the application support.
 *
 * @internal
 * @namespace Config.Project
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * The name of all available project manager supported by the application.
 *
 * @type {object}
 *
 * @internal
 * @static
 * @memberof Config.Project
 */
const types = ['library', 'cli-library', 'react-library'];

/**
 * The name of all available project manager supported by the application.
 *
 * @type {object}
 *
 * @internal
 * @static
 * @memberof Config.Project
 */
const managers = ['npm', 'yarn', 'pnpm'];

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
const version = '0.2.4';

module.exports = {
    project: {
        types,
        managers,
        version
    }
};
