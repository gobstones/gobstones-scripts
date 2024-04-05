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
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { ifWindows } from './ifWindows';

/**
 * Takes two scripts as a string and returns the first
 * if the current environment is unix bases (Linux, MacOS, etc.),
 * and the second if the current environment is not (windows systems)
 *
 * @param script the script to use for unix
 * @param altScript the script to use for windows
 *
 * @return The bash script, first if system is unix, second if windows.
 *
 * @group API: Functions
 */
export const ifUnix = (script: string, altScript: string): string => ifWindows(altScript, script);
