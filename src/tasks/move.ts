/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { stripIndent } from 'common-tags';

import { copy } from './copy';
import { remove } from './remove';
import { serially } from './serially';

import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * This type represents the options that you can pass to the move task.
 *
 * @group Main API Types
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
 * @group Main API Functions
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
