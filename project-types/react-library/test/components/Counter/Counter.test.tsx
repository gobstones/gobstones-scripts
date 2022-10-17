/** @jest-environment jsdom */
import Counter from '../../../src/components/Counter';
import React from 'react';
import { render } from '@testing-library/react';

describe('Counter', () => {
    test('renders the Counter component', () => {
        render(<Counter label="Counted {count}" />);
    });
});
