/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * Returns the string for the bash command  to run
 * an npx command with the gobstones-script detected configuration.
 *
 * @param action The npx action to run.
 *
 * @example npx('@11ty/eleventy')
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export function npx(action: string): string {
    if (isNotDefined(action)) {
        throw new TaskConfigurationError('"npx" expects a defined npx action as argument');
    }
    return `npx ${action}`;
}
