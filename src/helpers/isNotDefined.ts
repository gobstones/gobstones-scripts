/**
 * @module Internal.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Answers if the given value is not defined, that is,
 * is undefined, null, or an empty string.
 *
 * @returns true if defined, false otherwise
 *
 * @internal
 * @group Internal: Functions
 */
export const isNotDefined = (value: any): boolean =>
    // eslint-disable-next-line no-null/no-null
    value === undefined || value === null || value === '';
