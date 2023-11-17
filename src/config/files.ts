/**
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { FileConfiguration, projectTypes } from './projects';
import { gobstonesScriptRootPath, projectRootPath } from './paths';

import fs from 'fs-extra';
import path from 'path';

/**
 * Loads the configuration files that all the tools
 * are going to use when the "run" command is executed.
 *
 * @type The configuration file definition
 *
 * @group Internal API Functions
 */
function loadConfigurationFiles(): ConfigurationFileDefinition {
    const detectedConfigFiles = {};
    for (const projectType in projectTypes) {
        const project = projectTypes[projectType];
        detectedConfigFiles[projectType] = {};
        for (const file of filesRequiringConfiguration) {
            const fileDescriptor = project[file] as FileConfiguration;
            for (let i = 0; i < fileDescriptor.localPath.length; i++) {
                if (fs.existsSync(path.join(projectRootPath, fileDescriptor.projectPath[i]))) {
                    detectedConfigFiles[projectType][file] = path.join(
                        projectRootPath,
                        fileDescriptor.projectPath[i]
                    );
                } else {
                    detectedConfigFiles[projectType][file] = path.join(
                        gobstonesScriptRootPath,
                        'project-types',
                        fileDescriptor.localPath[i]
                    );
                }
            }
            if (file === 'ts') {
                detectedConfigFiles[projectType].tsConfigFile = path.join(
                    path.dirname(detectedConfigFiles[projectType].ts as string),
                    'tsconfig.json'
                );
                detectedConfigFiles[projectType].tsConfigFileLocal = false;
            }
        }
    }
    return detectedConfigFiles;
}

/**
 * The files that are going to be used by the "run" command.
 *
 * @group Internal API Objects
 */
const filesRequiringConfiguration: string[] = ['ts', 'jest', 'rollup', 'typedoc', 'nps'];

/**
 * This type represents the definition of a configuration file.
 * It consists of an object with the project type as key, and a second
 * object as value, that contains itself all the files for such
 * project, with the location as value. The only exception for the
 * second object is the `tsConfigFileLocal` key, that has a boolean value
 * stating if the config file for typescript is presented locally in the project
 * or not.
 *
 * @group Internal API Types
 */
export type ConfigurationFileDefinition = Record<string, Record<string, string | boolean>>;

/**
 * The configuration files detected by the tool.
 *
 * @group Internal API Objects
 */
export const configurationFiles = loadConfigurationFiles();

// Setup the actual tsconfig.json file for each project
if (fs.existsSync(path.join(projectRootPath, 'tsconfig.json'))) {
    for (const projectType in projectTypes) {
        configurationFiles[projectType].tsConfigFile = path.join(projectRootPath, 'tsconfig.json');
        configurationFiles[projectType].tsConfigFileLocal = true;
    }
}
