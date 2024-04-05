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
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { runBin } from './runBin';

/**
 * This type represents the options that you can pass to the vite task.
 *
 * @group API: Types
 */
export interface TaskViteOptions {
    /**
     * The files to watch for changes, if desired.
     */
    watch?: string;
}

/**
 * The bash string to run the vite command in a particular mode.
 *
 * @param mode The mode on which to run.
 * @param options Additional options, not in use currently.
 *
 * @returns The bash command string.
 *
 * @group Internal: Functions
 */
const runVite = (mode: string, options?: TaskViteOptions): string => `${runBin('vite')} ${mode}`;

/**
 * The vite object holds the different ways in you can run a task in vite,
 * either by running dev, build or preview.
 *
 * @group API: Objects
 */
export const vite = {
    /**
     * Returns the string for the bash command  to run
     * vite's dev server with the gobstones-script detected configuration.
     *
     * @param options The options applied when running vite.
     *
     * @example vite.dev()
     *
     * @returns The bash command string.
     */
    dev: (options?: TaskViteOptions): string => runVite('', options),

    /**
     * Returns the string for the bash command  to run
     * vite's build process with default configuration.
     *
     * @param options The options applied when running vite.
     *
     * @example vite.build()
     *
     * @returns The bash command string.
     */
    build: (options?: TaskViteOptions) => runVite('build', options),

    /**
     * Returns the string for the bash command  to run
     * vite's preview server with default configuration.
     *
     * @param options The options applied when running vite.
     *
     * @example vite.preview()
     *
     * @returns The bash command string.
     */
    preview: (options?: TaskViteOptions) => runVite('preview', options)
};
