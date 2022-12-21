const getBin = require('./helpers/getBin');

/**
 * Run a binary file with node.
 *
 * @param {string} packageName The package that contains the binary.
 * @param {string} binName The binary to run.
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tasks
 */
function runBin(packageName, binName) {
    const element = getBin(packageName, binName);
    if (element && element.mode === 'node') {
        return `node ${element.binFile}`;
    }
    if (element && element.mode === 'sh') {
        return `./${element.binFile}`;
    }
    return `echo "Could not find binary ${binName || packageName}"`;
}

module.exports = runBin;
