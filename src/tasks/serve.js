const runBin = require('./runBin');

/**
 * Serve a specific folder as a static server.
 *
 * @param {string} directory The directory to serve.
 *
 * @example serve('./coverage')
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function serve(directory) {
    if (!directory) {
        throw new Error('"serve" expect a directory name as argument');
    }
    return `${runBin('serve')} ${directory}`;
}

module.exports = serve;
