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
 * @module Tasks
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * ----------------------------------------------------
 */

import { isWindows } from '../Helpers/isWindows';

/**
 * Takes two scripts as a string and returns the first
 * if the current environment is windows, and the second
 * if the current environment is not windows
 *
 * @param script - the script to use for windows
 * @param altScript - the script to use for non-windows
 *
 * @return The bash script, first if system is windows, second if not.
 */
export const ifWindows = (script: string, altScript: string): string => (isWindows() ? script : altScript);
