import { MappingRule } from '../../types';

/**
 * Avatar-specific mapping rules
 * Tree-shakeable - only import if you need avatar skeleton support
 */
export const avatarRules: MappingRule[] = [
    // img.avatar → circle (highest priority for specific case)
    {
        match: {
            tag: 'img',
            classContains: 'avatar'
        },
        to: {
            shape: 'circle',
            size: { w: '40px', h: '40px' }
        },
        priority: 100
    },

    // Profile images
    {
        match: {
            tag: 'img',
            classContains: 'profile'
        },
        to: {
            shape: 'circle',
            size: { w: '48px', h: '48px' }
        },
        priority: 95
    },

    // User images
    {
        match: {
            tag: 'img',
            classContains: 'user'
        },
        to: {
            shape: 'circle',
            size: { w: '32px', h: '32px' }
        },
        priority: 90
    }
];