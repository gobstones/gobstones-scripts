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

import { FileDefinition } from '../Config/config';

/**
 * Locate the tooling file to use for the given type definition.
 *
 * @param projectRoot - The root directory for the project.
 * @param gobstonesScriptsProjectsRoot - The root directory for the gobstones-scripts package.
 * @param fileDef - The file definition to locate the tooling for.
 *
 * @returns The tooling file path for the given file definition, or undefined if none could be found.
 */
export const getToolingFile = (
    projectRoot: string,
    gobstonesScriptsProjectsRoot: string,
    fileDef: FileDefinition
): string | undefined => {
    logger.debug(
        `[getToolingFile] Attempting to determine which configuration file to use for: ${fileDef.name}`,
        'blue'
    );

    if (fs.existsSync(path.join(projectRoot, fileDef.projectLocation[0]))) {
        logger.debug(
            `[getToolingFile] Found file at the root of the project: ${path.join(
                projectRoot,
                fileDef.projectLocation[0]
            )}`,
            'blue'
        );

        return path.join(projectRoot, fileDef.projectLocation[0]);
    } else if (fs.existsSync(path.join(gobstonesScriptsProjectsRoot, fileDef.gobstonesScriptsLocation[0]))) {
        logger.debug(
            `[getToolingFile] Found file at the gobstones-scripts library: ${path.join(
                gobstonesScriptsProjectsRoot,
                fileDef.gobstonesScriptsLocation[0]
            )}`,
            'blue'
        );

        return path.join(gobstonesScriptsProjectsRoot, fileDef.gobstonesScriptsLocation[0]);
    }

    logger.debug(
        `[getToolingFile] No file found. ${
            fileDef.name === 'tsConfigJSON'
                ? 'This is Ok in this case, not to worry.'
                : 'A file should have been found. Something wrong happened.'
        }`,
        'blue'
    );
    return undefined;
};
