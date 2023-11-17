/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { TaskConfigurationError } from './helpers/TaskError';
import { isNotDefined } from './helpers/isNotDefined';
import { runBin } from './runBin';
import { stripIndent } from 'common-tags';

/**
 * This type represents the options that you can pass to the eslint task.
 *
 * @group Main API Types
 */
export interface TaskEslintOptions {
    /**
     * The files on which to run eslint, may be a glob pattern.
     */
    files: string;
    /**
     * Wether to fix the issues found if possible. Defaults to false.
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
 * @group Main API Functions
 */
export function eslint(options: TaskEslintOptions): string {
    if (isNotDefined(options?.files)) {
        throw new TaskConfigurationError(
            stripIndent`"eslint" requires options with the following signature:
                {
                    files: string   // The files to lint, may be a glob pattern
                    fix?: boolean  //Wether to fix the encountered error when possible
                    extensions?: string // The extensions to consider
                }`
        );
    }
    options.fix = options.fix ?? false;
    options.extensions = options.extensions ?? 'js,jsx,ts,tsx';
    return (
        `${runBin('eslint')} ${options.files} --format stylish --ext ${
            options.extensions
        } --color` + (options.fix ? ' --fix' : '')
    );
}
