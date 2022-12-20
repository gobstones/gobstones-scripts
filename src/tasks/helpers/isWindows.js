/**
 * Answers if the platform is windows.
 *
 * @returns {boolean}
 */
function isWindows() {
    return process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE));
}

module.exports = isWindows;
