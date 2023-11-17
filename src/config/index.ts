/**
 * This module contains all the configuration the app need to be aware of
 * to clone projects and to configure them.
 *
 * @internal
 * @module Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { cliLibrary, library, projectTypes, reactLibrary, webLibrary } from './projects';
import { currentDir, useAbsolutePaths, version } from './tool';
import { currentPackageManager, npm, packageManagers, pnpm, yarn } from './package-managers';
import { gobstonesScriptProjectPath, gobstonesScriptRootPath, projectRootPath } from './paths';

import { configurationFiles } from './files';
import { loadedOptions } from './package-json-options';

/**
 * The config object exports all configuration functions in
 * a convenient element.
 *
 * @group Internal API
 */
export const config = {
    currentDir,
    version,
    useAbsolutePaths,
    projectRootPath,
    gobstonesScriptRootPath,
    gobstonesScriptProjectPath,
    packageManagers,
    npm,
    pnpm,
    yarn,
    currentPackageManager,
    loadedOptions,
    projectTypes,
    library,
    cliLibrary,
    webLibrary,
    reactLibrary,
    configurationFiles
};
