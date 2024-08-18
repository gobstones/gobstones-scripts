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
import fs from 'fs';
import path from 'path';

import commandExists from 'command-exists';

import { logger } from './Logger';
import { PackageJsonReader } from './PackageJsonReader';

import { OSType } from '../Config/config';

/**
 * Returns the `@gobstones/gobstones-scripts` root path. That is, the path to
 * the module in the users `node_modules` folder.
 *
 * @param os - The OS that is currently discovered as environment.
 * @param projectRootPath - The currently identified project's root path.
 *
 * @returns The root path of the `gobstones-scripts` project.
 */
export const getGobstonesScriptsRootPath = (os: OSType, projectRootPath: string): string => {
    logger.debug(`[getGobstonesScriptsRootPath]: Attempting to recover the gobstones-scripts folder location`, 'green');

    // Return if previously calculated
    let detectedScriptRootPath: string = '';

    try {
        logger.debug(`[getGobstonesScriptsRootPath]: Attempting through require.resolve method`, 'green');
        // First attempt by using require.resolve
        // This method is not reliable and may fail
        // depending on setup
        detectedScriptRootPath = path.join(path.dirname(require.resolve('@gobstones/gobstones-scripts/package.json')));

        logger.debug(
            `[getGobstonesScriptsRootPath]: Found through require.resolve at: ${detectedScriptRootPath}`,
            'green'
        );

        return detectedScriptRootPath;
    } catch {
        logger.debug(`[getGobstonesScriptsRootPath]: require.resolve method failed`, 'green');

        // First, check if we are running from the project itself, that may be
        // the same folder, or a folder further up
        let possibleRootPath = projectRootPath;

        const pathStartBySystem =
            os === 'windows' ? (possibleRootPath?.match(/^[A-Z]:\\/) ? possibleRootPath.substring(0, 3) : 'C:\\') : '/';

        logger.debug(
            `[getGobstonesScriptsRootPath]: Verifying if "${possibleRootPath}" is the gobstones-scripts root folder`,
            'green'
        );

        while (possibleRootPath !== pathStartBySystem) {
            const pkgReader = new PackageJsonReader(path.join(possibleRootPath, 'package.json'));
            if (pkgReader.getValueAt('name') === '@gobstones/gobstones-scripts') {
                // Found
                detectedScriptRootPath = possibleRootPath;

                logger.debug(`[getGobstonesScriptsRootPath]: Found gobstones-scripts at: ${possibleRootPath}`, 'green');
                return detectedScriptRootPath;
            }
            possibleRootPath = path.dirname(possibleRootPath);

            logger.debug(
                `[getGobstonesScriptsRootPath]: Not found. Attempting with next folder: ${possibleRootPath}`,
                'green'
            );
        }

        logger.debug(`[getGobstonesScriptsRootPath]: Reached root directory and not found`, 'green');

        // Return the path to a particular location
        // based on the root folder string, the
        // file does not necessarily exists.
        const getRootPath = (command: string): string => {
            try {
                const processGettedPath = childProcess.execSync(command).toString().trim();
                return path.join(processGettedPath || '', '@gobstones', 'gobstones-scripts');
            } catch {
                return '';
            }
        };

        // If running globally, try to find a configuration
        // of the particular tool. That means, get the directory of
        // tool installed (which may fail if not installed), and
        // ensure the directory exists.
        const attemptForCommandWithLocations = (command: string, locations: string[]): string | undefined => {
            if (commandExists.sync(command)) {
                logger.debug(
                    `[getGobstonesScriptsRootPath]: Attempting to see if gobstones-scripts ` +
                        `is installed globally through ${command}`,
                    'green'
                );

                for (const location of locations) {
                    logger.debug(`[getGobstonesScriptsRootPath]: Attempting with location from "${location}"`, 'green');

                    const rootPath = getRootPath(location);
                    if (rootPath && fs.existsSync(rootPath)) {
                        logger.debug(
                            `[getGobstonesScriptsRootPath]: Found. Setting gobstones-scripts root to: ${rootPath}`,
                            'green'
                        );
                        return rootPath;
                    }

                    logger.debug(`[getGobstonesScriptsRootPath]: Not found, attempting next location.`, 'green');
                }
            }
            logger.debug(`[getGobstonesScriptsRootPath]: Not found at any location for command ${command}`, 'green');

            return undefined;
        };

        let indexToLocation = 0;
        const actionsToFindLocation = [
            () =>
                attemptForCommandWithLocations('npm', [
                    'npm root --location=project',
                    'npm root --location=user',
                    'npm root --location=global'
                ]),
            () => attemptForCommandWithLocations('pnpm', ['pnpm root', 'pnpm root --global'])
        ];
        while (!detectedScriptRootPath && indexToLocation < actionsToFindLocation.length) {
            detectedScriptRootPath = actionsToFindLocation[indexToLocation]() || '';
            indexToLocation++;
        }

        if (detectedScriptRootPath) {
            return detectedScriptRootPath;
        } else {
            logger.debug(
                `[getGobstonesScriptsRootPath]: Could not find location through any of the commands.`,
                'green'
            );
        }

        // Also get a default path, which requires
        // the project root path, and attempt to find
        // the project under node_modules.
        const defaultPath = path.join(projectRootPath, 'node_modules', '@gobstones', 'gobstones-scripts');
        if (fs.existsSync(defaultPath)) {
            logger.debug(`[getGobstonesScriptsRootPath]: Returning default at: ${defaultPath}`, 'green');

            return defaultPath;
        }
    }

    logger.debug(`[getGobstonesScriptsRootPath]: Could not find the gobstones-script project library`, 'green');

    throw Error('cannot find script root');
};
