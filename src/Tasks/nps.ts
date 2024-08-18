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
import { isNotDefined } from '../Helpers/isNotDefined';
import { TaskConfigurationError } from '../Helpers/TaskError';

/**
 * Returns the string for the bash command  to run
 * an nps command with the gobstones-script detected configuration.
 *
 * @param action - The nps action to run.
 *
 * @example nps('clean.dist')
 * @example nps('build')
 *
 * @returns The bash command string.
 */
export const nps = (action: string): string => {
    if (isNotDefined(action)) {
        throw new TaskConfigurationError('"nps" expect a defined nps action as argument');
    }
    return `${runBin('nps')} -c ${config.projectType.nps.toolingFile} ${action}`;
};
