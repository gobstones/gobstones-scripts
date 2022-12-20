/**
 * Answers if the platform is macOS.
 *
 * @returns {boolean}
 */
function isMacos() {
    return process && (process.platform === 'darwin');
}

module.exports = isMacos;
