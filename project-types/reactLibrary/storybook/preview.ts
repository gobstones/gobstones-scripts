/**
 * @ignore
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import { Preview } from '@storybook/react';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/
            }
        },
        layout: 'centered'
    }
};

export default preview;
