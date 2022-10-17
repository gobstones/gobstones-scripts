/**
 * This module provides tooling to be used on the `package-scripts.js`
 * file, so it helps on writing
 * `nps` commands. Every function exported handles automatically
 * the configuration file to be used when run from inside gobstones-scripts
 *
 * @namespace API.Tools
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const { stripIndent } = require('common-tags');
const path = require('path');
const process = require('process');
const internalAPI = require('./internal_api');

const config = internalAPI.config();

/**
 * Call another nps action.
 *
 * @param {string} action The nps action to run.
 *
 * @example nps('clean.dist')
 * @example nps('build')
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function nps(action) {
    if (!action) {
        throw new Error('"nps" expect a defined nps action as argument');
    }
    return `nps -c ${config.files.nps} ${action}`;
}

/**
 * Run a specific file with tsc.
 *
 * @param {object} options
 * @param {string} options.file The files on which to run "tsc" on.
 *
 * @example tsc({file: './src/index.ts' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function tsc(options) {
    options = options || {};
    if (!options.file) {
        throw Error(stripIndent`"tsc" requires options with the following signature:
                {
                    file: string   // The main file to run
                }`);
    }
    return `tsc  --project ${config.tsConfigFile} ${options.file}`;
}

/**
 * Run a specific file with ts-node.
 *
 * @param {object} options
 * @param {string} options.file The file to run with "ts-node".
 * @param {string} [options.watch] The files to watch for changes, if desired.
 *
 * @example tsNode({file: './src/index.ts', watch: false })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function tsNode(options) {
    options = options || {};
    if (!options.file) {
        throw Error(stripIndent`"tsNode" requires options with the following signature:
                {
                    file: string    // The main file to run
                    watch?: string  // Watch a set of files for changes
                }`);
    }
    return (
        `ts-node-dev ${options.file} --project ${config.tsConfigFile}` +
        (options.watch ? ` --watch ${options.watch}` : ' --ignore-watch')
    );
}

/**
 * Run rollup with default configuration.
 *
 * @param {{watch: ?string}} options
 * @param {string} [options.watch] The files to watch for changes, if desired.
 *
 * @example rollup()
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function rollup(options) {
    options = options || {};
    return (
        `rollup --config ${config.files.rollup}` +
        (options.watch ? ` --watch ${options.watch}` : '')
    );
}

/**
 * Run tests with jest, including coverage. If any test contains an ".only" call,
 * only run that specific file (Only working in UNIXes).
 * You may add additional arguments to jest.
 *
 * @param {object} options
 * @param {boolean} [options.coverage] Use coverage configuration to run the tests.
 * @param {boolean} [options.noThreshold] Disable the default threshold for coverage.
 * @param {boolean} [options.watch] Watch for changes.
 *
 * @example jest({ coverage: true })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function jest(options) {
    options = options || {};
    const additionalArgs =
        (options.coverage ? ' --coverage ' : '') +
        (options.noThreshold ? ' --coverageThreshold "{}" ' : '') +
        (options.watch ? ' --watch' : '');
    const jestStringBase = `jest --config ${config.files.jest} --rootDir ${config.root}`;
    return jestStringBase;
    // Only for POSIX Based OSes, if a test file (withing test folder and ending in .test.ts)
    // contains the .only key, run exclusively that file, else, run all files as default behavior.
    // This fixes the ugly behavior of jest running all tests always, even on .only.
    // This does not work in Windows, which defaults to running all tests.
    return ifNotWindows(
        `if grep -l "\\.only" ${config.root}/test/{**,.}/*.test.ts; ` +
            `then grep -l "\\.only" ${config.root}/test/{**,.}/*.test.ts | xargs ` +
            jestStringBase +
            '; ' +
            'else ' +
            jestStringBase +
            additionalArgs +
            '; ' +
            'fi',
        jestStringBase + ' --coverage' + additionalArgs
    );
}
/**
 * Run typedoc with  default configuration.
 *
 * @param {object} options
 * @param {boolean} [options.watch] Watch for changes.
 *
 * @example typedoc()
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function typedoc(options) {
    options = options || {};
    return (
        `typedoc --options ${config.files.typedoc} --tsconfig ${config.tsConfigFile}` +
        (options.watch ? ` --watch ${options.watch}` : '')
    );
}

/**
 * Run eslint in a set of files. You might pass `true` as a second argument
 * in order to fix default problems.
 *
 * @param {object} options
 * @param {string} options.files The files to lint, may be a glob pattern.
 * @param {boolean} [options.fix] Wether to fix the encountered error when possible.
 *
 * @example eslint({files: './src/** /*' })
 * @example eslint({ files: './src/** /*', fix: true })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function eslint(options) {
    options = options || {};
    if (!options.files) {
        throw Error(stripIndent`"eslint" requires options with the following signature:
                {
                    files: string   // The files to lint, may be a glob pattern
                    fix?: boolean  //Wether to fix the encountered error when possible
                }`);
    }
    return (
        `eslint ${options.files} --format stylish --ext js,jsx,ts,tsx --color` +
        (options.fix ? ' --fix' : '')
    );
}

/**
 * Run prettier in the given files, writing the corrections to the files.
 *
 * @param {object} options
 * @param {string} options.files The files to run prettier on, may be a glob pattern
 *
 * @example prettier({ files: './src/** /*' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function prettier(options) {
    options = options || {};
    if (!options.files) {
        throw Error(stripIndent`"prettier" requires options with the following signature:
                {
                    files: string   // The files to run prettier on, may be a glob pattern
                }`);
    }
    return `prettier --write ${options.files}`;
}

/**
 * Serve a specific folder as a static server.
 *
 * @param {string} directory The directory to serve.
 *
 * @example serve('./coverage')
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function serve(directory) {
    if (!directory) {
        throw new Error('"serve" expect a directory name as argument');
    }
    return `serve ${directory}`;
}

/**
 * Rename or move a file to a new location.
 *
 * @param {options} options
 * @param {string} options.src The file or folder to run rename on
 * @param {string} options.dest The file or folder used as new name.
 *
 * @example rename({ src: './src', dest: './dist' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function rename(options) {
    options = options || {};
    if (!options.src || !options.dest) {
        throw Error(stripIndent`"rename" requires options with the following signature:
                {
                    src: string   // The file or folder to run rename on
                    dest: string  // The file or folder used as new name.
                }`);
    }
    return series(copy({ src: options.src, dest: options.dest }), remove({ files: options.src }));
}

/**
 * Remove (or delete) a set of files.
 *
 * @param {object} options
 * @param {string} options.files The files or folder to delete, may be a glob pattern
 *
 * @example remove({ files: './dist' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function remove(options) {
    options = options || {};
    if (!options.files) {
        throw Error(stripIndent`"remove" requires options with the following signature:
                {
                    files: string   // The files or folder to delete, may be a glob pattern
                }`);
    }
    return rimraf(options.files);
}

/**
 * Copy a file or directory to a new location.
 *
 * @param {object} options "copy" expects options in the form
 * @param {string} options.src The file or folder to copy on
 * @param {string} options.dest The file or folder to copy to
 * @param {boolean} [options.isDir] Whether the copies element is a dir that
 *      should be copied recursively, defaults to false.
 *
 * @example copy({src :'./dist/index.js', dist: './dist/index.es.js'})
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function copy(options) {
    options = options || {};
    if (!options.src || !options.dest) {
        throw Error(stripIndent`"rename" requires options with the following signature:
                {
                    src: string   // The file or folder to copy on
                    dest: string  // The file or folder to copy to
                    isDir: boolean // Whether the copies element is a dir
                                    // that should be copied recursively, defaults to false.
                }`);
    }
    if (options.isDir) {
        return `copyfiles --up 1 ${options.src} ${options.dest}`;
    } else {
        const destFolder = path.dirname(options.dest);
        const destFile = path.basename(options.dest);
        return ncp(`${options.src} ${destFolder} --rename ${destFile}`);
    }
}

/**
 * Perform a chmod on a file or directory, setting specific permissions on it.
 *
 * @param {object} options Options for "chmod" command:
 * @param {string} options.files The files or folder to apply permissions to, may be a glob pattern
 * @param {string} options.mod The permissions to apply
 *
 * @example chmod({  files: './dist/files', mod: '+x' })
 *
 * @returns {string}
 *
 * @static
 * @memberof API.Tools
 */
function chmod(options) {
    options = options || {};
    if (!options.files || !options.mod) {
        throw Error(stripIndent`"chmod" requires options with the following signature:
            {
                files: string   // The files or folder to apply permissions to,
                                // may be a glob pattern
                mod: string     // The permissions to apply
            }`);
    }
    return `chmod ${options.mod} ${options.files}`;
}

/**
 * A concurrent script object
 * @typedef {Object|string} ConcurrentScript
 * @property {string} script - the command to run
 * @property {string} color - the color to use
 *   (see concurrently's docs for valid values)
 */
/**
 * An object of concurrent script objects
 * @typedef {Object.<ConcurrentScript>} ConcurrentScripts
 */
/**
 * Generates a command that uses `concurrently` to run
 * scripts concurrently. Adds a few flags to make it
 * behave as you probably want (like --kill-others-on-fail).
 * In addition, it adds color and labels where the color
 * can be specified or is defaulted and the label is based
 * on the key for the script.
 * @param {ConcurrentScripts} scripts - the scripts to run
 *   note: this function filters out falsy values :)
 * @example
 * // returns a bit of a long script that can vary slightly
 * // based on your environment... :)
 * concurrent({
 *   lint: {
 *     script: 'eslint .',
 *     color: 'bgGreen.white.dim',
 *   },
 *   test: 'jest',
 *   build: {
 *     script: 'webpack'
 *   }
 * })
 * @return {string} - the command to run
 */
function concurrent(scripts) {
    const Object$keys$reduce = Object.keys(scripts).reduce(reduceScripts, {
        colors: [],
        scripts: [],
        names: []
    });
    const colors = Object$keys$reduce.colors;
    const quotedScripts = Object$keys$reduce.scripts;
    const names = Object$keys$reduce.names;

    const flags = [
        '--kill-others-on-fail',
        `--prefix-colors "${colors.join(',')}"`,
        '--prefix "[{name}]"',
        `--names "${names.join(',')}"`,
        shellEscape(quotedScripts)
    ];
    const concurrently = runBin('concurrently', 'concurrently');
    return `${concurrently} ${flags.join(' ')}`;

    function reduceScripts(accumulator, scriptName, index) {
        let scriptObj = scripts[scriptName];
        if (!scriptObj) {
            return accumulator;
        } else if (typeof scriptObj === 'string') {
            scriptObj = { script: scriptObj };
        }
        const defaultColors = [
            'bgBlue.bold',
            'bgMagenta.bold',
            'bgGreen.bold',
            'bgBlack.bold',
            'bgCyan.bold',
            'bgRed.bold',
            'bgWhite.bold',
            'bgYellow.bold'
        ];
        const script = scriptObj.script;
        const scriptObj$color = scriptObj.color;
        const color =
            scriptObj$color === undefined
                ? defaultColors[index % defaultColors.length]
                : scriptObj$color;

        if (!script) {
            return accumulator;
        }
        accumulator.names.push(scriptName);
        accumulator.colors.push(color);
        accumulator.scripts.push(script);
        return accumulator;
    }
}

/**
 * Accepts any number of scripts, filters out any
 * falsy ones and joins them with ' && '
 * @param {...string} scripts - Any number of strings representing commands
 * @example
 * // returns 'eslint && jest && webpack --env.production'
 * series('eslint', 'jest', 'webpack --env.production')
 * @return {string} - the command that will execute the given scripts in series
 */
function series(...scripts) {
    const scriptsLen = scripts.length;
    const tasks = Array(scriptsLen);
    for (let currentKey = 0; currentKey < scriptsLen; currentKey++) {
        tasks[currentKey] = scripts[currentKey];
    }

    return tasks.filter(Boolean).join(' && ');
}

/**
 * Simply calls ifWindows(altScript, script)
 * @param {string} script - the script to use for non-windows
 * @param {string} altScript - the script to use for windows
 * @return {string} - the command to run
 */
function ifNotWindows(script, altScript) {
    return ifWindows(altScript, script);
}

/**
 * Takes two scripts and returns the first if the
 * current environment is windows, and the second
 * if the current environment is not windows
 *
 * @param {string} script - the script to use for windows
 * @param {string} altScript - the script to use for non-windows
 *
 * @return {string} - the command to run
 */
function ifWindows(script, altScript) {
    return isWindows() ? script : altScript;
}

/**
 * Answers if the platform is windows.
 *
 * @returns {boolean}
 */
function isWindows() {
    return process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE));
}

function shellEscape(stringOrArray) {
    const escapePathSh = (path) =>
        !/^[A-Za-z0-9_/-]+$/.test(path)
            ? ("'" + path.replace(/'/g, "'\"'\"'") + "'").replace(/''/g, '')
            : path;

    const escapePathWin = (path) =>
        !/^[A-Za-z0-9_/-]+$/.test(path) ? '"' + path.replace(/"/g, '""') + '"' : path;

    const escapePath = isWindows() ? escapePathWin : escapePathSh;

    if (typeof stringOrArray == 'string') {
        return escapePath(stringOrArray);
    } else {
        const ret = [];
        stringOrArray.forEach(function (member) {
            ret.push(escapePath(member));
        });
        return ret.join(' ');
    }
}

/**
 * Run a binary file with node.
 *
 * @param {string} packageName The package that contains the binary.
 * @param {string} binName The binary to run.
 *
 * @returns {string}
 */
function runBin(packageName, binName) {
    return `node ${getBin(packageName, binName)}`;
}

/**
 * Get the path to one of the bin scripts exported by a package
 * @param {string} packageName - name of the npm package
 * @param {string} binName=packageName - name of the script
 *
 * @returns {string} path, relative to process.cwd()
 */
function getBin(packageName, binName) {
    const packagePath = require.resolve(`${packageName}/package.json`);
    const concurrentlyDir = path.dirname(packagePath);

    const required = require(packagePath);
    let binRelativeToPackage = required.bin;

    if (typeof binRelativeToPackage === 'object') {
        binRelativeToPackage = binRelativeToPackage[binName];
    }

    const fullBinPath = path.join(concurrentlyDir, binRelativeToPackage);
    return path.relative(process.cwd(), fullBinPath);
}

/**
 * Gets a script that uses the rimraf binary.
 *
 * @param {string} args - args to pass to rimraf
 *   learn more from http://npm.im/rimraf
 *
 * @return {string} - the command with the rimraf binary
 */
function rimraf(args) {
    return `${runBin('rimraf')} ${args}`;
}

/**
 * Gets a script that uses the cpy-cli binary. cpy-cli
 * is a dependency of nps-utils, so you don't need to
 * install it yourself.
 * @param {string} args - args to pass to cpy-cli
 *   learn more from http://npm.im/cpy-cli
 * @return {string} - the command with the cpy-cli binary
 */
function ncp(args) {
    return `${runBin('cpy-cli', 'cpy')} ${args}`;
}

module.exports = {
    nps,
    tsc,
    tsNode,
    rollup,
    jest,
    typedoc,
    eslint,
    prettier,
    serve,
    rename,
    remove,
    copy,
    chmod,
    series,
    concurrent
};
