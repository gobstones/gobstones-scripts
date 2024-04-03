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
 * This index does a little bit more than just re-exporting.
 * It creates an object with all available translations, as well
 * as a translator instance. Such object allow for using the translations
 * in a simple way when you are using a CLI, as you don't have long
 * lasting state.
 *
 * @module Internal.Translation
 * @author Your Name <yourname@company.com>
 */
import { Translator } from '@gobstones/gobstones-core';

/* Added locales should be imported and added to the Translator object */
import { en } from './en';
import { es } from './es';
import { Locale } from './Locale';

/**
 * The list of all available locales. Add all the locales you define here.
 *
 * @group Internal: Objects
 */
export const availableLocales = { en, es };

/**
 * The internationalization object. Request translations to this object.
 *
 * @group Internal: Objects
 */
export const intl = new Translator<Locale>(availableLocales, 'en');
