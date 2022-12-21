const config = require('../config');
const runBin = require('./runBin');

/**
 * Call another nps action.
 *
 * @param {string} action The nps action to run.
 *
 * @example nps('clean.dist')
 * @example nps('build')
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tasks
 */
function nps(action) {
    if (!action) {
        throw new Error('"nps" expect a defined nps action as argument');
    }
    return `${runBin('nps')} -c ${
        config.configurationFiles[config.loadedOptions.type].nps
    } ${action}`;
}

module.exports = nps;
