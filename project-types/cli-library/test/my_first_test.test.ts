import { describe, expect, it } from '@jest/globals';

import { MyClass } from '../src/index';

describe('MyClass', () => {
    describe('awesome', () => {
        describe('No text', () => {
            it('Should return "awesome"', () => {
                expect(new MyClass().awesome()).toBe('awesome');
            });
        });
        describe('A specific text', () => {
            it('Should return "awesome" followed by the text (after a space)', () => {
                expect(new MyClass().awesome('man!')).toBe('awesome man!');
            });
        });
    });

    describe('notCool', () => {
        describe('No text', () => {
            it('Should return "not cool"', () => {
                expect(new MyClass().awesome()).toBe('awesome');
            });
        });
        describe('A specific text', () => {
            it('Should return "not cool" followed by the text (after a space)', () => {
                expect(new MyClass().notCool('johnny')).toBe('not cool johnny');
            });
        });
    });
});
