/** @jest-environment jsdom */
import * as matchers from '@testing-library/jest-dom/matchers';

import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';

import Counter from '../../../src/components/Counter';
import React from 'react';

expect.extend(matchers.default);

describe('Counter', () => {
    it('renders the Counter component', () => {
        render(<Counter data-testid="counter" label="Counted {count}" />);
        const counter = screen.getByText('Counted 0');
        expect(counter).toBeInTheDocument();
    });
    it('Do not fails if clicked but no callback provided', () => {
        render(<Counter data-testid="counter" label="Counted {count}" />);
        const counter = screen.getByText('Counted 0');
        act(() => {
            counter.click();
        });
        expect(counter).toBeInTheDocument();
    });
    it('Call the callback function on counter changed', () => {
        let timesCalled = 0;
        const callback: (x: number) => void = jest.fn((x) => {
            timesCalled += 1;
            expect(x).toBe(timesCalled);
        });

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

        expect(timesCalled).toBe(3);
        expect(callback).toHaveBeenCalledTimes(3);
    });
    it('Change text after clicked', () => {
        render(<Counter data-testid="counter" label="Counted {count}" />);
        const counter = screen.getByText('Counted 0');
        act(() => {
            counter.click();
        });
        act(() => {
            counter.click();
        });
        const newCounter = screen.getByText('Counted 2');
        expect(newCounter).toBeInTheDocument();
    });
});
