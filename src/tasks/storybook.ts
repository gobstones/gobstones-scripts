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
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { stripIndent } from 'common-tags';

import { runBin } from './runBin';

import { isNotDefined } from '../helpers/isNotDefined';
import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * This type represents the options that you can pass to the storybook start task.
 *
 * @group API: Types
 */
export interface TaskStorybookStartOptions {
    /**
     * The port on which to start storybook's server.
     */
    port: number;
}

/**
 * This type represents the options that you can pass to the storybook build task.
 *
 * @group API: Types
 */
export interface TaskStorybookBuildOptions {
    /**
     * The output directory of the build
     */
    outDir: string;
}

/**
 * The storybook object holds the different ways in you can run a
 * task in storybook, either by running start or build.
 *
 * @group API: Objects
 */
export const storybook = {
    /**
     * Returns the string for the bash command  to run
     * storybook.start with the project's configuration.
     *
     * @param options The options applied when running storybook.
     *
     * @example storybook.start({ port: 3000 })
     *
     * @returns The bash command string.
     */
    start: (options: TaskStorybookStartOptions = { port: 5000 }): string =>
        `${runBin('@storybook/cli', 'sb')} dev -p ${options.port}`,

    /**
     * Returns the string for the bash command  to run
     * storybook.build with default configuration.
     *
     * @param options The options applied when running storybook.
     *
     * @example storybook.build({ outDir: './dist' })
     *
     * @returns The bash command string.
     */
    build(options: TaskStorybookBuildOptions): string {
        if (isNotDefined(options?.outDir)) {
            throw new TaskConfigurationError(
                stripIndent`"storybook.build" expects options with the following signature:
            {
                outDir: str  // The output directory of the storybook
            }`
            );
        }
        return `${runBin('@storybook/cli', 'sb')} build --output-dir ${options.outDir}`;
    }
};
