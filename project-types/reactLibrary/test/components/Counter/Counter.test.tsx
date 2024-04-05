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
/** @jest-environment jsdom */
/**
 * @author Your Name <yourname@company.com>
 */

import { beforeEach, describe, expect, describe as given, it, describe as when } from '@jest/globals';
import * as matchers from '@testing-library/jest-dom/matchers';
import { act, render, screen } from '@testing-library/react';
import React from 'react';

import { Counter } from '../../../src/components/Counter';

expect.extend(matchers.default);

describe('Counter', () => {
    given('A component with label "Counted {count}" and no callback', () => {
        let component: React.JSX.Element;

        beforeEach(() => {
            component = <Counter data-testid="counter" label="Counted {count}" />;
        });
        when('render', () => {
            it('is present in document', () => {
                render(component);
                const counter = screen.getByTestId('counter');
                expect(counter).toBeInTheDocument();
            });
            it('has text that is "Counted 0"', () => {
                render(component);
                const counter = screen.getByTestId('counter');
                expect(counter).toHaveTextContent('Counted 0');
            });
        });
        when('clicked', () => {
            it('increases the counter and reflects it in the text', () => {
                render(component);
                const counter = screen.getByTestId('counter');
                act(() => {
                    counter.click();
                });
                expect(counter).toHaveTextContent('Counted 1');
                act(() => {
                    counter.click();
                });
                expect(counter).toHaveTextContent('Counted 2');
            });
        });
    });
    given('A component with label "Counted {count}" and a callback', () => {
        let component: React.JSX.Element;
        let timesCallbackCalled: number;
        let callback: (x: number) => void;

        beforeEach(() => {
            timesCallbackCalled = 0;
            callback = jest.fn((x) => {
                timesCallbackCalled += 1;
                expect(x).toBe(timesCallbackCalled);
            });
            component = <Counter data-testid="counter" label="Counted {count}" onCountChange={callback} />;
        });
        when('render', () => {
            it('is present in document', () => {
                render(component);
                const counter = screen.getByTestId('counter');
                expect(counter).toBeInTheDocument();
            });
            it('has text that is "Counted 0"', () => {
                render(component);
                const counter = screen.getByTestId('counter');
                expect(counter).toHaveTextContent('Counted 0');
            });
        });
        when('clicked', () => {
            it('increases the counter and reflects it in the text', () => {
                render(component);
                const counter = screen.getByTestId('counter');
                act(() => {
                    counter.click();
                });
                expect(counter).toHaveTextContent('Counted 1');
                act(() => {
                    counter.click();
                });
                expect(counter).toHaveTextContent('Counted 2');
            });
            it('calls the callback function every time it`s clicked', () => {
                render(<Counter data-testid="counter" label="Counted {count}" onCountChange={callback} />);
                const counter = screen.getByText('Counted 0');
                act(() => {
                    counter.click();
                });
                act(() => {
                    counter.click();
                });
                act(() => {
                    counter.click();
                });

                expect(timesCallbackCalled).toBe(3);
                expect(callback).toHaveBeenCalledTimes(3);
            });
        });
    });
});
