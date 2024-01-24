/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { stripIndent } from 'common-tags';

import { runBin } from './runBin';

import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * This type represents the options that you can pass to the typedoc task.
 *
 * @group Main API Types
 */
export interface TaskPrettifyOptions {
    /**
     * The files on which to run prettier.
     */
    files: string;
}

/**
 * Returns the string for the bash command  to run
 * prettier with the gobstones-script detected configuration.
 *
 * @param options The options applied when running typedoc.
 *
 * @example prettier({ files: './src/** /*' })
 *
 * @returns The bash command string.
 *
 * @group Main API Functions
 */
export function prettify(options: TaskPrettifyOptions): string {
    if (isNotDefined(options?.files)) {
        throw new TaskConfigurationError(
            stripIndent`"prettier" requires options with the following signature:
                {
                    files: string   // The files to run prettier on, may be a glob pattern
                }`
        );
    }
    return `${runBin('prettier')} --no-error-on-unmatched-pattern --write ${options.files}`;
}
