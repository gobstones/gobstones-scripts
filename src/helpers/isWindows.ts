/**
 * @module Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Answers if the platform is windows.
 *
 * @returns true if Windows, false otherwise
 *
 * @group Internal: Helpers
 */
export const isWindows = (): boolean =>
    process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE ?? ''));
