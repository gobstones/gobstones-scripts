/**
 * @module API.Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
/**
 * The tool's version number
 *
 * This needs to be here in order to avoid reading the package.json, which
 * is not reliable between different implementations of package managers
 * and that may lead to false readings.
 *
 * @group Internal: Values
 */
export const version = '0.7.1';
