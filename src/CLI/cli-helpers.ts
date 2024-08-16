/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */

/**
 * ----------------------------------------------------
 * @module CLI
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 * ----------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import process from 'process';

import colors from 'ansi-colors';
import figlet from 'figlet';

import { t } from '../@i18n';
import { config } from '../Config';
import { FileDefinitionWithTooling } from '../Config/config';
import { logger } from '../Helpers/Logger';

/**
 * Returns the gobstones-scripts banner that will be printed in CLI.
 *
 * @returns The gobstones-script banner.
 */
export function banner(): string {
    const text: string = figlet.textSync('gobstones-scripts', {
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
 */
export const welcome = (): string => t('cli:messages.welcome', { version: config.environment.toolVersion });

/**
 * Display the welcome message of the gobstones-script tool
 * and immediately after, the given message.
 *
 * @param message - The message to display after welcome.
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
 * @param action - A function to be executed and catch on failure.
 * @param errorsAndMessages - An object associating inner
 *      possible error messages as keys and messages to output to the user as values.
 */
export function runOrEnd(action: () => void): void {
    try {
        action();
    } catch (e: unknown) {
        const error = e as { message: string };

        let message: string;
        if (error.message === 'errors.emptyFolder') {
            message = t('cli:errors.emptyFolder');
        } else if (error.message === 'errors.undefinedTsConfig') {
            message = t('cli:errors.undefinedTsConfig');
        } else {
            message = t('cli:errors.unexpected');
        }

        logger.on();
        if (!config.executionEnvironment.debug) {
            logger.error('ERROR: ' + message, 'bgRed');
            process.exit(1);
        }
        throw e;
    }
}

/**
 * Print the currently used configuration when the options contain the argument.
 */
export function printConfiguration(): void {
    logger.log(
        t('cli:messages.configuration', {
            projectType: colors.blue(config.executionEnvironment.projectType),
            projectManager: colors.blue(config.executionEnvironment.packageManager),
            isTestMode: colors.blue(config.executionEnvironment.test ? 'yes' : 'no'),
            isDebugMode: colors.blue(config.executionEnvironment.debug ? 'yes' : 'no'),
            usingLocalTsConfig: colors.blue(config.executionEnvironment.useLocalTsconfigJson ? 'yes' : 'no'),
            usingFullPaths: colors.blue(config.executionEnvironment.useFullPaths ? 'yes' : 'no')
        })
    );
    logger.log(
        t('cli:messages.folders', {
            rootFolder: colors.blue(config.locations.projectRoot),
            gobstonesScriptsFolder: colors.blue(config.locations.gobstonesScriptsRoot)
        })
    );

    const useAbsolute = config.executionEnvironment.useFullPaths;

    let configFiles = config.projectTypeFilteredFiles.toolingFiles;
    // Do not expose tsConfigJSON, but show it's file, if not auto-generated
    // as the typescript one.
    if (config.projectType.tsConfigJSON.toolingFile && fs.existsSync(config.projectType.tsConfigJSON.toolingFile)) {
        config.projectType.typescript.toolingFile = config.projectType.tsConfigJSON.toolingFile;
    }
    configFiles = configFiles.filter((e) => e !== 'tsConfigJSON').sort();

    logger.log(t('cli:messages.files', { pathType: useAbsolute ? '(full path)' : '(relative path)' }));

    for (const fileName of configFiles) {
        if (!(config.projectType[fileName] as FileDefinitionWithTooling).toolingFile) continue;
        const filePath = useAbsolute
            ? path.resolve((config.projectType[fileName] as FileDefinitionWithTooling).toolingFile)
            : path.relative(
                config.locations.projectRoot,
                (config.projectType[fileName] as FileDefinitionWithTooling).toolingFile
            );
        logger.log(`\t${fileName}: ${colors.blue(filePath)}`);
    }
}
