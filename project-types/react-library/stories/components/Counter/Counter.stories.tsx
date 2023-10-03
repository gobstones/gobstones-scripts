import { Meta, StoryFn } from '@storybook/react';

import Counter from '../../../src/components/Counter';
import React from 'react';

// More on default export:
//      https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Gobstones/Counter',
    component: Counter,
    argTypes: {
        label: {
            description: 'The message in which to display the counter.'
        },
        onCountChange: { action: 'counter updated' }
    }
} as Meta<typeof Counter>;

// More on component templates:
//      https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Counter> = (args) => <Counter {...args} />;

// More on args:
//      https://storybook.js.org/docs/react/writing-stories/args
export const Default = Template.bind({});
Default.args = {
    label: 'The counter has been pressed {count} times.'
};
