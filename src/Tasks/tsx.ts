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
 * @module Tasks
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { stripIndent } from 'common-tags';

import { runBin } from './runBin';

import { config } from '../Config';
import { isNotDefined } from '../Helpers/isNotDefined';
import { TaskConfigurationError } from '../Helpers/TaskError';

/**
 * This type represents the options that you can pass to the tsx task.
 */
export interface TaskTsxOptions {
    /**
     * The files to run with tsx.
     */
    file: string;

    /**
     * The files to watch for changes, if desired.
     */
    watch?: string;
}

/**
 * Returns the string for the bash command  to run
 * tsx with the gobstones-script detected configuration.
 *
 * @param options - The options applied when running typedoc.
 *
 * @example tsx({file: './src/index.ts', watch: false })
 *
 * @returns The bash command string.
 */
export const tsx = (options: TaskTsxOptions): string => {
    if (isNotDefined(options.file)) {
        throw new TaskConfigurationError(
            stripIndent`"tsx" requires options with the following signature:
                {
                    file: string    // The main file to run
                    watch?: string  // Watch a set of files for changes
                }`
        );
    }
    return (
        `${runBin('tsx')} ${options.watch ? 'watch' : ''} ` +
        `${options.file} --tsconfig ${config.projectType.tsConfigJSON.toolingFile}`
    );
};
