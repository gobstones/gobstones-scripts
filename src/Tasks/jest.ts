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

import { config } from '../Config';

/**
 * This type represents the options that you can pass to the jest task.
 */
export interface TaskJestOptions {
    /**
     * Whether to use coverage configurations to run the tests. Defaults to true.
     */
    coverage: boolean;
    /**
     * Whether to disable the default thresholds for coverage. Defaults to false.
     */
    noThreshold: boolean;
    /**
     * Whether you want to watch for changes. Defaults to false.
     */
    watch: boolean;
}

/**
 * Returns the string for the bash command  to run
 * jest command with the gobstones-script detected configuration.
 * If any test contains the ".only" call, only run that specific file
 * (This only works on UNIX based systems, not Windows). You may modify
 * the behavior based on arguments.
 *
 * @param options - The nps action to run.
 *
 * @example jest({ coverage: true })
 *
 * @returns The bash command string.
 */
export const jest = (
    options: TaskJestOptions = {
        coverage: true,
        noThreshold: false,
        watch: false
    }
): string => {
    const additionalArgs =
        (options.coverage ? ' --coverage ' : '') +
        (options.noThreshold ? ' --coverageThreshold "{}" ' : '') +
        (options.watch ? ' --watch' : '');
    const jestStringBase =
        `${runBin('jest')} ` +
        `--config ${config.projectType.jest.toolingFile} ` +
        `--rootDir ${config.locations.projectRoot}`;
    return `${jestStringBase} ${additionalArgs}`;
};
