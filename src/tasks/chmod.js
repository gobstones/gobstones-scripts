const { stripIndent } = require('common-tags');

/**
 * Perform a chmod on a file or directory, setting specific permissions on it.
 *
 * @param {object} options Options for "chmod" command:
 * @param {string} options.files The files or folder to apply permissions to, may be a glob pattern
 * @param {string} options.mod The permissions to apply
 *
 * @example chmod({  files: './dist/files', mod: '+x' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function chmod(options) {
    options = options || {};
    if (!options.files || !options.mod) {
        throw Error(stripIndent`"chmod" requires options with the following signature:
            {
                files: string   // The files or folder to apply permissions to,
                                // may be a glob pattern
                mod: string     // The permissions to apply
            }`);
    }
    return `chmod ${options.mod} ${options.files}`;
}

module.exports = chmod;
