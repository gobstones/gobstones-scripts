/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */

import { runBin } from './runBin';

import { config } from '../config';
import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * Returns the string for the bash command  to run
 * an nps command with the gobstones-script detected configuration.
 *
 * @param action The nps action to run.
 *
 * @example nps('clean.dist')
 * @example nps('build')
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export function nps(action: string): string {
    if (isNotDefined(action)) {
        throw new TaskConfigurationError('"nps" expect a defined nps action as argument');
    }
    return `${runBin('nps')} -c ${config.projectType.nps.toolingFile} ${action}`;
}
