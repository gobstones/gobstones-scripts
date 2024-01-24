import { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    staticDirs: ['./static'],
    stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
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
