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
import { $, argv } from 'zx';
import { concurrently } from './_helpers.ts';

/**
 * Run Verdaccio server and publish current version of library to it
 * Use --no-publish to avoid publishing.
 *
 * @hidden
 */
const commands : any = {
    verdaccio: `verdaccio --config ./verdaccio/config.yml`
};

if (argv['publish'] !== false) {
    commands.publish = `sleep 2s && rimraf ./verdaccio/storage/* && npm publish --registry http://localhost:4567`;
}

await concurrently(commands);
