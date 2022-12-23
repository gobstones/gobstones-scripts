/**
 * This file is the one that runs when you perform a
 * npm start dev. It just imports some classes and prints
 * the result in console. If you are writing a library you
 * will probably just relay on a re-export in this file,
 * but being able to run it may be useful for debugging.
 *
 * @author Your Name <yourname@company.com>
 */
import { MyClass } from './models';

export * from './models/MyClass';

const globalObject: any = (window || {}) as any;

export const configGlobals = (object) => {
    Object.assign(globalObject, object);
};

configGlobals({
    displayAwesome: (id: string) => {
        const element = document?.getElementById(id);
        if (element) {
            element.innerText = new MyClass().awesome('hola');
        }
    }
});
