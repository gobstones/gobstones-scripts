/**
 * This module provides tasks that can be imported and used
 * in your personal nps files.
 *
 * @module API.Tasks
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { chmod } from './chmod';
import { concurrently } from './concurrently';
import { copy } from './copy';
import { eslint } from './eslint';
import { ifUnix } from './ifUnix';
import { ifWindows } from './ifWindows';
import { jest } from './jest';
import { move } from './move';
import { nps } from './nps';
import { prettify } from './prettify';
import { remove } from './remove';
import { replace } from './replace';
import { rollup } from './rollup';
import { runBin } from './runBin';
import { serially } from './serially';
import { serve } from './serve';
import { shellEscape } from './shellEscape';
import { storybook } from './storybook';
import { tsc } from './tsc';
import { tsx } from './tsx';
import { typedoc } from './typedoc';
import { vite } from './vite';

/**
 * A convenient object containing all tasks exported.
 *
 * @group Main API
 */
export const tasks = {
    chmod,
    concurrently,
    copy,
    eslint,
    ifUnix,
    ifWindows,
    jest,
    move,
    nps,
    prettify,
    remove,
    replace,
    rollup,
    runBin,
    serially,
    serve,
    shellEscape,
    storybook,
    tsc,
    tsx,
    typedoc,
    vite
};
