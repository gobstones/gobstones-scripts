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

import { ConfigLocations } from './locations';
import { ConfigPackageManagers } from './package-managers';
import { ConfigProjectTypes, ProjectType } from './project-types';

import { PackageJsonReader } from '../../Helpers/PackageJsonReader';

/**
 * Models the configuration for the current execution
 * environment. That is, the loaded state of execution
 * for this particular run. Is one of the main
 * {@link Config} sections.
 */
export interface ConfigExecutionEnvironment {
    /** The currently in use project type. */
    projectType: ProjectType;
    /** The currently in use package manager. */
    packageManager: keyof ConfigPackageManagers;
    /** Whether the tool should use full paths when displaying any. */
    useFullPaths: boolean;
    /** Whether the tool is running in debug mode. */
    debug: boolean;
    /** Whether the tool is running in test mode. */
    test: boolean;
}

/**
 * Initialize the current execution environment. This is obtained by a
 * mix between possible CLI/API given parameters (such as using -t or -m),
 * given as input, and the information read in the current's project package.json,
 * as well as defaults in case no configuration is provided.
 *
 * Priority is given to CLI/API given, then the package.json configuration
 * and lastly defaults.
 *
 * @param apiGivenProjectType - The CLI/API given value for project type to use, if any.
 * @param apiGivenPackageManager - The CLI/API given value for package manager to use, if any.
 * @param debug - The CLI/API given value to know if we are running in debug mode.
 * @param test - The CLI/API given value to know if we are running in test mode.
 */
export const executionEnvironment = (
    generalConfig: {
        projectTypes: ConfigProjectTypes;
        packageManagers: ConfigPackageManagers;
        locations: ConfigLocations;
    },
    apiGivenProjectType?: string,
    apiGivenPackageManager?: string,
    debug?: boolean,
    test?: boolean
): ConfigExecutionEnvironment => {
    if (apiGivenProjectType && !Object.keys(generalConfig.projectTypes).includes(apiGivenProjectType)) {
        throw new Error('Invalid project type');
    }
    if (apiGivenPackageManager && !Object.keys(generalConfig.packageManagers).includes(apiGivenPackageManager)) {
        throw new Error('Invalid package manager');
    }
    const pkgReader = new PackageJsonReader(path.join(generalConfig.locations.projectRoot, 'package.json'));
    return {
        projectType: (apiGivenProjectType ??
            pkgReader.getValueAt('config.gobstones-scripts.type') ??
            'Library') as keyof ConfigProjectTypes,
        packageManager: (apiGivenPackageManager ??
            pkgReader.getValueAt('config.gobstones-scripts.manager') ??
            'npm') as keyof ConfigPackageManagers,
        useFullPaths: (pkgReader.getValueAt('config.gobstones-scripts.use-full-paths') ?? false) as boolean,
        debug: (debug ?? pkgReader.getValueAt('config.gobstones-scripts.debug') ?? false) as boolean,
        test: (test ?? pkgReader.getValueAt('config.gobstones-scripts.test') ?? false) as boolean
    };
};
