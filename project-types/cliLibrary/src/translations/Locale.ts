/**
 * This module defines an internal locale definition that any translation
 * should comply to. Change this file according to your needs.
 *
 * @module Internal.Translation
 * @author Your Name <yourname@company.com>
 */

/**
 * Locale is an interface that states the shape a translation for this tool
 * should comply with. Elements of translation object that comply to this
 * interface can be accessed using the elements in the {@link Internal.Translation!} module.
 *
 * @group Internal: Types
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
