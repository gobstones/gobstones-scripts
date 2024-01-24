/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { stripIndent } from 'common-tags';

import { runBin } from './runBin';

import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * This type represents the options that you can pass to the replace task.
 *
 * @group Main API Types
 */
export interface TaskReplaceOptions {
    /**
     * The text or regular expression to be matched.
     */
    match: string;
    /**
     * The text used to replaced the matched text.
     * If none given, the empty string is used, so
     * it acts as a delete text command.
     */
    replace?: string;
    /**
     * The file on which to replace the text.
     * If a folder or glob pattern is given, it acts
     * recursively on that folder or glob.
     */
    file: string;
}

/**
 * Returns the string for the bash command  to run
 * a replacement of text in a file or set of files
 * within a folder.
 *
 * @param options The options applied when running the replacement.
 *
 * @example replace({ match: 'foo', replace: 'bar', file: '*.txt' })
 *
 * @returns The bash command string.
 *
 * @group Main API Functions
 */
export function replace(options: TaskReplaceOptions): string {
    if (isNotDefined(options?.match) || isNotDefined(options?.file)) {
        throw new TaskConfigurationError(
            stripIndent`"replace" requires options with the following signature:
                {
                    match: string   // The text or regexp to match.
                    replace: string // The text to replace with, can use patterns.
                    file: string    // The file or glob on which to replace.
                }`
        );
    }
    return (
        `${runBin('replace')} ` +
        `'${options.match}' ` +
        `'${options.replace ?? ''}' ` +
        `${options.file} ` +
        `--recursive --silent`
    );
}
