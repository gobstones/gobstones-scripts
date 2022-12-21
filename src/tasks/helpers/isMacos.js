/**
 * Answers if the platform is macOS.
 *
 * @returns {boolean}
 *
 * @internal
 * @static
 * @memberof API.Tasks
 */
function isMacos() {
    return process && process.platform === 'darwin';
}

module.exports = isMacos;
