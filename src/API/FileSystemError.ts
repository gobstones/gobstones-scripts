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
 * An error that occurs when there is a problem in the filesystem state.
 *
 * @group Errors
 */
export class FileSystemError extends Error {
    /**
     * Create a FileSystemError.
     *
     * @param message - A string with the error message.
     */
    public constructor(message: string) {
        super(message);
        // It restores the prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
