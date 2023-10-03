import { StorybookConfig } from '@storybook/react-webpack5';

let config: StorybookConfig = {
    framework: '@storybook/react-webpack5',
    stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    webpackFinal: async (config, { configType }) => {
        if (config.module && config.module.rules) {
            config.module.rules.push({
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            });
        }
        return config;
    }
};

export default config;
