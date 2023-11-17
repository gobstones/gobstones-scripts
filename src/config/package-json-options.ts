/**
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { currentPackageManager } from './package-managers';
import { getGobstonesScriptConfiguration } from './package-json-config';
import path from 'path';
import { projectRootPath } from './paths';

/**
 * Loads the options from package.json, or autodetect or
 * defaults.
 *
 * @param root The project root file
 *
 * @group Internal API Functions
 */
function optionsFormPackageJson(root: string): ScriptsConfigOptions {
    const detectedOptions = {
        type: 'library',
        manager: 'npm',
        status: { type: 'default', manager: 'default' }
    };
    const values = getGobstonesScriptConfiguration(path.join(root, 'package.json'));
    if (values && values.type) {
        detectedOptions.type = values.type;
        detectedOptions.status.type = 'declared';
    } else {
        detectedOptions.type = 'library';
        detectedOptions.status.type = 'default';
    }
    if (values && values.manager) {
        detectedOptions.manager = values.manager;
        detectedOptions.status.manager = 'declared';
    } else {
        if (currentPackageManager) {
            detectedOptions.manager = currentPackageManager;
            detectedOptions.status.manager = 'detected';
        } else {
            detectedOptions.manager = 'npm';
            detectedOptions.status.manager = 'default';
        }
    }
    return detectedOptions;
}

/**
 * The options that can be passed to configure the tool,
 * after being processed on different locations by the tool.
 *
 * @group Internal API Types
 */
export interface ScriptsConfigOptions {
    /**
     * The type of project to use.
     */
    type: string;
    /**
     * The package manager to use.
     */
    manager: string;
    /**
     * The status of the tools, that is, from which
     * location the configuration was loaded.
     */
    status: {
        /** From where was the project type loaded */
        type: string;
        /** From where was the package manager loaded */
        manager: string;
    };
}

/**
 * The loaded options as detected from package.json.
 *
 * @group Internal API Objects
 */
export const loadedOptions: ScriptsConfigOptions = optionsFormPackageJson(projectRootPath);
