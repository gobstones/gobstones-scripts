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

import { runBin } from './runBin';

/**
 * This type represents the options that you can pass to the eslint task.
 */
export interface TaskEslintOptions {
    /**
     * The files on which to run eslint, may be a glob pattern.
     */
    files?: string;
    /**
     * Whether to fix the issues found if possible. Defaults to false.
     */
    fix?: boolean;
    /**
     * The file extensions to consider when running eslint.
     * Defaults to js,jsx,ts,tsx
     */
    extensions?: string;
}

/**
 * Returns the string for the bash command  to run
 * eslint with the project's configuration. And optional
 * `fix` option set to true may be given to attempt
 * fixing all errors instead of just reporting them.
 *
 * @param options - The options applied when running eslint.
 *
 * @example eslint({files: './src/** /*' })
 * @example eslint({ files: './src/** /*', fix: true })
 *
 * @returns The bash command string.
 */
export const eslint = (options: TaskEslintOptions = {}): string => {
    /*
        throw new TaskConfigurationError(
            stripIndent`"eslint" requires options with the following signature:
                {
                    files?: string   // The files to lint, may be a glob pattern
                    fix?: boolean  // Whether to fix the encountered error when possible
                }`
        );
    */
    options.fix = options.fix ?? false;
    return `${runBin('eslint')} ${options.files ?? ''} --format stylish --color` + (options.fix ? ' --fix' : '');
};
