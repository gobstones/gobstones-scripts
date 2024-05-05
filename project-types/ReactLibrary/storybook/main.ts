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
/**
 * @ignore
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    staticDirs: ['./static'],
    stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    // eslint-disable-next-line require-await
    managerHead: async (head, { configType }) => {
        if (configType === 'PRODUCTION') {
            return `
                ${head}
                <base href="/demo/">
                `;
        }
        return head;
    }
};

export default config;
