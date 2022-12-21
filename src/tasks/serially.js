/**
 * Accepts any number of scripts, filters out any
 * falsy ones and joins them with ' && '
 * @param {...string} scripts - Any number of strings representing commands
 * @example
 * // returns 'eslint && jest && webpack --env.production'
 * series('eslint', 'jest', 'webpack --env.production')
 * @return {string} - the command that will execute the given scripts in series
 *
 * @static
 * @memberof API.Tasks
 */
function serially(...scripts) {
    const scriptsLen = scripts.length;
    const tasks = Array(scriptsLen);
    for (let currentKey = 0; currentKey < scriptsLen; currentKey++) {
        tasks[currentKey] = scripts[currentKey];
    }

    return tasks.filter(Boolean).join(' && ');
}

module.exports = serially;
