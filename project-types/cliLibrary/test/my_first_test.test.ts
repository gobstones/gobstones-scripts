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
