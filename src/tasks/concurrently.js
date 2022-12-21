const shellEscape = require('./shellEscape');
const runBin = require('./runBin');

/**
 * A concurrent script object
 * @typedef {Object|string} ConcurrentScript
 * @property {string} script - the command to run
 * @property {string} color - the color to use
 *   (see concurrently's docs for valid values)
 * @internal
 * @static
 * @memberof API.Tasks
 */
/**
 * An object of concurrent script objects
 * @typedef {Object.<ConcurrentScript>} ConcurrentScripts
 * @internal
 * @static
 * @memberof API.Tasks
 */
/**
 * Generates a command that uses `concurrently` to run
 * scripts concurrently. Adds a few flags to make it
 * behave as you probably want (like --kill-others-on-fail).
 * In addition, it adds color and labels where the color
 * can be specified or is defaulted and the label is based
 * on the key for the script.
 * @param {ConcurrentScripts} scripts - the scripts to run
 *   note: this function filters out falsy values :)
 * @example
 * // returns a bit of a long script that can vary slightly
 * // based on your environment... :)
 * concurrent({
 *   lint: {
 *     script: 'eslint .',
 *     color: 'bgGreen.white.dim',
 *   },
 *   test: 'jest',
 *   build: {
 *     script: 'webpack'
 *   }
 * })
 * @return {string} - the command to run
 *
 * @static
 * @memberof API.Tasks
 */
function concurrently(...scripts) {
    if (scripts.length === 1 && typeof scripts[0] === 'object' && !Array.isArray(scripts[0])) {
        scripts = scripts[0];
    }
    const Object$keys$reduce = Object.keys(scripts).reduce(reduceScripts, {
        colors: [],
        scripts: [],
        names: []
    });
    const colors = Object$keys$reduce.colors;
    const quotedScripts = Object$keys$reduce.scripts;
    const names = Object$keys$reduce.names;

    const flags = [
        '--kill-others-on-fail',
        `--prefix-colors "${colors.join(',')}"`,
        '--prefix "[{name}]"',
        `--names "${names.join(',')}"`,
        shellEscape(quotedScripts)
    ];
    const concurrently = runBin('concurrently', 'concurrently');
    return `${concurrently} ${flags.join(' ')}`;

    function reduceScripts(accumulator, scriptName, index) {
        let scriptObj = scripts[scriptName];
        if (!scriptObj) {
            return accumulator;
        } else if (typeof scriptObj === 'string') {
            scriptObj = { script: scriptObj };
        }
        const defaultColors = [
            'bgBlue.bold',
            'bgMagenta.bold',
            'bgGreen.bold',
            'bgBlack.bold',
            'bgCyan.bold',
            'bgRed.bold',
            'bgWhite.bold',
            'bgYellow.bold'
        ];
        const script = scriptObj.script;
        const scriptObj$color = scriptObj.color;
        const color =
            scriptObj$color === undefined
                ? defaultColors[index % defaultColors.length]
                : scriptObj$color;

        if (!script) {
            return accumulator;
        }
        accumulator.names.push(scriptName);
        accumulator.colors.push(color);
        accumulator.scripts.push(script);
        return accumulator;
    }
}

module.exports = concurrently;
