/**
 * @module Internal.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import fs from 'fs';
import path from 'path';

import { logger } from './Logger';

import { FileDefinition } from '../config/config';

/**
 * Locate the tooling file to use for the given type definition.
 *
 * @param fileDef The file definition to locate the tooling for.
 *
 * @internal
 * @group Internal: Functions
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
