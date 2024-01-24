/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { stripIndent } from 'common-tags';

import { runBin } from './runBin';

import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * This type represents the options that you can pass to the remove task.
 *
 * @group Main API Types
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
 * @param options The options applied when running the copy.
 *
 * @example remove({ files: './dist' })
 *
 * @returns The bash command string.
 *
 * @group Main API Functions
 */
export function remove(options: TaskRemoveOptions): string {
    if (isNotDefined(options?.files)) {
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
 * @param args args to pass to rimraf
 *
 * @return The command to run the rimraf binary with given arguments.
 *
 * @internal
 */
const rimraf = (args: string): string => `${runBin('rimraf')} ${args}`;
