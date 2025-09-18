import { MappingRule } from '../../types';

/**
 * Badge and tag-specific mapping rules
 * Tree-shakeable - only import if you need badge/tag skeleton support
 */
export const badgeRules: MappingRule[] = [
    // Small inline elements with tag classes → small rectangle
    {
        match: {
            classContains: 'tag'
        },
        to: {
            shape: 'rect',
            size: { h: '24px' },
            radius: '12px'
        },
        priority: 65
    },

    // Badge classes → small rectangle
    {
        match: {
            classContains: 'badge'
        },
        to: {
            shape: 'rect',
            size: { h: '20px' },
            radius: '10px'
        },
        priority: 65
    },

    // Chip classes
    {
        match: {
            classContains: 'chip'
        },
        to: {
            shape: 'rect',
            size: { h: '32px' },
            radius: '16px'
        },
        priority: 67
    },

    // Label classes
    {
        match: {
            classContains: 'label'
        },
        to: {
            shape: 'rect',
            size: { h: '22px' },
            radius: '4px'
        },
        priority: 63
    },

    // Status indicators
    {
        match: {
            classContains: 'status'
        },
        to: {
            shape: 'circle',
            size: { w: '12px', h: '12px' }
        },
        priority: 68
    },

    // Notification badges
    {
        match: {
            classContains: 'notification'
        },
        to: {
            shape: 'circle',
            size: { w: '16px', h: '16px' }
        },
        priority: 66
    }
];