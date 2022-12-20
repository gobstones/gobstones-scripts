const isWindows = require('./helpers/isWindows');

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

module.exports = shellEscape;
