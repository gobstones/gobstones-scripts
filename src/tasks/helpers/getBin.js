const config = require('../../config');
const path = require('path');
const fs = require('fs');

/**
 * Get the path to one of the bin scripts exported by a package
 * @param {string} packageName - name of the npm package
 * @param {string} binName=packageName - name of the script
 *
 * @returns {string} path, relative to process.cwd()
 *
 * @internal
 * @static
 * @memberof API.Tasks
 */
function getBin(packageName, binName) {
    try {
        // Attempt to get the bin by resolving the package.json
        const packagePath = require.resolve(`${packageName}/package.json`);
        const concurrentlyDir = path.dirname(packagePath);

        const binFile = getBinFile(packagePath, concurrentlyDir, packageName, binName);
        return {
            binFile,
            mode: 'node'
        };
    } catch (e) {
        // if not found, attempt to find by searching the bin
        // folders of the currently running tool.
        // console.log(e);
        const managerConfig = config[config.loadedOptions.manager];
        for (const modulesFolder of managerConfig.modulesFolders) {
            const packageNamePath = path.join(
                config.projectRootPath,
                modulesFolder,
                packageName,
                'package.json'
            );
            if (fs.existsSync(packageNamePath)) {
                const concurrentlyDir = path.dirname(packageNamePath);
                const binFile = getBinFile(packageNamePath, concurrentlyDir, packageName, binName);
                return {
                    binFile,
                    mode: 'node'
                };
            } else {
                const binFile = path.join(
                    config.projectRootPath,
                    modulesFolder,
                    '.bin',
                    binName || packageName
                );
                if (fs.existsSync(binFile)) {
                    return {
                        binFile,
                        mode: 'sh'
                    };
                }
            }
        }
        return undefined;
    }
}

function getBinFile(packagePath, concurrentlyDir, packageName, binName) {
    const required = require(packagePath);
    let binRelativeToPackage = required.bin;

    if (typeof binRelativeToPackage === 'object') {
        binRelativeToPackage = binRelativeToPackage[binName || packageName];
    }

    const fullBinPath = path.join(concurrentlyDir, binRelativeToPackage);
    return path.relative(process.cwd(), fullBinPath);
}

module.exports = getBin;
