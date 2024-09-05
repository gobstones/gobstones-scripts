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
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * The tool's version number
 *
 * This needs to be here in order to avoid reading the package.json, which
 * is not reliable between different implementations of package managers
 * and that may lead to false readings.
 */
export const version = '0.9.3';

/**
 * The tool's test server address.
 *
 * This line is added to the .npmrc file of projects
 * when they are created in test mode. It can also be used
 * in any project that attempts to use the version from
 * the verdaccio server instead of the regular one.
 */
export const testServer = '@gobstones:registry=http://localhost:4567';
