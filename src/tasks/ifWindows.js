const isWindows = require('./helpers/isWindows');

/**
 * Takes two scripts and returns the first if the
 * current environment is windows, and the second
 * if the current environment is not windows
 *
 * @param {string} script - the script to use for windows
 * @param {string} altScript - the script to use for non-windows
 *
 * @return {string} - the command to run
 *
 * @static
 * @memberof API.Tasks
 */
function ifWindows(script, altScript) {
    return isWindows() ? script : altScript;
}

module.exports = ifWindows;
