/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { ifUnix } from './ifUnix';
import { runBin } from './runBin';

import { config } from '../config';

/**
 * This type represents the options that you can pass to the jest task.
 *
 * @group Main API Types
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
 * @param options The nps action to run.
 *
 * @example jest({ coverage: true })
 *
 * @returns The bash command string.
 *
 * @group Main API Functions
 */
export function jest(
    options: TaskJestOptions = {
        coverage: true,
        noThreshold: false,
        watch: false
    }
): string {
    const additionalArgs =
        (options.coverage ? ' --coverage ' : '') +
        (options.noThreshold ? ' --coverageThreshold "{}" ' : '') +
        (options.watch ? ' --watch' : '');
    const jestStringBase =
        `${runBin('jest')} ` +
        `--config ${config.projectType.jest.toolingFile} ` +
        `--rootDir ${config.locations.projectRoot}`;
    // Only for POSIX Based OSes, if a test file (withing test folder and ending in .test.ts)
    // contains the .only key, run exclusively that file, else, run all files as default behavior.
    // This fixes the ugly behavior of jest running all tests always, even on .only.
    // This does not work in Windows, which defaults to running all tests.
    return ifUnix(
        `if grep -l "\\.only" ${config.locations.projectRoot}/test/{**,.}/*.test.ts; ` +
            `then grep -l "\\.only" ${config.locations.projectRoot}/test/{**,.}/*.test.ts | xargs ` +
            jestStringBase +
            '; ' +
            'else ' +
            jestStringBase +
            additionalArgs +
            '; ' +
            'fi',
        jestStringBase + ' --coverage' + additionalArgs
    );
}
