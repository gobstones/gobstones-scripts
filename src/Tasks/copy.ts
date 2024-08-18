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
 * @module Tasks
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * ----------------------------------------------------
 */

import path from 'path';

import { stripIndent } from 'common-tags';

import { runBin } from './runBin';

import { config } from '../Config';
import { isNotDefined } from '../Helpers/isNotDefined';
import { TaskConfigurationError } from '../Helpers/TaskError';

/**
 * This type represents the options that you can pass to the copy task.
 */
export interface TaskCopyOptions {
    /**
     * The source file, or folder or glob pattern to copy.
     */
    src: string;
    /**
     * The destination folder on which to copy the files to.
     */
    dest: string;
    /**
     * Whether the source is a directory. Defaults to false.
     */
    isDir?: boolean;
}

/**
 * Returns the string for the bash command  to run
 * a copy command, copying a file or directory to another location.
 *
 * @param options - The options applied when running the move.
 *
 * @example copy({src :'./dist/index.js', dist: './dist/index.es.js'})
 *
 * @returns The bash command string.
 */
export const copy = (options: TaskCopyOptions): string => {
    if (isNotDefined(options.src) || isNotDefined(options.dest)) {
        throw new TaskConfigurationError(
            stripIndent`"rename" requires options with the following signature:
                {
                    src: string   // The file or folder to copy on
                    dest: string  // The file or folder to copy to
                    isDir?: boolean // Whether the copies element is a dir
                                    // that should be copied recursively, defaults to false.
                }`
        );
    }
    const destFolder = path.dirname(options.dest);
    if (options.isDir) {
        return ncp(`${options.src} ${destFolder}`);
    } else {
        const destFile = path.basename(options.dest);
        return ncp(`${options.src} ${destFolder} --rename ${destFile}`);
    }
};

/**
 * Returns the string for the bash command  to run
 * cpy-cli with some arguments, starting from the project's root path
 * detected by gobstones-scripts.
 * cpy-cli is a dependency of nps-utils, so it does not need to
 * be installed separately.
 *
 * @param args - args to pass to cpy-cli
 *
 * @return The command to run the rimraf binary with given arguments.
 *
 * @internal
 */
const ncp = (args: string): string => `${runBin('cpy-cli', 'cpy')} --cwd="${config.locations.projectRoot}" ${args}`;
