/**
 * To list all this elements as part of the "models" module,
 * you need to specify the "module" tag. For enything else,
 * this comment may be removed.
 *
 * @module Models
 * @author Your Name <yourname@company.com>
 */

import { joinString } from '../helpers';
/**
 * The documentation for MyClass.
 */
export class MyClass {
    /**
     * Return the "awesome" string with and optional string
     * attached to it.
     *
     * @param text A text to attach to the string
     */
    public awesome(text?: string): string {
        return joinString('awesome', text);
    }
    /**
     * Return the "not cool" string with and optional string
     * attached to it.
     *
     * @param text A text to attach to the string
     */
    public notCool(text?: string): string {
        return joinString('not cool', text);
    }
}
