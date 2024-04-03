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
 * @module API.Helpers
 * @author Your Name <yourname@company.com>
 */

/**
 * The documentation for joinString.
 * Unneeded, but represents the basic structure of files in library.
 *
 * @param main The main string to return
 * @param attached An optional string to attach to the main one.
 *
 * @returns A nice pretty string.
 *
 * @group API: Functions
 */
export const joinString = (main: string, attached?: string): string => main + (attached ? ` ${attached}` : '');
