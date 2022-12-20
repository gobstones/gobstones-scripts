const isWindows = require('./helpers/isWindows');

/**
 * Simply calls ifWindows(altScript, script)
 * @param {string} script - the script to use for non-windows
 * @param {string} altScript - the script to use for windows
 * @return {string} - the command to run
 */
function ifUnix(script, altScript) {
    return isWindows() ? altScript : script;
}

module.exports = ifUnix;
