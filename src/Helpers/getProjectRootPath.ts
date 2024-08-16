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

import fs from 'fs';
import path from 'path';

import { logger } from './Logger';

import { OSType } from '../Config/config';

/**
 * Returns the current project's root path by attempting to identify it.
 * If it cannot be identified, it returns the current working directory
 * as the project's root path.
 *
 * @param os - The OS that is currently discovered as environment.
 *
 * @returns The project's root path.
 */
export function getProjectRootPath(os: OSType): string {
    logger.debug(`[getProjectRootPath]: Attempting to recover the project root path`, 'cyan');

    // The obvious choice is the the current directory
    let possibleRootPath: string = process.env.PWD
        ? process.env.PWD
        : process.cwd()
            ? process.cwd()
            : path.resolve('.');

    const pathStartBySystem
        = os === 'windows'
            // eslint-disable-next-line no-null/no-null
            ? possibleRootPath.match(/^[A-Z]:\\/) !== null
                ? possibleRootPath.substring(0, 3)
                : 'C:\\'
            : '/';

    // Attempt to find the root in current directory and above
    // until no more directories are found
    logger.debug(`[getProjectRootPath]: Trying to check if "${possibleRootPath}" is the project's root path`, 'cyan');

    while (possibleRootPath && possibleRootPath !== pathStartBySystem) {
        // A valid root is one such that there is a package.json
        // with or without gobstones-scripts config section.
        if (fs.existsSync(path.join(possibleRootPath, 'package.json'))) {
            // Found

            logger.debug(`[getProjectRootPath]: Found a package.json file at: "${possibleRootPath}"`, 'cyan');
            logger.debug(`[getProjectRootPath]: Project's root path is: "${possibleRootPath}"`, 'cyan');

            return possibleRootPath;
        }
        // Go up
        possibleRootPath = path.dirname(possibleRootPath);

        logger.debug(
            `[getProjectRootPath]: No package.json found, attempting with new folder: ${possibleRootPath}"`,
            'cyan'
        );
    }

    possibleRootPath = process.env.PWD ? process.env.PWD : process.cwd() ? process.cwd() : path.resolve('.');

    logger.debug(`[getProjectRootPath]: Reached root directory and no project root found.`, 'cyan');
    logger.debug(`[getProjectRootPath]: Considering current working directory as project's root`, 'cyan');
    logger.debug(`[getProjectRootPath]: Project's root path set to: ${possibleRootPath}`, 'cyan');

    return possibleRootPath;
}
