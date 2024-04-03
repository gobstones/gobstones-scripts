/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones (TM) is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * This is the the definition for the English language.
 *
 * @module Internal.Translation
 * @author Your Name <yourname@company.com>
 */
import { Locale } from './Locale';

/**
 * The language translations for the english language.
 *
 * @group Internal: Objects
 */
export const en: Locale = {
    program: {
        running: 'Running in development mode'
    },
    cli: {
        descriptions: {
            language: 'The tool`s running language',
            in: 'The input file',
            out: 'The output file',
            tool: 'The most awesome tool',
            version: 'Display the version',
            help: 'Display the help'
        },
        awesome: {
            description: 'Run the awesome command'
        },
        notCool: {
            description: 'Run the notCool command'
        },
        errors: {
            file: 'File does not exist',
            language: 'Locale does not exist'
        }
    }
};
