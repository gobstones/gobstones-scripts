const { stripIndent } = require('common-tags');
const runBin = require('./runBin');

/**
 * The storybook object provides two
 * different tools, the start and build.
 *
 * @static
 * @memberof API.Tasks
 */
const storybook = {
    /**
     * Call storybook for start
     *
     * @param {object} options "storybook.start" expects options in the form
     * @param {number} options.port The port on which to run the storybook
     *
     * @example storybook.start(3000)
     *
     * @returns {string}
     *
     * @static
     * @memberof API.Tasks
     */
    start(options) {
        options = options || {};
        if (!options.port) {
            throw Error(stripIndent`"storybook.start" expects options with the following signature:
                {
                    port: number  // The port on which to run the storybook
                }`);
        }
        return `${runBin('@storybook/react', 'start-storybook')} -p ${options.port}`;
    },

    /**
     * Call storybook for build
     *
     * @param {object} options "storybook.build" expects options in the form
     * @param {string} options.dir The folder where to output the storybook
     *
     * @example storybook.start(3000)
     *
     * @returns {string}
     *
     * @static
     * @memberof API.Tasks
     */
    build(options) {
        options = options || {};
        if (!options.dir) {
            throw Error(stripIndent`"storybook.build" expects options with the following signature:
            {
                dir: str  // The port on which to run the storybook
            }`);
        }
        return `${runBin('@storybook/react', 'build-storybook')} -output-dir ${options.dir}`;
    }
};

module.exports = storybook;
