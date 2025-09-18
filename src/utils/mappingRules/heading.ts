import { MappingRule } from '../../types';

/**
 * Heading-specific mapping rules
 * Tree-shakeable - only import if you need heading skeleton support
 */
export const headingRules: MappingRule[] = [
    // Heading elements (h1-h6) → single line
    {
        match: {
            tag: 'h1'
        },
        to: {
            shape: 'line',
            lines: 1,
            size: { h: '2rem' }
        },
        priority: 70
    },
    {
        match: {
            tag: 'h2'
        },
        to: {
            shape: 'line',
            lines: 1,
            size: { h: '1.5rem' }
        },
        priority: 70
    },
    {
        match: {
            tag: 'h3'
        },
        to: {
            shape: 'line',
            lines: 1,
            size: { h: '1.25rem' }
        },
        priority: 70
    },
    {
        match: {
            tag: 'h4'
        },
        to: {
            shape: 'line',
            lines: 1,
            size: { h: '1.125rem' }
        },
        priority: 70
    },
    {
        match: {
            tag: 'h5'
        },
        to: {
            shape: 'line',
            lines: 1,
            size: { h: '1rem' }
        },
        priority: 70
    },
    {
        match: {
            tag: 'h6'
        },
        to: {
            shape: 'line',
            lines: 1,
            size: { h: '0.875rem' }
        },
        priority: 70
    },

    // Title classes
    {
        match: {
            classContains: 'title'
        },
        to: {
            shape: 'line',
            lines: 1,
            size: { h: '1.5rem' }
        },
        priority: 65
    },

    // Subtitle classes
    {
        match: {
            classContains: 'subtitle'
        },
        to: {
            shape: 'line',
            lines: 1,
            size: { h: '1.125rem' }
        },
        priority: 65
    }
];