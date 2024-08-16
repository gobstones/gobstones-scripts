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
 * @module Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 * ----------------------------------------------------
 */

import fs from 'fs';

import { logger } from './Logger';

/**
 * A package json reader creates a wrapper around the action of reading a
 * JSON file and accessing the properties of it in an easy fashion.
 * If reading the file fails, the returned reader will always return undefined
 * for any property intended to be read.
 */
export class PackageJsonReader {
    /** The contents of the package.json read file. */
    public _contents: unknown;

    /**
     * Create a new PackageJsonReader.
     *
     * @param packageJsonLocation - The location of the file to read.
     */
    public constructor(packageJsonLocation: string) {
        logger.debug(
            `[PackageJsonReader]: Attempting to read package.json configuration at: ${packageJsonLocation}`,
            'yellow'
        );

        try {
            const contents = fs.readFileSync(packageJsonLocation);
            this._contents = JSON.parse(contents.toString());
        } catch {
            logger.debug(`[PackageJsonReader]: File package.json not found at location`, 'yellow');
            this._contents = undefined;
        }
    }

    /**
     * Return the associated value for a given key.
     */
    public getValueAt(key: string): unknown {
        let nextValue: unknown = this._contents;
        const keys = key.split('.');

        for (const k of keys) {
            nextValue = nextValue ? nextValue[k] : undefined;
        }
        return nextValue;
    }
}
