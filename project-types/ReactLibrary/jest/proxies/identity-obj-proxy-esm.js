// Copied from identity-obj-proxy by Keyan Zhang <root@keyanzhang.com> (http://keya.nz)
// modified behavior when __esModule is required

/* eslint-disable */
var Reflect;  
var idObj;

function checkIsNodeV6OrAbove() {
    if (typeof process === 'undefined') {
        return false;
    }

    return parseInt(process.versions.node.split('.')[0], 10) >= 6;
}

if (!checkIsNodeV6OrAbove()) {
    Reflect = require('harmony-reflect');  
}

idObj = new Proxy(
    {},
    {
        get: function getter(target, key) {
            if (key === '__esModule') {
                return true;
            }
            return key;
        }
    }
);

module.exports = idObj;
