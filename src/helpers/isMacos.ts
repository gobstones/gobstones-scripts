/**
 * @module Internal.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Answers if the platform is macOS.
 *
 * @returns true if MacOS, false otherwise
 *
 * @internal
 * @group Internal: Functions
 */
export const isMacos = (): boolean => process && process.platform === 'darwin';
