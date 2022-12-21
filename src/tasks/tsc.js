const config = require('../config');
const { stripIndent } = require('common-tags');
const runBin = require('./runBin');

/**
 * Run a specific file with tsc.
 *
 * @param {object} options
 * @param {string} options.file The files on which to run "tsc" on.
 *
 * @example tsc({file: './src/index.ts' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tasks
 */
function tsc(options) {
    options = options || {};
    if (!options.file) {
        throw Error(stripIndent`"tsc" requires options with the following signature:
                {
                    file: string   // The main file to run
                }`);
    }
    return `${runBin('tsc')}  --project ${
        config.configurationFiles[config.loadedOptions.type].tsConfigFile
    } ${options.file}`;
}

module.exports = tsc;
