/**
 *
 * This is the main exported module, it just exports
 * the api, config and tasks modules
 *
 * @module Main
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { api } from './api';
import { config } from './config';
import { tasks } from './tasks';

/**
 * Export all different parts of the tool as default.
 *
 * @group Main API
 */
export default {
    api,
    config,
    tasks,
    version: config.version
};
