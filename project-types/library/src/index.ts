/**
 * This file is the one that runs when you perform a
 * npm start dev. It just imports some classes and prints
 * the result in console. If you are writing a library you
 * will probably just relay on a re-export in this file,
 * but being able to run it may be useful for debugging.
 *
 * @ignore
 * @author Your Name <yourname@company.com>
 */
import { MyClass } from './models';
import { intl } from './translations';

export * from './models/MyClass';

// eslint-disable-next-line no-console
console.log(intl.translate('program.running'));
// eslint-disable-next-line no-console
console.log(new MyClass().awesome('hola'));
