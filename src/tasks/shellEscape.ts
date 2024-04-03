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
import { isWindows } from '../helpers/isWindows';

/**
 * Escape a string or array of strings replacing all quote and backslashes
 * appearing in it.
 *
 * @param stringOrArray The string or array of strings to escape.
 *
 * @returns The escaped string.
 *
 * @group @group API: Functions
 */
export function shellEscape(stringOrArray: string | string[]): string | string[] {
    const escapedPathSh = (path: string): string =>
        !/^[A-Za-z0-9_/-]+$/.test(path) ? ("'" + path.replace(/'/g, "'\"'\"'") + "'").replace(/''/g, '') : path;

    const escapedPathWin = (path: string): string =>
        !/^[A-Za-z0-9_/-]+$/.test(path) ? '"' + path.replace(/"/g, '""') + '"' : path;

    const escapedPath: (path: string) => string = isWindows() ? escapedPathWin : escapedPathSh;

    if (typeof stringOrArray === 'string') {
        return escapedPath(stringOrArray);
    } else {
        const ret: string[] = [];
        stringOrArray.forEach(function (member) {
            ret.push(escapedPath(member));
        });
        return ret.join(' ');
    }
}
