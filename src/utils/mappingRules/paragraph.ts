import { MappingRule } from '../../types';

/**
 * Paragraph-specific mapping rules
 * Tree-shakeable - only import if you need paragraph skeleton support
 */
export const paragraphRules: MappingRule[] = [
    // Paragraph elements → multi-line (calculated based on text length)
    {
        match: {
            tag: 'p'
        },
        to: {
            shape: 'line',
            lines: 3, // Default, will be calculated based on text length
            size: { h: '1rem' }
        },
        priority: 60
    },

    // Text content classes
    {
        match: {
            classContains: 'text'
        },
        to: {
            shape: 'line',
            lines: 2,
            size: { h: '1rem' }
        },
        priority: 55
    },

    // Description classes
    {
        match: {
            classContains: 'description'
        },
        to: {
            shape: 'line',
            lines: 3,
            size: { h: '0.875rem' }
        },
        priority: 58
    },

    // Caption classes
    {
        match: {
            classContains: 'caption'
        },
        to: {
            shape: 'line',
            lines: 1,
            size: { h: '0.75rem' }
        },
        priority: 58
    },

    // Lead text
    {
        match: {
            classContains: 'lead'
        },
        to: {
            shape: 'line',
            lines: 2,
            size: { h: '1.125rem' }
        },
        priority: 62
    }
];