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

import path from 'path';

import { ConfigPackageManagers, PackageManager } from './package-managers';

import { getInUsePackageManager } from '../../Helpers/getInUsePackageManager';
import { isMacos } from '../../Helpers/isMacos';
import { isWindows } from '../../Helpers/isWindows';
import { testServer, version } from '../about';

/**
 * Models the possible values of operating systems.
 */
export type OSType = 'macos' | 'posix' | 'windows';

/**
 * Models the configuration for the system's
 * environment, as detected by node. Is one of the
 * main {@link Config} sections.
 */
export interface ConfigEnvironment {
    /** The running tool version. */
    toolVersion: string;
    /** The running tool test server. */
    toolTestServer: string;
    /** The current working directory, as detected through environment. */
    workingDirectory: string;
    /** The current operating system, as detected through environment. */
    operatingSystem: OSType;
    /** The current package manager, as detected through environment. */
    detectedPackageManager: PackageManager;
}

/** Initialize the current environment from detected information. */
export const environment = (packageManagers: ConfigPackageManagers): ConfigEnvironment => ({
    toolVersion: version,
    toolTestServer: testServer,
    operatingSystem: isWindows() ? 'windows' : isMacos() ? 'macos' : 'posix',
    workingDirectory: process.env.PWD ?? process.cwd() ?? path.resolve('.'),
    detectedPackageManager: getInUsePackageManager(packageManagers, 'npm')
});
