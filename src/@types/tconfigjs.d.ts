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
 * @module tstypesdefs
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @ignore
 * ----------------------------------------------------
 */

declare module 'tsconfig.js' {
    interface Options {
        root: string;
        ignore?: string[];
        addComments?: 'info' | 'minimal' | 'none';
        extendsStrategy?: 'drop-relative' | 'drop-any' | 'ignore';
        extensions?: string[];
        logLevel?: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
        logFile?: string;
        logToConsole?: boolean;
    }

    function once(options: Options): Promise<void>;
    function watch(options: Options): EventEmitter;
}