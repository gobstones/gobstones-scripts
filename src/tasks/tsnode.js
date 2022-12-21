const config = require('../config');
const runBin = require('./runBin');
const { stripIndent } = require('common-tags');

/**
 * Run a specific file with ts-node.
 *
 * @param {object} options
 * @param {string} options.file The file to run with "ts-node".
 * @param {string} [options.watch] The files to watch for changes, if desired.
 *
 * @example tsNode({file: './src/index.ts', watch: false })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tasks
 */
function tsNode(options) {
    options = options || {};
    if (!options.file) {
        throw Error(stripIndent`"tsNode" requires options with the following signature:
                {
                    file: string    // The main file to run
                    watch?: string  // Watch a set of files for changes
                }`);
    }
    return (
        `${runBin('ts-node')} ${options.file} --project ${
            config.configurationFiles[config.loadedOptions.type].tsConfigFile
        }` + (options.watch ? ` --watch ${options.watch}` : ' --ignore-watch')
    );
}
module.exports = tsNode;
