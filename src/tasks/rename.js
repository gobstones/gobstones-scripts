const copy = require('./copy');
const remove = require('./remove');
const { stripIndent } = require('common-tags');
const serially = require('./serially');

/**
 * Rename or move a file to a new location.
 *
 * @param {options} options
 * @param {string} options.src The file or folder to run rename on
 * @param {string} options.dest The file or folder used as new name.
 *
 * @example rename({ src: './src', dest: './dist' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function rename(options) {
    options = options || {};
    if (!options.src || !options.dest) {
        throw Error(stripIndent`"rename" requires options with the following signature:
                {
                    src: string   // The file or folder to run rename on
                    dest: string  // The file or folder used as new name.
                }`);
    }
    return serially(copy({ src: options.src, dest: options.dest }), remove({ files: options.src }));
}

module.exports = rename;
