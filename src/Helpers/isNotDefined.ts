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
 * @module Internal.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Answers if the given value is not defined, that is,
 * is undefined, null, or an empty string.
 *
 * @returns true if defined, false otherwise
 *
 * @internal
 * @group Internal: Functions
 */
export const isNotDefined = (value: any): boolean =>
    // eslint-disable-next-line no-null/no-null
    value === undefined || value === null || value === '';
