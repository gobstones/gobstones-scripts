const { stripIndent } = require('common-tags');
const runBin = require('./runBin');

/**
 * Run prettier in the given files, writing the corrections to the files.
 *
 * @param {object} options
 * @param {string} options.files The files to run prettier on, may be a glob pattern
 *
 * @example prettier({ files: './src/** /*' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tasks
 */
function prettify(options) {
    options = options || {};
    if (!options.files) {
        throw Error(stripIndent`"prettier" requires options with the following signature:
                {
                    files: string   // The files to run prettier on, may be a glob pattern
                }`);
    }
    return `${runBin('prettier')} --write ${options.files}`;
}

module.exports = prettify;
