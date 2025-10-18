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
 * Models the different type of executable scripts.
 */
export type ScriptType = 'node' | 'sh' | 'pwsh' | 'cmd';

/**
 * Models an executable file path and characteristics.
 */
export interface ExecutableScriptDefinition {
    /** The node package name this executable belongs to. */
    packageName: string;
    /** The binary name of this executable. */
    binName: string;
    /** The script file that should be executed. */
    scriptFile: string;
    /** The command to execute in the terminal */
    command: string;
    /**
     * The mode on which such binary file should run.
     * It may be a full JS file to be executed by node,
     * a Shell script supported by any POSIX file,
     * of a Windows "PowerShell" script or "cmd" script.
     */
    mode: ScriptType;
}
