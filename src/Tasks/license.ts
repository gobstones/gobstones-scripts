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

import { config } from '../Config';
import { isNotDefined } from '../Helpers/isNotDefined';
import { TaskConfigurationError } from '../Helpers/TaskError';

/**
 * Returns the string for the bash command to run
 * the license-check-and-add command.
 *
 * @param mode The mode in which to run, one of "add" (default) or "remove".
 *
 * @example license('add')
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export function license(mode: string = 'add'): string {
    if (isNotDefined(mode) || (mode !== 'add' && mode !== 'remove')) {
        throw new TaskConfigurationError('"license" expects a string representing the mode, one of "add" or "remove"');
    }
    return `${runBin('license-check-and-add')} ${mode} -f ${config.projectType.licenseHeaderConfig.toolingFile}on`;
}
