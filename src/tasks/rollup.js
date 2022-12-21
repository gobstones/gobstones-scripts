const config = require('../config');
const runBin = require('./runBin');

/**
 * Run rollup with default configuration.
 *
 * @param {{watch: ?string}} options
 * @param {string} [options.watch] The files to watch for changes, if desired.
 *
 * @example rollup()
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tasks
 */
function rollup(options) {
    options = options || {};
    return (
        `${runBin('rollup')} --config ${
            config.configurationFiles[config.loadedOptions.type].rollup
        }` +
        (options.watch ? ` --watch ${options.watch}` : '') +
        ' --bundleConfigAsCjs'
    );
}

module.exports = rollup;
