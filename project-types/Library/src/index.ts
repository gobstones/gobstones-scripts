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
 * This file is the one that runs when you perform a
 * npm start dev. It just imports some classes and prints
 * the result in console. If you are writing a library you
 * will probably just relay on a re-export in this file,
 * but being able to run it may be useful for debugging.
 *
 * @ignore
 * @author Your Name <yourname@company.com>
 */

import { MyClass } from './Models';

export * from './Models/MyClass';

// eslint-disable-next-line no-console
console.log(new MyClass().awesome('test'));
