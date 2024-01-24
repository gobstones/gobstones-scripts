/**
 * This index does a little bit more than just re-exporting.
 * It creates an object with all available translations, as well
 * as a translator instance. Such object allow for using the translations
 * in a simple way when you are using a CLI, as you don't have long
 * lasting state.
 *
 * @module Translation
 * @author Your Name <yourname@company.com>
 */
import { Translator } from '@gobstones/gobstones-core';

/* Added locales should be imported and added to the Translator object */
import { en } from './en';
import { es } from './es';
import { Locale } from './Locale';

export const availableLocales = { en, es };

export const intl = new Translator<Locale>(availableLocales, 'en');
