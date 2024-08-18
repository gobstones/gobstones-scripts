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

import { isWindows } from '../Helpers/isWindows';

/**
 * Escape a string or array of strings replacing all quote and backslashes
 * appearing in it.
 *
 * @param stringOrArray - The string or array of strings to escape.
 *
 * @returns The escaped string.
 */
export const shellEscape = (stringOrArray: string | string[]): string | string[] => {
    const escapedPathSh = (path: string): string =>
        !/^[A-Za-z0-9_/-]+$/.test(path) ? ("'" + path.replace(/'/g, "'\"'\"'") + "'").replace(/''/g, '') : path;

    const escapedPathWin = (path: string): string =>
        !/^[A-Za-z0-9_/-]+$/.test(path) ? '"' + path.replace(/"/g, '""') + '"' : path;

    const escapedPath: (path: string) => string = isWindows() ? escapedPathWin : escapedPathSh;

    if (typeof stringOrArray === 'string') {
        return escapedPath(stringOrArray);
    } else {
        const ret: string[] = [];
        stringOrArray.forEach((member) => {
            ret.push(escapedPath(member));
        });
        return ret.join(' ');
    }
};
