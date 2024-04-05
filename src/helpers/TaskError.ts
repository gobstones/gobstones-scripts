/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * @module Internal.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Represents an exception that is thrown if the configuration
 * for nps is wrongly defined.
 *
 * @internal
 * @group Internal: Errors
 */
export class TaskConfigurationError extends Error {
    public constructor(msg: string) {
        super('nps task configuration error: ' + msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, TaskConfigurationError.prototype);
    }
}
