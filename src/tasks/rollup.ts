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
