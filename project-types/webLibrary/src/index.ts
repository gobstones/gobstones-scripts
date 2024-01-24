/* istanbul ignore file */

/**
 * This file is the one that runs when you perform a
 * npm start dev. It just imports some classes and prints
 * the result in console. If you are writing a library you
 * will probably just relay on a re-export in this file,
 * but being able to run it may be useful for debugging.
 *
 * @author Your Name <yourname@company.com>
 */
export * from './models/MyClass';
/*
import globals from './globals';

const globalObject: any = (typeof window !== 'undefined' ? window : {}) as any;

export const configGlobals = (object: any): any => {
    Object.assign(globalObject, object);
};

configGlobals(globals);
*/
