/**
 * To list all this elements as part of the "models" module,
 * you need to specify the "module" tag. For enything else,
 * this comment may be removed.
 *
 * @module Models
 * @author Your Name <yourname@company.com>
 */

/**
 * The documentation for joinString.
 * Unneeded, but represents the basic structure of files in library.
 *
 * @param main The main string to return
 * @param attached An optional string to attach to the main one.
 *
 * @returns A nice pretty string.
 */
export const joinString = (main: string, attached?: string): string => main + (attached ? ` ${attached}` : '');
