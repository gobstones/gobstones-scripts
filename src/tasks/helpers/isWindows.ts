/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module Internal.Tasks
 */

/**
 * Answers if the platform is windows.
 *
 * @returns true if Windows, false otherwise
 *
 * @group Internal API Functions
 */
export const isWindows = (): boolean =>
    process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE ?? ''));
