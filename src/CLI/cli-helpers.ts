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
 * @module CLI
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 */
import path from 'path';
import process from 'process';

import chalk from 'chalk';
import figlet from 'figlet';

import { t } from '../@i18n';
import { config } from '../Config';
import { FileDefinitionWithTooling } from '../Config/helpers/project-types';
import { logger } from '../Helpers/Logger';
import { CommandExecutionError, FileSystemError } from '../API';

/**
 * Returns the gobstones-scripts banner that will be printed in CLI.
 *
 * @returns The gobstones-script banner.
 */
export const banner = (): string => {
    const text: string = figlet.textSync('gobstones-scripts', {
        font: 'Standard',
        horizontalLayout: 'fitted',
        verticalLayout: 'default',
        width: 120,
        whitespaceBreak: true
    });
    return chalk.red(text);
};

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
export const displayWelcomeForAction = (message: string): void => {
    logger.log(banner());
    logger.log(welcome());
    logger.log('');
    logger.log(message);
    logger.log('');
};
/**
 * Run a function and print an error message if it fails.
 * The action is expected to be executed and produce an error with a given
 * message in some cases. errorsAndMessages matches on those inner messages
 * and outputs the associated message to the user in a style with red background.
 *
 * @param action - A function to be executed and catch on failure.
 */
export const runOrEnd = (action: () => void): void => {
    try {
        action();
    } catch (e: unknown) {
        const error = e as { message: string };
        const knownErrorMessagesToTranslation: Record<string, (err: Error) => string> = {
            'errors.emptyFolder': (_e: FileSystemError) => t('cli:errors.emptyFolder'),
            'errors.commandExecutionFailed': (_e: CommandExecutionError) =>
                t('cli:errors.commandExecutionFailed', { command: _e.command, exitCode: _e.exitCode }),
            'errors.undefinedTsConfig': (_e: Error) => t('cli:errors.undefinedTsConfig'),
            DEFAULT: (_e: Error) => t('cli:errors.unexpected')
        };
        const message = (knownErrorMessagesToTranslation[error.message] ?? knownErrorMessagesToTranslation.DEFAULT)(
            error as Error
        );
        logger.on();
        if (!config.executionEnvironment.debug) {
            logger.error('ERROR: ' + message, 'bgRed');
            process.exit(1);
        }
        throw e;
    }
};

/**
 * Print the currently used configuration when the options contain the argument.
 */
export const printConfiguration = (): void => {
    logger.log(
        t('cli:messages.configuration', {
            projectType: chalk.blue(config.executionEnvironment.projectType),
            projectManager: chalk.blue(config.executionEnvironment.packageManager),
            isTestMode: chalk.blue(config.executionEnvironment.test ? 'yes' : 'no'),
            isDebugMode: chalk.blue(config.executionEnvironment.debug ? 'yes' : 'no'),
            usingFullPaths: chalk.blue(config.executionEnvironment.useFullPaths ? 'yes' : 'no')
        })
    );
    logger.log(
        t('cli:messages.folders', {
            rootFolder: chalk.blue(config.locations.projectRoot),
            gobstonesScriptsFolder: chalk.blue(config.locations.gobstonesScriptsRoot)
        })
    );

    const useAbsolute = config.executionEnvironment.useFullPaths;

    const configFiles = config.projectTypeFilteredFiles.toolingFiles;
    logger.log(t('cli:messages.files', { pathType: useAbsolute ? '(full path)' : '(relative path)' }));

    for (const fileName of configFiles) {
        if (!(config.projectType[fileName] as FileDefinitionWithTooling).toolingFiles) continue;
        const filePath = useAbsolute
            ? path.resolve((config.projectType[fileName] as FileDefinitionWithTooling).toolingFiles.main)
            : path.relative(
                  config.locations.projectRoot,
                  (config.projectType[fileName] as FileDefinitionWithTooling).toolingFiles.main
              );
        logger.log(`\t${fileName}: ${chalk.blue(filePath)}`);
    }
};
