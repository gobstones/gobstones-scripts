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

/**
 * This type represents the options that you can pass to the chmod task.
 */
export interface TaskChangelogOptions {
    /**
     * Generate the changelog from scratch.
     */
    scratch: boolean;
}

/**
 * Returns the string for the bash command  to run
 * a chmod command. Only working in unix based systems.
 *
 * @param options - The options applied when running the chmod.
 *
 * @example chmod({  files: './dist/files', mod: '+x' })
 *
 * @returns The bash command string.
 */
export const changelog = (options: TaskChangelogOptions = { scratch: false }): string =>
    /*
    if (isNotDefined(options.scratch)) {
        throw new TaskConfigurationError(
            stripIndent`"changelog" requires options with the following signature:
            {
                scratch: boolean   // Whether to generate the changelog from scratch.
            }`
        );
    }
    */
    `conventional-changelog -p angular -i CHANGELOG.md -s ${options.scratch ? '-r 0' : ''}`;
