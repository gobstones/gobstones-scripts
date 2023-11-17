import { TaskConfigurationError } from './helpers/TaskError';
/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { ifUnix } from './ifUnix';
import { isNotDefined } from './helpers/isNotDefined';
import { stripIndent } from 'common-tags';

/**
 * This type represents the options that you can pass to the chmod task.
 *
 * @group Main API Types
 */
export interface TaskChmodOptions {
    /**
     * The files on which to run chmod, may be a glob pattern.
     */
    files: string;
    /**
     * The permissions to apply to the files.
     */
    mod: string;
}

/**
 * Returns the string for the bash command  to run
 * a chmod command. Only working in unix based systems.
 *
 * @param options The options applied when running the chmod.
 *
 * @example chmod({  files: './dist/files', mod: '+x' })
 *
 * @returns The bash command string.
 *
 * @group Main API Functions
 */
export function chmod(options: TaskChmodOptions): string {
    if (isNotDefined(options?.files) || isNotDefined(options?.mod)) {
        throw new TaskConfigurationError(
            stripIndent`"chmod" requires options with the following signature:
            {
                files: string   // The files or folder to apply permissions to,
                                // may be a glob pattern
                mod: string     // The permissions to apply
            }`
        );
    }
    return ifUnix(`chmod ${options.mod} ${options.files}`, `echo 'chmod not available in windows'`);
}
