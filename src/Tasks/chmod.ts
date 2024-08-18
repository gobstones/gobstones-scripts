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

import { stripIndent } from 'common-tags';

import { ifUnix } from './ifUnix';

import { isNotDefined } from '../Helpers/isNotDefined';
import { TaskConfigurationError } from '../Helpers/TaskError';

/**
 * This type represents the options that you can pass to the chmod task.
 */
export interface TaskChmodOptions {
    /**
     * The files on which to run chmod, may be a glob pattern.
     */
    files: string;
    /**
     * The permissions to apply to the files.
     */
    mod: string;
}

/**
 * Returns the string for the bash command  to run
 * a chmod command. Only working in unix based systems.
 *
 * @param options - The options applied when running the chmod.
 *
 * @example chmod({  files: './dist/files', mod: '+x' })
 *
 * @returns The bash command string.
 */
export const chmod = (options: TaskChmodOptions): string => {
    if (isNotDefined(options.files) || isNotDefined(options.mod)) {
        throw new TaskConfigurationError(
            stripIndent`"chmod" requires options with the following signature:
            {
                files: string   // The files or folder to apply permissions to,
                                // may be a glob pattern
                mod: string     // The permissions to apply
            }`
        );
    }
    return ifUnix(`chmod ${options.mod} ${options.files}`, `echo 'chmod not available in windows'`);
};
