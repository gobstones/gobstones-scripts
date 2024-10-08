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

import { isNotDefined } from '../Helpers/isNotDefined';
import { TaskConfigurationError } from '../Helpers/TaskError';

/**
 * Returns the string for the bash command  to run
 * an node command over a particular string.
 *
 * @param script - The script to run.
 *
 * @example node('myscript.js')
 *
 * @returns The bash command string.
 */
export const node = (script: string): string => {
    if (isNotDefined(script)) {
        throw new TaskConfigurationError('"node" expects a string as argument');
    }
    return `node ${script}`;
};
