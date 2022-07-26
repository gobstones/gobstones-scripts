const chmod = require('././chmod');
const concurrently = require('./concurrently');
const copy = require('./copy');
const eslint = require('./eslint');
const getBin = require('./getBin');
const ifUnix = require('./ifUnix');
const ifWindows = require('./ifWindows');
const jest = require('./jest');
const move = require('./move');
const nps = require('./nps');
const prettify = require('./prettify');
const remove = require('./remove');
const rename = require('./rename');
const rollup = require('./rollup');
const runBin = require('./runBin');
const serially = require('./serially');
const serve = require('./serve');
const shellEscape = require('./shellEscape');
const tsc = require('./tsc');
const tsNode = require('./tsnode');
const typedoc = require('./typedoc');

module.exports = {
    chmod,
    concurrently,
    copy,
    eslint,
    getBin,
    ifUnix,
    ifWindows,
    jest,
    move,
    nps,
    prettify,
    remove,
    rename,
    rollup,
    runBin,
    serially,
    serve,
    shellEscape,
    tsc,
    tsNode,
    typedoc
};
