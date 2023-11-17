/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { TaskConfigurationError } from './helpers/TaskError';
import { isNotDefined } from './helpers/isNotDefined';
import { runBin } from './runBin';
import { stripIndent } from 'common-tags';

/**
 * This type represents the options that you can pass to the storybook start task.
 *
 * @group Main API Types
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
 * @group Main API Types
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
 * @group Main API Functions
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
                dir: str  // The port on which to run the storybook
            }`
            );
        }
        return `${runBin('@storybook/cli', 'sb')} build --output-dir ${options.outDir}`;
    }
};
