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
 * @module Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 * ----------------------------------------------------
 */

import childProcess from 'child_process';

import commandExists from 'command-exists';

import { logger } from './Logger';

import { ConfigPackageManagers, PackageManager } from '../Config/config';

/**
 * Return the package manager in use based different features. First, by
 * identifying the current runner through the `npm_config_user_agent` environment
 * variable. It such variable is not set, which is common for global runs,
 * attempts to identify the runner by locating the global `gobstones-scripts`
 * command. If no match is found, defaults to `npm`.
 *
 * @param availablePackageManagers - The list of all available package managers.
 * @param defaultPackageManager The default package manager to use.
 *
 * @returns The package manager in use
 */
export const getInUsePackageManager = (
    availablePackageManagers: ConfigPackageManagers,
    defaultPackageManager: PackageManager = 'npm'
): PackageManager => {
    logger.debug(`[getInUsePackageManager]: Attempting to locate package manager in use`, 'gray');

    const userAgent = process.env.npm_config_user_agent;
    let whichFile: string = '';

    if (!userAgent) {
        logger.debug(
            `[getInUsePackageManager]: No node user agent found, checking if gobstones-scripts was run globally`,
            'gray'
        );

        try {
            logger.debug(
                `[getInUsePackageManager]: Attempting to find global gobstones-script binary through "which" command`,
                'gray'
            );

            whichFile = childProcess
                .spawnSync('which gobstones-scripts', { shell: true })
                .output.toString()
                .replace(/,/g, '')
                .trim();
        } catch {
            logger.debug(`[getInUsePackageManager]: "which" may not be installed in this system.`, 'cyan');
        }
    }
    const value = userAgent ?? whichFile;

    logger.debug(`[getInUsePackageManager]: Found gobstones-scripts at: ${value}`, 'gray');

    let result: string | undefined;
    for (const pm of Object.keys(availablePackageManagers) as (keyof ConfigPackageManagers)[]) {
        if (value?.includes(availablePackageManagers[pm].cmd)) {
            if (commandExists.sync(availablePackageManagers[pm].cmd)) {
                result = availablePackageManagers[pm].cmd;
                break;
            }
        }
    }

    if (!result) {
        logger.debug(
            `[getInUsePackageManager]: Could not determine package manager. Using default: ${defaultPackageManager}`,
            'gray'
        );

        return defaultPackageManager;
    } else {
        logger.debug(`[getInUsePackageManager]: Detected package manager in use as: ${result}`, 'cyan');

        return result as PackageManager;
    }
};
