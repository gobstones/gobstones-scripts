const { stripIndent } = require('common-tags');
const runBin = require('./runBin');

/**
 * Run eslint in a set of files. You might pass `true` as a second argument
 * in order to fix default problems.
 *
 * @param {object} options
 * @param {string} options.files The files to lint, may be a glob pattern.
 * @param {boolean} [options.fix] Wether to fix the encountered error when possible.
 * @param {string} [options.extensions] The extensions to consider (comma separated list).
 *
 * @example eslint({files: './src/** /*' })
 * @example eslint({ files: './src/** /*', fix: true })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function eslint(options) {
    options = options || {};
    if (!options.files) {
        throw Error(stripIndent`"eslint" requires options with the following signature:
                {
                    files: string   // The files to lint, may be a glob pattern
                    fix?: boolean  //Wether to fix the encountered error when possible
                    extensions?: string // The extensions to consider
                }`);
    }
    options.extensions = options.extensions || 'js,jsx,ts,tsx';
    return (
        `${runBin('eslint')} ${options.files} --format stylish --ext ${
            options.extensions
        } --color` + (options.fix ? ' --fix' : '')
    );
}

module.exports = eslint;
