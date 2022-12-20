const config = require('../config');
const ifUnix = require('./ifUnix');
const runBin = require('./runBin');

/**
 * Run tests with jest, including coverage. If any test contains an ".only" call,
 * only run that specific file (Only working in UNIXes).
 * You may add additional arguments to jest.
 *
 * @param {object} options
 * @param {boolean} [options.coverage] Use coverage configuration to run the tests.
 * @param {boolean} [options.noThreshold] Disable the default threshold for coverage.
 * @param {boolean} [options.watch] Watch for changes.
 *
 * @example jest({ coverage: true })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function jest(options) {
    options = options || {};
    const additionalArgs =
        (options.coverage ? ' --coverage ' : '') +
        (options.noThreshold ? ' --coverageThreshold "{}" ' : '') +
        (options.watch ? ' --watch' : '');
    const jestStringBase = `${runBin('jest')} --config ${
        config.configurationFiles[config.loadedOptions.type].jest
    } --rootDir ${config.projectRootPath}`;
    // Only for POSIX Based OSes, if a test file (withing test folder and ending in .test.ts)
    // contains the .only key, run exclusively that file, else, run all files as default behavior.
    // This fixes the ugly behavior of jest running all tests always, even on .only.
    // This does not work in Windows, which defaults to running all tests.
    return ifUnix(
        `if grep -l "\\.only" ${config.projectRootPath}/test/{**,.}/*.test.ts; ` +
            `then grep -l "\\.only" ${config.projectRootPath}/test/{**,.}/*.test.ts | xargs ` +
            jestStringBase +
            '; ' +
            'else ' +
            jestStringBase +
            additionalArgs +
            '; ' +
            'fi',
        jestStringBase + ' --coverage' + additionalArgs
    );
}

module.exports = jest;
