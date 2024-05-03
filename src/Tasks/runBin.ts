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
import { config } from '../Config';

/**
 * Get the string representing the command to run on a bash shell
 * for a particular bin executable of a node's package. If no bin
 * is specified, the name of the package is used as executable name.
 * If the binary is not found, it will use an echo that outputs
 * the not found binary file.
 *
 * @param packageName The package that contains the executable.
 * @param binName The executable binary.
 *
 * @returns The string for the command.
 *
 * @group API: Functions
 */
export function runBin(packageName: string, binName?: string): string {
    // Initialize the tool. Will only do it first time getBin is called
    config.init();
    const element = config.getBinary(packageName, binName);
    if (element) return element.command;
    return `echo "Could not find binary ${binName || packageName}"`;
}
