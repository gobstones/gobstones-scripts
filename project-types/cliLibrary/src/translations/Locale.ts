/**
 * This module defines an internal locale definition that any translation
 * should comply to. Change this file according to your needs.
 *
 * @author Your Name <yourname@company.com>
 *
 * @module Translation
 */

/**
 * Locale is an interface that states the shape a translation for this tool
 * should comply with. Elements of translation object that comply to this
 * interface can be accessed using the elements in the {@link Translation!} module.
 */
export interface Locale {
    program: {
        running: string;
    };
    cli: {
        descriptions: {
            language: string;
            in: string;
            out: string;
            tool: string;
            version: string;
            help: string;
        };
        awesome: {
            description: string;
        };
        notCool: {
            description: string;
        };
        errors: {
            file: string;
            language: string;
        };
    };
}
