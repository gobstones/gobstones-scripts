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
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { stripIndent } from 'common-tags';

import { copy } from './copy';
import { remove } from './remove';
import { serially } from './serially';

import { isNotDefined } from '../Helpers/isNotDefined';
import { TaskConfigurationError } from '../Helpers/TaskError';

/**
 * This type represents the options that you can pass to the move task.
 *
 * @group API: Types
 */
export interface TaskMoveOptions {
    /**
     * The source file, or folder or glob pattern to move.
     */
    src: string;
    /**
     * The destination folder on which to move the files to.
     */
    dest: string;
}

/**
 * Returns the string for the bash command  to run
 * a move command, moving files from one location to another.
 *
 * @param options The options applied when running the move.
 *
 * @example move({ src: './src', dest: './dist' })
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export function move(options: TaskMoveOptions): string {
    if (isNotDefined(options?.src) || isNotDefined(options?.dest)) {
        throw new TaskConfigurationError(
            stripIndent`"move" requires options with the following signature:
                {
                    src: string   // The file or folder to run rename on.
                    dest: string  // The file or folder used as new name.
                }`
        );
    }
    return serially(copy({ src: options.src, dest: options.dest }), remove({ files: options.src }));
}
