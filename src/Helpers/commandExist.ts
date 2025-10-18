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
 * This an adapted copy of the code from mathisonian/command-exists.
 */

import path from 'path';
import process from 'process';

import { exec, execSync } from 'child_process';
import { access, accessSync, constants } from 'fs';

const isUsingWindows: boolean = process.platform === 'win32';

const fileNotExists = (commandName: string, callback: (exists: boolean) => void): void => {
    access(commandName, constants.F_OK, (err: NodeJS.ErrnoException | null) => {
        callback(!err);
    });
};

const fileNotExistsSync = (commandName: string): boolean => {
    try {
        accessSync(commandName, constants.F_OK);
        return false;
    } catch {
        return true;
    }
};

const localExecutable = (commandName: string, callback: (exists: boolean) => void): void => {
    // eslint-disable-next-line no-bitwise
    access(commandName, constants.F_OK | constants.X_OK, (err) => {
        callback(!err);
    });
};

const localExecutableSync = (commandName: string): boolean => {
    try {
        // eslint-disable-next-line no-bitwise
        accessSync(commandName, constants.F_OK | constants.X_OK);
        return true;
    } catch {
        return false;
    }
};

const commandExistsUnix = (
    commandName: string,
    cleanedCommandName: string,
    callback: (exists: boolean) => void
): void => {
    fileNotExists(commandName, (isFile) => {
        if (!isFile) {
            exec(
                'command -v ' +
                    cleanedCommandName +
                    ' 2>/dev/null' +
                    ' && { echo >&1 ' +
                    cleanedCommandName +
                    '; exit 0; }',
                (_, stdout, __) => {
                    callback(!!stdout);
                }
            );
            return;
        }

        localExecutable(commandName, callback);
    });
};

const commandExistsWindows = (
    commandName: string,
    cleanedCommandName: string,
    callback: (exists: boolean) => void
): void => {
    // Regex from Julio from: https://stackoverflow.com/questions/51494579/regex-windows-path-validator
    if (!/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-zA-Z]:)?(?:(?:[^<>:"|?*\n])+(?:\/\/|\/|\\\\|\\)?)+$/m.test(commandName)) {
        callback(false);
        return;
    }
    exec('where ' + cleanedCommandName, (error) => {
        // eslint-disable-next-line no-null/no-null
        if (error !== null) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

const commandExistsUnixSync = (commandName: string, cleanedCommandName: string): boolean => {
    if (fileNotExistsSync(commandName)) {
        try {
            const stdout = execSync(
                'command -v ' +
                    cleanedCommandName +
                    ' 2>/dev/null' +
                    ' && { echo >&1 ' +
                    cleanedCommandName +
                    '; exit 0; }'
            );
            return !!stdout;
        } catch {
            return false;
        }
    }
    return localExecutableSync(commandName);
};

const commandExistsWindowsSync = (commandName: string, cleanedCommandName: string): boolean => {
    // Regex from Julio from: https://stackoverflow.com/questions/51494579/regex-windows-path-validator
    if (!/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-zA-Z]:)?(?:(?:[^<>:"|?*\n])+(?:\/\/|\/|\\\\|\\)?)+$/m.test(commandName)) {
        return false;
    }
    try {
        const stdout = execSync('where ' + cleanedCommandName, { stdio: [] });
        return !!stdout;
    } catch {
        return false;
    }
};

const cleanInput = (text: string): string => {
    if (isUsingWindows) {
        const isPathName = /[\\]/.test(text);
        if (isPathName) {
            const dirname = '"' + path.dirname(text) + '"';
            const basename = '"' + path.basename(text) + '"';
            return dirname + ':' + basename;
        }
        return '"' + text + '"';
    } else {
        if (/[^A-Za-z0-9_/:=-]/.test(text)) {
            text = "'" + text.replace(/'/g, "'\\''") + "'";
            text = text
                .replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
                .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
        }
        return text;
    }
};

/**
 * Answers wether or not a command exists in the system, by calling
 * the callback with a boolean.
 */
export const commandExists = (commandName: string, callback: (exists: boolean) => void): void => {
    const cleanedCommandName = cleanInput(commandName);
    if (isUsingWindows) {
        commandExistsWindows(commandName, cleanedCommandName, callback);
    } else {
        commandExistsUnix(commandName, cleanedCommandName, callback);
    }
};
/**
 * Answers wether or not a command exists in the system, by calling
 * returning a promise that resolves if exists, and gets rejected otherwise.
 */
commandExists.promisify = (commandName: string) =>
    new Promise((resolve, reject) => {
        commandExists(commandName, (exists) => {
            if (exists) {
                resolve(commandName);
            } else {
                reject(new Error('Command does not exist'));
            }
        });
    });
/**
 * Answers wether or not a command exists in the system, by returning a boolean.
 */
commandExists.sync = (commandName: string) => {
    const cleanedCommandName = cleanInput(commandName);
    if (isUsingWindows) {
        return commandExistsWindowsSync(commandName, cleanedCommandName);
    } else {
        return commandExistsUnixSync(commandName, cleanedCommandName);
    }
};
