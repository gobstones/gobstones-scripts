/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { runBin } from './runBin';

import { config } from '../config';

/**
 * This type represents the options that you can pass to the typedoc task.
 *
 * @group API: Types
 */
export interface TaskRollupOptions {
    /**
     * The files to watch for changes, if desired.
     */
    watch?: string;
}

/**
 * Returns the string for the bash command  to run
 * rollup with the gobstones-scripts detected configuration.
 *
 * @param options The options applied when running rollup.
 *
 * @example rollup()
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export const rollup = (options: TaskRollupOptions = {}): string =>
    `${runBin('rollup')} --config ${config.projectType.rollup.toolingFile}` +
    (options.watch ? ` --watch ${options.watch}` : '') +
    ` --bundleConfigAsCjs`;
