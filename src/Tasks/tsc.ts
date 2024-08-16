/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */

/**
 * ----------------------------------------------------
 * @module Tasks
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * ----------------------------------------------------
 */

import { runBin } from './runBin';

import { config } from '../Config';

/**
 * This type represents the options that you can pass to the tsc task.
 */
export interface TaskTscOptions {
    /**
     * The output directory for the files. Undefined if in same folder.
     */
    outDir?: string;

    /**
     * Whether to emit the JS output files or not
     */
    emit: boolean;
}

/**
 * Returns the string for the bash command  to run
 * tsc with the gobstones-script detected configuration.
 *
 * @param options - The options applied when running typedoc.
 *
 * @example tsc({file: './src/index.ts' })
 *
 * @returns The bash command string.
 */
export const tsc = (options: TaskTscOptions = { emit: false }): string =>
    `${runBin('tsc')} --project ${config.projectType.tsConfigJSON.toolingFile}${!options.emit ? ' --noEmit' : ''}${
        options.emit && options.outDir ? ' --outDir ' + options.outDir : ''
    }`;
