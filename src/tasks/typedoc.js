const config = require('../config');
const runBin = require('./runBin');

/**
 * Run typedoc with  default configuration.
 *
 * @param {object} options
 * @param {boolean} [options.watch] Watch for changes.
 *
 * @example typedoc()
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function typedoc(options) {
    options = options || {};
    return (
        `${runBin('typedoc')} --options ${
            config.configurationFiles[config.loadedOptions.type].typedoc
        } --tsconfig ${config.configurationFiles[config.loadedOptions.type].tsConfigFile}` + (options.watch ? ` --watch ${options.watch}` : '')
    );
}

module.exports = typedoc;
