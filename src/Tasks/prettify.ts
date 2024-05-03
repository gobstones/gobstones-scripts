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
import { stripIndent } from 'common-tags';

import { runBin } from './runBin';

import { isNotDefined } from '../Helpers/isNotDefined';
import { TaskConfigurationError } from '../Helpers/TaskError';

/**
 * This type represents the options that you can pass to the typedoc task.
 *
 * @group API: Types
 */
export interface TaskPrettifyOptions {
    /**
     * The files on which to run prettier.
     */
    files: string;
}

/**
 * Returns the string for the bash command  to run
 * prettier with the gobstones-script detected configuration.
 *
 * @param options The options applied when running typedoc.
 *
 * @example prettier({ files: './src/** /*' })
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export function prettify(options: TaskPrettifyOptions): string {
    if (isNotDefined(options?.files)) {
        throw new TaskConfigurationError(
            stripIndent`"prettier" requires options with the following signature:
                {
                    files: string   // The files to run prettier on, may be a glob pattern
                }`
        );
    }
    return `${runBin('prettier')} --no-error-on-unmatched-pattern --write ${options.files}`;
}
