/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { stripIndent } from 'common-tags';

import { runBin } from './runBin';

import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * This type represents the options that you can pass to the eslint task.
 *
 * @group API: Types
 */
export interface TaskEslintOptions {
    /**
     * The files on which to run eslint, may be a glob pattern.
     */
    files: string;
    /**
     * Whether to fix the issues found if possible. Defaults to false.
     */
    fix?: boolean;
    /**
     * The file extensions to consider when running eslint.
     * Defaults to js,jsx,ts,tsx
     */
    extensions?: string;
}

/**
 * Returns the string for the bash command  to run
 * eslint with the project's configuration. And optional
 * `fix` option set to true may be given to attempt
 * fixing all errors instead of just reporting them.
 *
 * @param options The options applied when running eslint.
 *
 * @example eslint({files: './src/** /*' })
 * @example eslint({ files: './src/** /*', fix: true })
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export function eslint(options: TaskEslintOptions): string {
    if (isNotDefined(options?.files)) {
        throw new TaskConfigurationError(
            stripIndent`"eslint" requires options with the following signature:
                {
                    files: string   // The files to lint, may be a glob pattern
                    fix?: boolean  // Whether to fix the encountered error when possible
                    extensions?: string // The extensions to consider
                }`
        );
    }
    options.fix = options.fix ?? false;
    options.extensions = options.extensions ?? 'js,jsx,ts,tsx';
    return (
        `${runBin('eslint')} ${options.files} --format stylish --ext ${options.extensions} --color` +
        (options.fix ? ' --fix' : '')
    );
}
