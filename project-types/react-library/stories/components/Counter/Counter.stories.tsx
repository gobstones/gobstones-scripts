import { Meta, StoryFn } from '@storybook/react';

import { Counter } from '../../../src/components/Counter';
import React from 'react';

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

const Template: StoryFn<typeof Counter> = (args) => <Counter {...args} />;

export const Default = Template.bind({});
Default.args = {
    label: 'The counter has been pressed {count} times.'
};
