/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module Internal.Tasks
 */

/**
 * Answers if the platform is macOS.
 *
 * @returns true if MacOS, false otherwise
 *
 * @group Internal API Functions
 */
export const isMacos = (): boolean => process && process.platform === 'darwin';
