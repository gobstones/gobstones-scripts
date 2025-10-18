/** @jest-environment jsdom */
/**
 * @author Your Name <yourname@company.com>
 */

import { afterAll, beforeAll, describe, expect, describe as given, it, jest, describe as when } from '@jest/globals';
import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import { Counter } from '../../../src/Components/Counter';

describe('Counter', () => {
    given('A component with label "Counted {count}" and no callback', () => {
        let component: React.JSX.Element;

        beforeAll(() => {
            component = <Counter data-testid="counter" label="Counted {count}" />;
            render(component);
        });
        afterAll(() => {
            cleanup();
        });
        when('render', () => {
            it('is present in document', () => {
                const counter = screen.getByTestId('counter');
                expect(counter).toBeInTheDocument();
            });
            it('has text that is "Counted 0"', () => {
                const counter = screen.getByTestId('counter');
                expect(counter).toHaveTextContent('Counted 0');
            });
        });
        when('clicked', () => {
            it('increases the counter and reflects it in the text', () => {
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

        beforeAll(() => {
            timesCallbackCalled = 0;
            callback = jest.fn((x) => {
                timesCallbackCalled += 1;
                expect(x).toBe(timesCallbackCalled);
            });
            component = <Counter data-testid="counter" label="Counted {count}" onCountChange={callback} />;
            render(component);
        });
        afterAll(() => {
            cleanup();
        });
        when('render', () => {
            it('is present in document', () => {
                const counter = screen.getByTestId('counter');
                expect(counter).toBeInTheDocument();
            });
            it('has text that is "Counted 0"', () => {
                const counter = screen.getByTestId('counter');
                expect(counter).toHaveTextContent('Counted 0');
            });
        });
        when('clicked', () => {
            it('increases the counter and reflects it in the text', () => {
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
                const counter = screen.getByTestId('counter');
                const timesCallbackCalledBefore = timesCallbackCalled;
                act(() => {
                    counter.click();
                });
                act(() => {
                    counter.click();
                });
                act(() => {
                    counter.click();
                });

                expect(timesCallbackCalled).toBe(timesCallbackCalledBefore + 3);
                expect(callback).toHaveBeenCalledTimes(timesCallbackCalledBefore + 3);
            });
        });
    });
});
