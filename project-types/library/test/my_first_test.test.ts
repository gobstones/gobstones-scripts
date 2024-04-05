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
 * @author Your Name <yourname@company.com>
 */

import { describe, expect, describe as given, it, describe as when, describe as withInput } from '@jest/globals';

import { MyClass } from '../src/index';

describe('MyClass', () => {
    given('any instance', () => {
        when('awesome', () => {
            withInput('No text', () => {
                it('Should return "awesome"', () => {
                    expect(new MyClass().awesome()).toBe('awesome');
                });
            });
            withInput('A specific text', () => {
                it('Should return "awesome" followed by the text (after a space)', () => {
                    expect(new MyClass().awesome('man!')).toBe('awesome man!');
                });
            });
        });

        when('notCool', () => {
            withInput('No text', () => {
                it('Should return "not cool"', () => {
                    expect(new MyClass().awesome()).toBe('awesome');
                });
            });
            withInput('A specific text', () => {
                it('Should return "not cool" followed by the text (after a space)', () => {
                    expect(new MyClass().notCool('johnny')).toBe('not cool johnny');
                });
            });
        });
    });
});
