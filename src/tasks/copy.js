const { stripIndent } = require('common-tags');
const path = require('path');
const runBin = require('./runBin');
const config = require('../config');

/**
 * Copy a file or directory to a new location.
 *
 * @param {object} options "copy" expects options in the form
 * @param {string} options.src The file or folder to copy on
 * @param {string} options.dest The file or folder to copy to
 * @param {boolean} [options.isDir] Whether the copies element is a dir that
 *      should be copied recursively, defaults to false.
 *
 * @example copy({src :'./dist/index.js', dist: './dist/index.es.js'})
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tasks
 */
function copy(options) {
    options = options || {};
    if (!options.src || !options.dest) {
        throw Error(stripIndent`"rename" requires options with the following signature:
                {
                    src: string   // The file or folder to copy on
                    dest: string  // The file or folder to copy to
                    isDir: boolean // Whether the copies element is a dir
                                    // that should be copied recursively, defaults to false.
                }`);
    }
    if (options.isDir) {
        return `${runBin('copyfiles')} --up 1 ${options.src} ${options.dest}`;
    } else {
        const destFolder = path.dirname(options.dest);
        const destFile = path.basename(options.dest);
        return ncp(`${options.src} ${destFolder} --rename ${destFile}`);
    }
}

/**
 * Gets a script that uses the cpy-cli binary. cpy-cli
 * is a dependency of nps-utils, so you don't need to
 * install it yourself.
 * @param {string} args - args to pass to cpy-cli
 *   learn more from http://npm.im/cpy-cli
 * @return {string} - the command with the cpy-cli binary
 *
 * @internal
 * @static
 * @memberof API.Tasks
 */
function ncp(args) {
    return `${runBin('cpy-cli', 'cpy')} --cwd="${config.projectRootPath}" ${args}`;
}

module.exports = copy;
