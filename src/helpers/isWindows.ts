/**
 * @module Internal.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Answers if the platform is windows.
 *
 * @returns true if Windows, false otherwise
 *
 * @internal
 * @group Internal: Functions
 */
export const isWindows = (): boolean =>
    process && (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE ?? ''));
