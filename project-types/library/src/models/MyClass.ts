/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * @module API.Models
 * @author Your Name <yourname@company.com>
 */

import { joinString } from '../helpers';

/**
 * The documentation for MyClass.
 *
 * @group API: Classes
 */
export class MyClass {
    /**
     * Return the "awesome" string with and optional string
     * attached to it.
     *
     * @param text A text to attach to the string
     *
     * @returns The awesome made string.
     */
    public awesome(text?: string): string {
        return joinString('awesome', text);
    }
    /**
     * Return the "not cool" string with and optional string
     * attached to it.
     *
     * @param text A text to attach to the string
     *
     * @returns The not cooled string.
     */
    public notCool(text?: string): string {
        return joinString('not cool', text);
    }
}
