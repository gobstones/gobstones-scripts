/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @namespace CLI.Helpers
 */
const process = require('process');
const figlet = require('figlet');
const chalk = require('ansi-colors');
const path = require('path');
const { project } = require('../config');

/**
 * Returns the gobstones-scripts banner that will be printed in CLI.
 *
 * @returns {string}
 *
 * @static
 * @memberof CLI.Helpers
 */
function banner() {
    const text = figlet.textSync('gobstones-scripts', {
        font: 'Standard',
        horizontalLayout: 'fitted',
        verticalLayout: 'default',
        width: 120,
        whitespaceBreak: true
    });
    return chalk.red(text);
}

/**
 * Returns the gobstones-scripts welcome message in the CLI.
 *
 * @returns {string}
 *
 * @static
 * @memberof CLI.Helpers
 */
function welcome() {
    return `Welcome to gobstones-scripts version ${project.version}`;
}

/**
 * Display a message (in console) with the given style. The style is
 * expected to be a chalk/ansi-colors style.
 *
 * @param {string} msg The message to print in the console.
 * @param {string} style The style to use when printing the message.
 *
 * @static
 * @memberof CLI.Helpers
 */
function display(msg, style) {
    if (style) {
        msg = chalk[style](msg);
    }
    /* eslint-disable-next-line no-console */
    console.log(msg);
}

/**
 * Run a function and print an error message if it fails.
 * The action is expected to be executed and produce an error with a given
 * message in some cases. errorsAndMessages matches on those inner messages
 * and outputs the associated message to the user in a style with red background.
 *
 * @param {string} action A function to be executed and catch on failure.
 * @param {Object.<string, string>} errorsAndMessages An object associating inner
 *      possible error messages as keys and messages to output to the user as values.
 *
 * @static
 * @memberof CLI.Helpers
 */
function runOrEnd(action, errorsAndMessages) {
    try {
        action();
    } catch (e) {
        for (const errorAndMessage of errorsAndMessages) {
            if (e === errorAndMessage.error) {
                display(errorAndMessage.msg, 'bgRed');
                process.exit(1);
            }
        }
        throw e;
    }
}

/**
 * Print the currently used configuration when the options contain the argument.
 *
 * @param {object} options
 * @param {boolean} [options.config] Wether to print the configuration or not.
 * @param {object} configuration The configuration to be printed
 * @param {string} projectType The project type currently in used, if any, to
 *      print additional configuration if needed.
 *
 * @static
 * @memberof CLI.Helpers
 */
function printConfigurationIfOptionGiven(options, configuration, projectType) {
    if (options.config) {
        display(
            `The detected root folder is:\n\t${chalk.blue(configuration.root)}\n\n` +
                `The detected gobstones scripts root folder is:\n\t${chalk.blue(
                    configuration.package
                )}\n`
        );
        if (configuration.options && Object.keys(configuration.options).length > 0) {
            display(`Detected a package json at the root folder. Loaded configuration includes:`);
            for (const option of Object.keys(configuration.options)) {
                display(`\t${option}: ${chalk.blue(configuration.options[option])}`);
            }
            display('');
        }
        const useAbsolute = configuration.options['absolutePaths'];
        if (projectType || (configuration.options && configuration.options.type)) {
            display(`The files to use as configuration are:`);
            for (const file in configuration.files) {
                const filePath = useAbsolute
                    ? configuration.files[file]
                    : path.relative(configuration.root, configuration.files[file]);
                display(`\t${file}: ${chalk.blue(filePath)}`);
            }
        }
        process.exit(0);
    }
}

module.exports = {
    banner,
    welcome,
    display,
    version: project.version,
    runOrEnd,
    printConfigurationIfOptionGiven
};
