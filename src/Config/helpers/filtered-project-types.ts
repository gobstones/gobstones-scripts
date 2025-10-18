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

import { ConfigProjectTypes, FileName, ProjectType, ProjectTypeDefinition } from './project-types';

/**
 * Models a project type's file definition names, after
 * being filtered by category.
 */
export interface FilteredFilesDefinition {
    /** The list of file names to be copied on init. */
    copiedOnInit: FileName[];
    /** The list of file names to be copied on update. */
    copiedOnUpdate: FileName[];
    /** The list of file names to be copied on eject. */
    copiedOnEject: FileName[];
    /** The list of file names that are part of the tooling
     * and require to identify the configuration file location. */
    toolingFiles: FileName[];
}

/**
 * Models the configuration of filtered file definitions
 * for the different types of project templates that exist.
 * It's one of the main {@link Config} sections.
 */
export interface ConfigFilteredProjectTypes {
    /** The **Library** filtered project type files. */
    Library: FilteredFilesDefinition;
    /** The **cli-Library** filtered project type files. */
    CLILibrary: FilteredFilesDefinition;
    /** The **react-Library** filtered project type files. */
    ReactLibrary: FilteredFilesDefinition;
    /** The **NonCode** project type. */
    NonCode: FilteredFilesDefinition;
}

/**
 * Initialize the different project type definitions with all their
 * file information filtered accordingly to their type.
 */
export const filteredProjectTypes = (projectTypes: ConfigProjectTypes): ConfigFilteredProjectTypes => {
    const retainKeysMatching = (o: ProjectTypeDefinition, onKey: string): FileName[] =>
        (Object.keys(o) as (keyof ProjectTypeDefinition)[]).filter((e) => o[e]?.[onKey]);

    const getProcessed = (projectType: ProjectType): FilteredFilesDefinition => ({
        copiedOnInit: retainKeysMatching(projectTypes[projectType], 'copyOnInit'),
        copiedOnEject: retainKeysMatching(projectTypes[projectType], 'copyOnEject'),
        copiedOnUpdate: retainKeysMatching(projectTypes[projectType], 'copyOnUpdate'),
        toolingFiles: retainKeysMatching(projectTypes[projectType], 'isOverridable')
    });

    const filteredProjects: Partial<ConfigFilteredProjectTypes> = {};

    for (const projectType of Object.keys(projectTypes) as ProjectType[]) {
        filteredProjects[projectType] = getProcessed(projectType);
    }
    return filteredProjects as ConfigFilteredProjectTypes;
};
