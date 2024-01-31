/**
 * @module Internal.CLI
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import fs from 'fs';
import path from 'path';
import process from 'process';

import colors from 'ansi-colors';
import figlet from 'figlet';

import { config } from '../config';
import { logger } from '../helpers/Logger';

/**
 * Returns the gobstones-scripts banner that will be printed in CLI.
 *
 * @returns The gobstones-script banner.
 *
 * @internal
 * @group Internal: Functions
 */
export function banner(): string {
    const text = figlet.textSync('gobstones-scripts', {
        font: 'Standard',
        horizontalLayout: 'fitted',
        verticalLayout: 'default',
        width: 120,
        whitespaceBreak: true
    });
    return colors.red(text);
}

/**
 * Returns the gobstones-scripts welcome message in the CLI.
 *
 * @returns The welcome message.
 *
 * @internal
 * @group Internal: Functions
 */
export const welcome = (): string => `Welcome to gobstones-scripts version ${config.environment.toolVersion}`;

/**
 * Display the welcome message of the gobstones-script tool
 * and immediately after, the given message.
 *
 * @param message The message to display after welcome.
 *
 * @internal
 * @group Internal: Functions
 */
export function displayWelcomeForAction(message: string): void {
    logger.log(banner());
    logger.log(welcome());
    logger.log('');
    logger.log(message);
    logger.log('');
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
 * @internal
 * @group Internal: Functions
 */
export function runOrEnd(action: () => any, errorsAndMessages: { error: string; msg: string }[]): void {
    try {
        action();
    } catch (e) {
        let message: string = `ERROR: ${e.message}`;
        logger.on();
        for (const i in errorsAndMessages) {
            if (e.message === errorsAndMessages[i].error) {
                message = `ERROR: ${errorsAndMessages[i].msg}`;
                logger.error(message, 'bgRed');
                process.exit(1);
            }
        }
        if (!config.executionEnvironment.isDebugMode) {
            message = `ERROR: An unexpected error ocurred. Run the tool in debug mode to see the full error message.`;
            logger.error(message, 'bgRed');
            process.exit(1);
        }
        throw e;
    }
}

/**
 * Print the currently used configuration when the options contain the argument.
 *
 * @internal
 * @group Internal: Functions
 */
export function printConfiguration(): void {
    logger.log(
        `The project configuration is:\n` +
            `\n\tProject type:    ${colors.blue(config.executionEnvironment.projectType)}` +
            `\n\tProject manager: ${colors.blue(config.executionEnvironment.packageManager)}`
    );
    logger.log(
        `The detected root folder is:\n\t${colors.blue(config.locations.projectRoot)}\n\n` +
            `The detected gobstones scripts root folder is:\n\t${colors.blue(config.locations.gobstonesScriptsRoot)}\n`
    );

    const useAbsolute = config.executionEnvironment.useFullPaths;

    let configFiles = config.projectTypeFilteredFiles.toolingFiles;
    // Do not expose tsConfigJSON, but show it's file, if not auto-generated
    // as the typescript one.
    if (fs.existsSync(config.projectType.tsConfigJSON.toolingFile)) {
        config.projectType.typescript.toolingFile = config.projectType.tsConfigJSON.toolingFile;
    }
    configFiles = configFiles.filter((e) => e !== 'tsConfigJSON').sort();

    logger.log(`The files ${useAbsolute ? '(full path)' : '(relative path)'} to use as configuration are:\n`);

    for (const fileName of configFiles) {
        if (!config.projectType[fileName].toolingFile) continue;
        const filePath = useAbsolute
            ? path.resolve(config.projectType[fileName].toolingFile)
            : path.relative(config.locations.projectRoot, config.projectType[fileName].toolingFile);
        logger.log(`\t${fileName}: ${colors.blue(filePath)}`);
    }
}
