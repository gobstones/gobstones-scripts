/**
 * Some helper functions for the CLI program application.
 *
 * @internal
 * @namespace CLI.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const process = require('process');
const figlet = require('figlet');
const chalk = require('ansi-colors');
const path = require('path');
const config = require('../config');

/**
 * Returns the gobstones-scripts banner that will be printed in CLI.
 *
 * @returns {string}
 *
 * @static
 * @internal
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
 * @internal
 * @memberof CLI.Helpers
 */
function welcome() {
    return `Welcome to gobstones-scripts version ${config.version}`;
}

/**
 * Display a message (in console) with the given style. The style is
 * expected to be a chalk/ansi-colors style.
 *
 * @param {string} msg The message to print in the console.
 * @param {string} style The style to use when printing the message.
 *
 * @static
 * @internal
 * @memberof CLI.Helpers
 */
function display(msg, style) {
    if (style) {
        msg = chalk[style](msg);
    }
    /* eslint-disable-next-line no-console */
    console.log(msg);
}

function displayWelcomeForAction(message) {
    display(banner());
    display(welcome());
    display('');
    display(message);
    display('');
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
 * @internal
 * @memberof CLI.Helpers
 */
function runOrEnd(action, errorsAndMessages) {
    try {
        action();
    } catch (e) {
        for (const errorAndMessage of errorsAndMessages) {
            if (e.message === errorAndMessage.error) {
                display(`ERROR: ${errorAndMessage.msg}`, 'bgRed');
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
 * @internal
 * @memberof CLI.Helpers
 */
function printConfiguration() {
    display(
        `The project configuration is:\n` +
            `\tProject type:    ${chalk.blue(config.loadedOptions.type)}` +
            `\t(${config.loadedOptions.status.type})\n` +
            `\tProject manager: ${chalk.blue(config.loadedOptions.manager)}` +
            `\t\t(${config.loadedOptions.status.manager})\n`
    );
    display(
        `The detected root folder is:\n\t${chalk.blue(config.projectRootPath)}\n\n` +
            `The detected gobstones scripts root folder is:\n\t${chalk.blue(
                config.gobstonesScriptProjectPath
            )}\n`
    );

    const useAbsolute = config.useAbsolutePaths;

    const configFiles = (config.configurationFiles || [])[config.loadedOptions.type];

    display(`The files to use as configuration are:\n`);
    for (const file in configFiles) {
        const filePath = useAbsolute
            ? configFiles[file]
            : path.relative(config.projectRootPath, configFiles[file]);
        display(`\t${file}: ${chalk.blue(filePath)}`);
    }
}

module.exports = {
    banner,
    welcome,
    display,
    displayWelcomeForAction,
    runOrEnd,
    printConfiguration
};
