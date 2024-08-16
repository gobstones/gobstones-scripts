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
 * The Internal module contains functions
 * that are used by the Tasks module. The usage of
 * this functions is internal only, and are not exported.
 *
 * @module Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 */
// Avoid re exporting, or we will end up with circular dependencies.
// Module in helpers should be imported directly from their file.
