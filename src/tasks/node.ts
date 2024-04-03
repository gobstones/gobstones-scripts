/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones (TM) is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * Returns the string for the bash command  to run
 * an node command over a particular string.
 *
 * @param script The script to run.
 *
 * @example node('myscript.js')
 *
 * @returns The bash command string.
 *
 * @group API: Functions
 */
export function node(script: string): string {
    if (isNotDefined(script)) {
        throw new TaskConfigurationError('"node" expects a string as argument');
    }
    return `node ${script}`;
}
