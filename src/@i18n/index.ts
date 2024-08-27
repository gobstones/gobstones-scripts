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
 * @module i18n
 * @author Your Name <yourname@company.com>
 *
 * @ignore
 * ----------------------------------------------------
 */

import fs from 'fs';
import path from 'path';

import i18next from 'i18next';
import i18nextCLILanguageDetector from 'i18next-cli-language-detector';
import i18nextBackend from 'i18next-fs-backend';

const currentPath = (): string => {
    const currentModuleDir = __dirname || import.meta.dirname;
    const translationsFolder = '@i18n';
    let nextDir = currentModuleDir;
    while (!fs.existsSync(path.join(nextDir, translationsFolder))) {
        nextDir = path.dirname(nextDir);
    }
    return path.join(nextDir, translationsFolder);
};

void i18next
    .use(i18nextCLILanguageDetector)
    .use(i18nextBackend)
    .init({
        initImmediate: false,
        fallbackLng: 'en',
        ns: ['cli'],
        backend: {
            loadPath: currentPath() + '/{{lng}}/{{ns}}.json'
        }
    });

// eslint-disable-next-line import/export
export * from 'i18next';
