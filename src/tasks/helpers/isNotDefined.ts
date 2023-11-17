/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module Internal.Tasks
 */

/**
 * Answers if the given value is not defined, that is,
 * is undefined, null, or an empty string.
 *
 * @returns true if defined, false otherwise
 *
 * @group Internal API Functions
 */
export const isNotDefined = (value: any): boolean =>
    // eslint-disable-next-line no-null/no-null
    value === undefined || value === null || value === '';
