/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { config } from '../config';
import { runBin } from './runBin';

/**
 * This type represents the options that you can pass to the typedoc task.
 *
 * @group Main API Types
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
 * @group Main API Functions
 */
export const rollup = (options: TaskRollupOptions = {}): string =>
    `${runBin('rollup')} --config ${config.configurationFiles[config.loadedOptions.type].rollup}` +
    (options.watch ? ` --watch ${options.watch}` : '') +
    ` --bundleConfigAsCjs`;
