/**
 * @module Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Answers if the platform is macOS.
 *
 * @returns true if MacOS, false otherwise
 *
 * @group Internal: Helpers
 */
export const isMacos = (): boolean => process && process.platform === 'darwin';
