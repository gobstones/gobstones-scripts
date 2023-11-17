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
export interface TaskTypedocOptions {
    /**
     * The files to watch for changes, if desired.
     */
    watch?: string;
}

/**
 * Returns the string for the bash command  to run
 * typedoc with the gobstones-script detected configuration.
 *
 * @param options The options applied when running typedoc.
 *
 * @example typedoc()
 *
 * @returns The bash command string.
 *
 * @group Main API Functions
 */
export const typedoc = (options: TaskTypedocOptions = {}): string =>
    `${runBin('typedoc')} --options ${
        config.configurationFiles[config.loadedOptions.type].typedoc
    } --tsconfig ${config.configurationFiles[config.loadedOptions.type].tsConfigFile}` +
    (options.watch ? ` --watch ${options.watch}` : '');
