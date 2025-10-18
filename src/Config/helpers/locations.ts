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
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import path from 'path';
import process from 'process';

import { OSType } from './environment';

import { logger } from '../../Helpers/Logger';
import { getGobstonesScriptsRootPath } from '../../Helpers/getGobstonesScriptsRootPath';
import { getProjectRootPath } from '../../Helpers/getProjectRootPath';

/**
 * Models the configuration for all the different
 * locations this tool manages. It's one of the main
 * {@link Config} sections.
 */
export interface ConfigLocations {
    /** The root of the currently running project. */
    projectRoot: string;
    /** The root of the gobstones-scripts Library. */
    gobstonesScriptsRoot: string;
    /** The root of the gobstones-scripts Library project files. */
    gobstonesScriptsProjectsRoot: string;
}

/**
 * Initialize the different locations by attempting to detect the current
 * folder containing a project and the folder containing the gobstones-scripts Library.
 */
export const locations = (operatingSystem: OSType): ConfigLocations => {
    let projectRoot = getProjectRootPath(operatingSystem);
    const gobstonesScriptsRoot = getGobstonesScriptsRootPath(operatingSystem, projectRoot);
    // If they are the same, it may happen that we are running in a subfolder
    // of gobstones-scripts itself. This happens i.e. when running tests.
    // We should fix this and use the CWD instead
    if (projectRoot === gobstonesScriptsRoot) {
        projectRoot = process.env.PWD ? process.env.PWD : process.cwd() ? process.cwd() : path.resolve('.');
        logger.debug(
            `[locations]: Detected root and scripts to be the same, updating root to cwd at ${projectRoot}`,
            'green'
        );
    }
    return {
        projectRoot,
        gobstonesScriptsRoot,
        gobstonesScriptsProjectsRoot: path.join(gobstonesScriptsRoot, 'project-types')
    };
};
