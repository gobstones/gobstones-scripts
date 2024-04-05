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
import { runBin } from './runBin';
import { shellEscape } from './shellEscape';

import { TaskConfigurationError } from '../helpers/TaskError';

/**
 * The definition for a concurrently run script.
 *
 * @group API: Types
 */
export interface ConcurrentScriptDefinition {
    /**
     * The actual bash script command to run.
     */
    script: string;
    /**
     * The color to use when prefixing this script.
     */
    color?: string;
}

/**
 * Represent a concurrent script to run.
 *
 @group API: Types
 */
export type ConcurrentScript = ConcurrentScriptDefinition | string;

/**
 * Generates a bash command that uses `concurrently` to run
 * scripts concurrently. Adds a few flags to make it
 * behave as you probably want (like --kill-others-on-fail).
 * In addition, it adds color and labels where the color
 * can be specified or is defaulted and the label is based
 * on the key for the script.
 *
 * @param scripts The scripts to run.
 *
 * @example
 * // returns a bit of a long script that can vary slightly
 * // based on your environment...
 * concurrent({
 *   lint: {
 *     script: 'eslint .',
 *     color: 'bgGreen.white.dim',
 *   },
 *   test: 'jest',
 *   build: {
 *     script: 'webpack'
 *   }
 * })
 *
 * @return The bash command string.
 *
 * @group API: Functions
 */
export function concurrently(scripts: Record<string, ConcurrentScript>): string {
    if (typeof scripts !== 'object') {
        throw new TaskConfigurationError(`concurrently expects an object with names as keys, and commands as values.`);
    }

    interface ReducedScriptDefinition {
        colors: string[];
        scripts: string[];
        names: string[];
    }

    const reduceScripts = (
        accumulator: ReducedScriptDefinition,
        scriptName: string,
        index: number
    ): ReducedScriptDefinition => {
        if (!scripts[scriptName] || (typeof scripts[scriptName] === 'object' && !scripts[scriptName]['script'])) {
            return accumulator;
        }

        const defaultColors = [
            'bgBlue.bold',
            'bgMagenta.bold',
            'bgGreen.bold',
            'bgBlack.bold',
            'bgCyan.bold',
            'bgRed.bold',
            'bgWhite.bold',
            'bgYellow.bold'
        ];

        const scriptObj: ConcurrentScriptDefinition =
            typeof scripts[scriptName] === 'object'
                ? (scripts[scriptName] as ConcurrentScriptDefinition)
                : { script: scripts[scriptName] as string };

        scriptObj.color = scriptObj.color ?? defaultColors[index % defaultColors.length];

        accumulator.names.push(scriptName);
        accumulator.colors.push(scriptObj.color);
        accumulator.scripts.push(scriptObj.script);
        return accumulator;
    };

    const Object$keys$reduce = Object.keys(scripts).reduce(reduceScripts, {
        colors: [],
        scripts: [],
        names: []
    });
    const colors = Object$keys$reduce.colors;
    const quotedScripts = Object$keys$reduce.scripts;
    const names = Object$keys$reduce.names;

    const flags = [
        '--kill-others-on-fail',
        `--prefix-colors "${colors.join(',')}"`,
        '--prefix "[{name}]"',
        `--names "${names.join(',')}"`,
        shellEscape(quotedScripts)
    ];
    const concurrentlyBin = runBin('concurrently', 'concurrently');
    return `${concurrentlyBin} ${flags.join(' ')}`;
}
