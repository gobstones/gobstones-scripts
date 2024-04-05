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
