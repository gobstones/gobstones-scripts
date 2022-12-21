const { stripIndent } = require('common-tags');
const runBin = require('./runBin');

/**
 * Remove (or delete) a set of files.
 *
 * @param {object} options
 * @param {string} options.files The files or folder to delete, may be a glob pattern
 *
 * @example remove({ files: './dist' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tasks
 */
function remove(options) {
    options = options || {};
    if (!options.files) {
        throw Error(stripIndent`"remove" requires options with the following signature:
                {
                    files: string   // The files or folder to delete, may be a glob pattern
                }`);
    }
    return rimraf(options.files);
}

/**
 * Gets a script that uses the rimraf binary.
 *
 * @param {string} args - args to pass to rimraf
 *   learn more from http://npm.im/rimraf
 *
 * @return {string} - the command with the rimraf binary
 *
 * @internal
 * @static
 * @memberof API.Tasks
 */
function rimraf(args) {
    return `${runBin('rimraf')} ${args}`;
}

module.exports = remove;
