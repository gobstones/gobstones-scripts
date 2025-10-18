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
 * @module API
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * An error that occurs when attempting to run a particular script command fails.
 *
 * @group Errors
 */
export class CommandExecutionError extends Error {
    /**
     * Create a CommandExecutionError.
     *
     * @param message - A string with the error message.
     */
    public constructor(
        message: string,
        public readonly command: string,
        public readonly exitCode: number
    ) {
        super(message);
        // It restores the prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
