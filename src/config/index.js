/**
 * This module contains all the configuration the app need to be aware of
 * to clone projects and to configure them.
 *
 * @internal
 * @namespace Config
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
const files = require('./files');
const project = require('./project');

module.exports = Object.assign({}, files, project);
