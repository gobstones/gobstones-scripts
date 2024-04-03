/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2012-2024
 * Gobstones (TM) is a registered trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3. Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.org/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */
/**
 * @module Components.Counter
 * @author Your Name <yourname@company.com>
 */

import './Counter.css';

import React, { useState } from 'react';

import reactIcon from './reactIcon.svg';

/**
 * Properties for the {@link Counter} component.
 * This properties allows for the configuration of a counter component,
 * both with the label and the `onCountChange` event trigger.
 *
 * @group API: Props
 */
export interface CounterProps {
    /** The label for the counter. It may include any text. If you use
     * "{count}" anywhere in your string, that text will be replaced
     * with the number of times the counter was pressed at the moment.  */
    label: string;

    /**
     * A function that will be called every time the counter is clicked.
     * @param currentCount The current number of times the counter was clicked.
     */
    onCountChange?: (currentCount: number) => void;
}

/**
 * This component represents a counter button with custom label.
 * The "{count}" text inside the label will be replace by the current counter
 * value.
 *
 * Additionally this counter may receive a handler, that will be called each
 * time the counter changes.
 *
 * All in all, it's a simple but complete example that uses props, handlers,
 * state and rendering to display the component.
 *
 * You may take this component as a template to create your own
 * component.
 *
 * @param props The configuration for the component.
 *
 * @group API: Components
 */
export const Counter: React.FunctionComponent<CounterProps> = (props: CounterProps) => {
    const [count, setCount] = useState(0);

    return (
        <button
            onClick={() => {
                setCount(count + 1);
                props.onCountChange?.apply(props.onCountChange, [count + 1]);
            }}
        >
            <img src={reactIcon} alt="button-icon" />
            {props.label.replace('{count}', count.toString())}
        </button>
    );
};
