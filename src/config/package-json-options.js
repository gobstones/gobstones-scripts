/**
 * This module contains the configuration pertaining the data loaded
 * from the "package.json" file on the main project, as well as defaulted
 * or auto-detected data in case that is not given.
 *
 * @internal
 * @namespace Config.PackageJSONOptions
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const path = require('path');
const fs = require('fs-extra');
const paths = require('./paths');
const packageManagers = require('./package-managers');

let loadedOptions;

/**
 * Loads the options from package.json, or autodetect or
 * defaults.
 *
 * @type {object}
 *
 * @static
 * @internal
 * @memberof Config.PackageJSONOptions
 */
function optionsFormPackageJson(root) {
    // Return if previously calculated
    if (loadedOptions) {
        return loadedOptions;
    }
    loadedOptions = { status: {} };
    let values = {};
    if (fs.existsSync(path.join(root, 'package.json'))) {
        const contents = fs.readFileSync(path.join(root, 'package.json'));
        const parsedValues = JSON.parse(contents.toString());
        if (parsedValues && parsedValues['config'] && parsedValues['config']['gobstones-scripts']) {
            values = parsedValues['config']['gobstones-scripts'];
        }
    }
    if (values.type) {
        loadedOptions.type = values.type;
        loadedOptions.status.type = 'declared';
    } else {
        loadedOptions.type = 'library';
        loadedOptions.status.type = 'default';
    }
    if (values.manager) {
        loadedOptions.manager = values.manager;
        loadedOptions.status.manager = 'declared';
    } else {
        const currentPackageManager = packageManagers.currentPackageManager;
        if (currentPackageManager) {
            loadedOptions.manager = currentPackageManager;
            loadedOptions.status.manager = 'detected';
        } else {
            loadedOptions.manager = 'npm';
            loadedOptions.status.manager = 'default';
        }
    }
    return loadedOptions;
}
optionsFormPackageJson(paths.projectRootPath);

module.exports = {
    loadedOptions
};
