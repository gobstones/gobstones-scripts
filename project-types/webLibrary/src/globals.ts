/* istanbul ignore file */

/**
 * This file exports the globals that are going to be attached to the
 * window object. If you wish to provide global functions, this will be
 * the way to do it.
 *
 * This file is ignored by test coverage, but do enable it if
 * you add logic, by removing the first comment "istanbul ignore file"
 * at the top of this file. Also be sure to add  tests to validate behavior.
 *
 * @author Your Name <yourname@company.com>
 */

import { MyClass } from './models';

const globals = {
    displayAwesome: (id: string) => {
        const element = document?.getElementById(id);
        if (element) {
            element.innerText = new MyClass().awesome('hola');
        }
    }
};

export default globals;
