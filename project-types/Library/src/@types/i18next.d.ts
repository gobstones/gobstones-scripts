/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */

/**
 * ----------------------------------------------------
 * @module tstypesdefs
 * @author Your Name <yourname@company.com>
 *
 * @ignore
 * ----------------------------------------------------
 */

// import the original type declarations
// eslint-disable-next-line import/no-extraneous-dependencies
import 'i18next';

// import all namespaces (for the default language, only)
import type application from '../@i18n/en/application.json';

declare module 'i18next' {
    // Extend CustomTypeOptions
    interface CustomTypeOptions {
        defaultNS: 'application';
        resources: {
            application: typeof application;
        };
    }
}
