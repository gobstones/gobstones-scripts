/**
 * @module Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import fs from 'fs';

import { logger } from './Logger';

/**
 * A package json reader creates a wrapper around the action of reading a
 * JSON file and accessing the properties of it in an easy fashion.
 * If reading the file fails, the returned reader will always return undefined
 * for any property intended to be read.
 *
 * @group Internal: Types
 */
export class PackageJsonReader {
    public _contents: any;
    public constructor(packageJsonLocation?: string) {
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

    public getValueAt(key: string): any {
        let nextValue = this._contents;
        const keys = key.split('.');

        for (const k of keys) {
            nextValue = nextValue ? nextValue[k] : undefined;
        }
        return nextValue;
    }
}
