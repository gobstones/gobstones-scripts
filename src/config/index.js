/**
 * This module contains all the configuration the app need to be aware of
 * to clone projects and to configure them.
 *
 * @internal
 * @namespace Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const tool = require('./tool');
const paths = require('./paths');
const packageManagers = require('./package-managers');
const packageJSONOptions = require('./package-json-options');
const projects = require('./projects');
const files = require('./files');

module.exports = {
    currentDir: tool.currentDir,
    version: tool.version,
    useAbsolutePaths: false,
    projectRootPath: paths.projectRootPath,
    gobstonesScriptRootPath: paths.gobstonesScriptRootPath,
    gobstonesScriptProjectPath: paths.gobstonesScriptProjectPath,
    packageManagers: packageManagers.packageManagers,
    npm: packageManagers.npm,
    pnpm: packageManagers.pnpm,
    yarn: packageManagers.yarn,
    loadedOptions: packageJSONOptions.loadedOptions,
    projectTypes: projects.projectTypes,
    library: projects.library,
    'cli-library': projects['cli-library'],
    'web-library': projects['web-library'],
    'react-library': projects['react-library'],
    configurationFiles: files.configurationFiles
};
