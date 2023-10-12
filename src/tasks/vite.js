const runBin = require('./runBin');

function runVite(mode) {
    return `${runBin('vite')} ${mode}`;
}

const vite = {
    /**
     * Run vite's dev server with default configuration.
     *
     * @param {{watch: ?string}} options
     * @param {string} [options.watch] The files to watch for changes, if desired.
     *
     * @example vite.dev()
     *
     * @returns {string}
     *
     * @static
     * @memberof API.Tasks
     */
    dev(options) {
        return runVite('', options);
    },

    build(options) {
        return runVite('build', options);
    },

    preview(options) {
        return runVite('preview', options);
    }
};

module.exports = vite;
