#!/usr/bin/env zx
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
import { argv } from 'zx';
import { $, jestConfigPath, projectRootPath, script } from './_helpers.ts';

/**
 * Run the tests, including linting
 */
await script(`clean`, '--coverage');
await script(`lint`);

const flags: string[] = [];
if (argv.coverage !== false) {
    flags.push('--coverage');
}
if (argv.threshold !== false) {
    flags.push('--coverageThreshold');
    flags.push('{}');
}
if (argv.watch) {
    flags.push('--watch');
}

await $`jest --config ${jestConfigPath} --rootDir ${projectRootPath}`;
