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

import { runBin } from './runBin';

import { isNotDefined } from '../Helpers/isNotDefined';
import { TaskConfigurationError } from '../Helpers/TaskError';

/**
 * This type represents the options that you can pass to the remove task.
 */
export interface TaskRemoveOptions {
    /**
     * The files to remove.
     */
    files: string;
}

/**
 * Returns the string for the bash command  to run
 * a remove file command, deleting them from disk.
 *
 * @param options - The options applied when running the copy.
 *
 * @example remove({ files: './dist' })
 *
 * @returns The bash command string.
 */
export function remove(options: TaskRemoveOptions): string {
    if (isNotDefined(options.files)) {
        throw new TaskConfigurationError(
            stripIndent`"remove" requires options with the following signature:
                {
                    files: string   // The files or folder to delete, may be a glob pattern
                }`
        );
    }
    return rimraf(options.files);
}

/**
 * Returns the string for the bash command  to run
 * rimraf with some arguments.
 *
 * @param args - args to pass to rimraf
 *
 * @return The command to run the rimraf binary with given arguments.
 *
 * @internal
 */
const rimraf = (args: string): string => `${runBin('rimraf')} ${args}`;
