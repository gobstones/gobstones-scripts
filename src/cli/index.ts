#!/usr/bin/env node
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
 * This is the main script that is run when gobstones-scripts is executed.
 *
 * In itself, the script first checks for files that define the project's
 * toolkit configurations, and creates environment variables for each of those
 * files. It loads the file in the user's project root folder, if present, or
 * loads the default file from the `config` folder.
 *
 * By loading on such files, the user gets sensible defaults for a project, having
 * to do little to no configuration when creating a library or module.
 *
 * The script provides 5 commands, 2 of which are meant to be executed with the
 * gobstones-scripts installed globally, and 3 to be run in a project.
 * - create - Globally. To create a new project with all the configuration.
 * - init   - Globally. To initialize a project in the current folder
 * - update - Locally. Update the configuration of the project file.
 * - eject  - Locally. Extract the configuration files to the project's folder.
 * - run    - Locally. Run an NPS command.
 *
 * It can also show the version information and the loaded configuration with the
 * `--version` and `--config` flags, and show the tool's help with the `--help` flag
 *
 * @internal
 * @module Internal.CLI
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 **/
import { program } from './program';

// Parse the program.
program.parse();
