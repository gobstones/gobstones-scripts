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

/**
 * Returns the string for the bash command to run
 * a multiples set of commands one after the other,
 * that is, the command to run serially a set of commands.
 * This involves joining all commands with '&&'.
 *
 * @param scripts Any number of commands as strings.
 *
 * @example
 * series('eslint', 'jest', 'webpack --env.production')
 * // returns 'eslint && jest && webpack --env.production'
 *
 * @return The bash command string.
 *
 * @group API: Functions
 */
export function serially(...scripts: string[]): string {
    const scriptsLen = scripts.length;
    const tasks = Array(scriptsLen);
    for (let currentKey = 0; currentKey < scriptsLen; currentKey++) {
        tasks[currentKey] = scripts[currentKey];
    }

    return tasks.filter(Boolean).join(' && ');
}
