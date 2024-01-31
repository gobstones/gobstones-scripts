/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * Returns the string for the bash command  to run
 * an node command over a particular string.
 *
 * @param script The script to run.
 *
 * @example node('myscript.js')
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export function node(script: string): string {
    if (isNotDefined(script)) {
        throw new TaskConfigurationError('"node" expects a string as argument');
    }
    return `node ${script}`;
}
