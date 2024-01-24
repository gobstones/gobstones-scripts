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
 * @group Main API Functions
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
