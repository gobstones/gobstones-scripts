import './Counter.scss';

import React, { useState } from 'react';

export interface CounterProps {
    label: string;
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
 */
const Counter: React.FunctionComponent<CounterProps> = (props: CounterProps) => {
    const [count, setCount] = useState(0);

    return (
        <button
            onClick={() => {
                setCount(count + 1);
                props.onCountChange?.apply(count);
            }}
        >
            {props.label.replace('{count}', count.toString())}
        </button>
    );
};

export default Counter;
