import { TaskConfigurationError } from './helpers/TaskError';
/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { config } from '../config';
import { isNotDefined } from './helpers/isNotDefined';
import path from 'path';
import { runBin } from './runBin';
import { stripIndent } from 'common-tags';

/**
 * This type represents the options that you can pass to the copy task.
 *
 * @group Main API Types
 */
export interface TaskCopyOptions {
    /**
     * The source file, or folder or glob pattern to copy.
     */
    src: string;
    /**
     * The destination folder on which to copy the files to.
     */
    dest: string;
    /**
     * Wether the source is a directory. Defaults to false.
     */
    isDir?: boolean;
}

/**
 * Returns the string for the bash command  to run
 * a copy command, copying a file or directory to another location.
 *
 * @param options The options applied when running the move.
 *
 * @example copy({src :'./dist/index.js', dist: './dist/index.es.js'})
 *
 * @returns The bash command string.
 *
 * @group Main API Functions
 */
export function copy(options: TaskCopyOptions): string {
    if (isNotDefined(options?.src) || isNotDefined(options?.dest)) {
        throw new TaskConfigurationError(
            stripIndent`"rename" requires options with the following signature:
                {
                    src: string   // The file or folder to copy on
                    dest: string  // The file or folder to copy to
                    isDir?: boolean // Whether the copies element is a dir
                                    // that should be copied recursively, defaults to false.
                }`
        );
    }
    const destFolder = path.dirname(options.dest);
    if (options.isDir) {
        return ncp(`${options.src} ${destFolder}`);
    } else {
        const destFile = path.basename(options.dest);
        return ncp(`${options.src} ${destFolder} --rename ${destFile}`);
    }
}

/**
 * Returns the string for the bash command  to run
 * cpy-cli with some arguments, starting from the project's root path
 * detected by gobstones-scripts.
 * cpy-cli is a dependency of nps-utils, so it does not need to
 * be installed separately.
 *
 * @param args args to pass to cpy-cli
 *
 * @return The command to run the rimraf binary with given arguments.
 *
 * @internal
 */
const ncp = (args: string): string =>
    `${runBin('cpy-cli', 'cpy')} --cwd="${config.projectRootPath}" ${args}`;
