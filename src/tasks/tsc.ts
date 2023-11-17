/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { config } from '../config';
import { runBin } from './runBin';

/**
 * This type represents the options that you can pass to the tsc task.
 *
 * @group Main API Types
 */
export interface TaskTscOptions {
    /**
     * The output directory for the files. Undefined if in same folder.
     */
    outDir?: string;

    /**
     * Wether to emit the JS output files or not
     */
    emit: boolean;
}

/**
 * Returns the string for the bash command  to run
 * tsc with the gobstones-script detected configuration.
 *
 * @param options The options applied when running typedoc.
 *
 * @example tsc({file: './src/index.ts' })
 *
 * @returns The bash command string.
 *
 * @group Main API Functions
 */
export const tsc = (options: TaskTscOptions = { emit: false }): string =>
    `${runBin('tsc')} --project ${
        config.configurationFiles[config.loadedOptions.type].tsConfigFile
    }${!options.emit ? ' --noEmit' : ''}${
        options.emit && options.outDir ? ' --outDir ' + options.outDir : ''
    }`;
