const fs = require('fs-extra');
const path = require('path');
const paths = require('./paths');
const projects = require('./projects');

const filesRequiringConfiguration = ['ts', 'jest', 'rollup', 'typedoc', 'nps'];

let configurationFiles;

function loadConfigurationFiles() {
    if (configurationFiles) {
        return configurationFiles;
    }
    configurationFiles = {};
    for (const projectType of projects.projectTypes) {
        const project = projects[projectType];
        configurationFiles[projectType] = {};
        for (const file of filesRequiringConfiguration) {
            const fileDescriptor = project[file];
            for (let i = 0; i < fileDescriptor.localPath.length; i++) {
                if (
                    fs.existsSync(path.join(paths.projectRootPath, fileDescriptor.projectPath[i]))
                ) {
                    configurationFiles[projectType][file] = path.join(
                        paths.projectRootPath,
                        fileDescriptor.projectPath[i]
                    );
                } else {
                    configurationFiles[projectType][file] = path.join(
                        paths.gobstonesScriptRootPath,
                        'project-types',
                        fileDescriptor.localPath[i]
                    );
                }
            }
            if (file === 'ts') {
                configurationFiles[projectType].tsConfigFile =
                path.join(path.dirname(configurationFiles[projectType].ts), 'tsconfig.json');
                configurationFiles[projectType].tsConfigFileLocal = false;
            }
        }
    }
}
loadConfigurationFiles();

if (fs.existsSync(path.join(paths.projectRootPath, 'tsconfig.json'))) {
    for (const projectType of projects.projectTypes) {
        configurationFiles[projectType].tsConfigFile = path.join(paths.projectRootPath, 'tsconfig.json');
        configurationFiles[projectType].tsConfigFileLocal = true;
    }
}

module.exports = {
    filesRequiringConfiguration,
    configurationFiles
};
