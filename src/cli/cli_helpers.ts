/**
 * Some helper functions for the CLI program application.
 *
 * @internal
 * @module CLI.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import chalk from 'ansi-colors';
import { config } from '../config';
import figlet from 'figlet';
import path from 'path';
import process from 'process';

/**
 * Returns the gobstones-scripts banner that will be printed in CLI.
 *
 * @returns The gobstones-script banner.
 *
 * @group Main API Function
 */
export function banner(): string {
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
 * @returns The welcome message.
 *
 * @group Main API Function
 */
export const welcome = (): string => `Welcome to gobstones-scripts version ${config.version}`;

/**
 * Display a message (in console) with the given style. The style is
 * expected to be a chalk/ansi-colors style.
 *
 * @param msg The message to print in the console.
 * @param style The style to use when printing the message.
 *
 * @group Main API Function
 */
export function display(msg: string, style?: string): void {
    if (style) {
        msg = chalk[style](msg);
    }
    /* eslint-disable-next-line no-console */
    console.log(msg);
}

/**
 * Display the welcome message of the gobstones-script tool
 * and immediately after, the given message.
 *
 * @param message The message to display after welcome.
 *
 * @group Main API Function
 */
export function displayWelcomeForAction(message: string): void {
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
 * @param action A function to be executed and catch on failure.
 * @param errorsAndMessages An object associating inner
 *      possible error messages as keys and messages to output to the user as values.
 *
 * @group Main API Function
 */
export function runOrEnd(
    action: () => any,
    errorsAndMessages: { error: string; msg: string }[]
): void {
    try {
        action();
    } catch (e) {
        for (const i in errorsAndMessages) {
            if (e.message === errorsAndMessages[i].error) {
                display(`ERROR: ${errorsAndMessages[i].msg}`, 'bgRed');
                process.exit(1);
            }
        }
        throw e;
    }
}

/**
 * Print the currently used configuration when the options contain the argument.
 *
 * @group Main API Function
 */
export function printConfiguration(): void {
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
        if (!configFiles[file]) continue;
        const filePath = useAbsolute
            ? configFiles[file]
            : path.relative(config.projectRootPath, configFiles[file]);
        display(`\t${file}: ${chalk.blue(filePath)}`);
    }
}

/**
 * The cli object exports all CLI helper functions in a convenient
 * object.
 *
 * @group Main API
 */
export const cli = {
    banner,
    welcome,
    display,
    displayWelcomeForAction,
    runOrEnd,
    printConfiguration
};
