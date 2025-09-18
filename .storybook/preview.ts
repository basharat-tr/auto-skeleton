import type { Preview } from '@storybook/react';
import '../src/components/SkeletonPrimitive.css';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        docs: {
            description: {
                component: 'Dynamic Skeleton Loader components for React applications.',
            },
        },
        a11y: {
            element: '#storybook-root',
            config: {},
            options: {},
            manual: true,
        },
    },
};

export default preview;