const { stripIndent } = require('common-tags');
const runBin = require('./runBin');

/**
 * Rename or move a file to a new location.
 *
 * @param {options} options
 * @param {string} options.match The text or regexp to match.
 * @param {string} options.replace The text to replace with, can use patterns.
 * @param {string} options.file The file or glob on which to replace.
 * @param {string} options.folder The folder on which to start the replacement.
 * @param {boolean} options.recursive Wether or not use recursive calling
 *
 * @example replace({ match: 'foo', replace: 'bar', file: '*.txt' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tasks
 */
function replace(options) {
    options = options || {};
    if (!options.match || !options.replace || !options.file) {
        throw Error(stripIndent`"replace" requires options with the following signature:
                {
                    match: string   // The text or regexp to match.
                    replace: string // The text to replace with, can use patterns.
                    file: string    // The file or glob on which to replace.
                }`);
    }
    return (
        `${runBin('replace')} ` +
        `'${options.match}' ` +
        `'${options.replace}' ` +
        `${options.file} ` +
        `--recursive --silent`
    );
}

module.exports = replace;
