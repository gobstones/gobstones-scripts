const getBin = require('./getBin');

/**
 * Run a binary file with node.
 *
 * @param {string} packageName The package that contains the binary.
 * @param {string} binName The binary to run.
 *
 * @returns {string}
 */
function runBin(packageName, binName) {
    return `node ${getBin(packageName, binName)}`;
}

module.exports = runBin;
