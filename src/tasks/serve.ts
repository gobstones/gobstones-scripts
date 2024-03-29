/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { stripIndent } from 'common-tags';

import { runBin } from './runBin';

import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * This type represents the options that you can pass to the serve task.
 *
 * @group API: Types
 */
export interface TaskServeOptions {
    /**
     * The directory to serve
     */
    dir: string;
}

/**
 * Returns the string for the bash command  to run
 * serve with default configuration.
 *
 * @param options The options applied when running serve.
 *
 * @example serve({ dir: './coverage' })
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export function serve(options: TaskServeOptions): string {
    if (isNotDefined(options?.dir)) {
        throw new TaskConfigurationError(
            stripIndent`"serve" requires options with the following signature:
        {
            dir: string   // The directory to serve.
        }`
        );
    }
    return `${runBin('serve')} ${options.dir}`;
}
