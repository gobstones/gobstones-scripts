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
 *
 * This is the programmatic API, it allows to perform all the
 * same set of actions from the CLI, but from a module.
 *
 * It also exports the configuration files and the version, as attributes.
 *
 * Finally, it adds the `tools` attribute that exposes some additional
 * tooling that may be used on your `package-scripts.js` if you decide to
 * override it.
 *
 * Refer to README.md for more information.
 *
 * @module API.Main
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
export * from './api';
