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
 * Models the possible values of package managers.
 */
export type PackageManager = keyof ConfigPackageManagers;

/**
 * Models a package manager definition and basic commands and folder it has.
 */
export interface PackageManagerDefinition {
    /** The name of this package manager */
    name: string;
    /** The regular command name. */
    cmd: string;
    /** The command used to install dependencies. */
    install: string;
    /** The command used to execute a binary related to the package manager. */
    run: string;
    /** A set of module folders that the package manager uses. */
    modulesFolders: string[];
    /** A set of binary folders that the package manager uses. */
    binFolders: string[];
}

/**
 * Models the configuration for all the available
 * package managers. It's one of the main {@link Config}
 * sections.
 */
export interface ConfigPackageManagers {
    /** The configuration for **npm**. */
    npm: PackageManagerDefinition;
    /** The configuration for **yarn**. */
    yarn: PackageManagerDefinition;
    /** The configuration for **pnpm**. */
    pnpm: PackageManagerDefinition;
}

/** Initialize the different available package managers. */
export const availablePackageManagers = (): ConfigPackageManagers => ({
    npm: {
        name: 'npm',
        cmd: 'npm',
        install: 'npm install',
        run: 'npx',
        modulesFolders: ['node_modules'],
        binFolders: ['node_modules/bin']
    },
    yarn: {
        name: 'yarn',
        cmd: 'yarn',
        install: 'yarn install',
        run: 'npx',
        modulesFolders: ['node_modules'],
        binFolders: ['node_modules/bin']
    },
    pnpm: {
        name: 'pnpm',
        cmd: 'pnpm',
        install: 'pnpm install',
        run: 'pnpm exec',
        modulesFolders: ['node_modules', 'node_modules/@gobstones/gobstones-scripts/node_modules'],
        binFolders: ['node_modules/bin', 'node_modules/@gobstones/gobstones-scripts/node_modules/bin']
    }
});
