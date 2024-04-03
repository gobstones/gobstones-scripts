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
 * This definitions are useful only as to provide a story for the component,
 * and thus, do not require documentation.
 *
 * @ignore
 * @author Your Name <yourname@company.com>
 */
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Counter } from '../../../src/components/Counter';

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
