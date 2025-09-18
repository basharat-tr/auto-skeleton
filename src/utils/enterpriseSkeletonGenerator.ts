/**
 * Enterprise-Grade Build-Time Skeleton Generator
 * For production applications with performance optimization
 */

import React from 'react';
import { SkeletonSpec, SkeletonPrimitiveSpec } from '../types';

// Component skeleton registry for build-time generation
export class SkeletonRegistry {
    private static instance: SkeletonRegistry;
    private registry = new Map<string, SkeletonSpec>();

    static getInstance(): SkeletonRegistry {
        if (!SkeletonRegistry.instance) {
            SkeletonRegistry.instance = new SkeletonRegistry();
        }
        return SkeletonRegistry.instance;
    }

    register(componentName: string, spec: SkeletonSpec): void {
        this.registry.set(componentName, spec);
    }

    get(componentName: string): SkeletonSpec | undefined {
        return this.registry.get(componentName);
    }

    getAll(): Map<string, SkeletonSpec> {
        return new Map(this.registry);
    }

    // Export for build-time persistence
    exportSpecs(): string {
        const specs: Record<string, SkeletonSpec> = {};
        this.registry.forEach((spec, name) => {
            specs[name] = spec;
        });
        return JSON.stringify(specs, null, 2);
    }

    // Import from build-time generated file
    importSpecs(data: string): void {
        try {
            const specs = JSON.parse(data);
            Object.entries(specs).forEach(([name, spec]) => {
                this.registry.set(name, spec as SkeletonSpec);
            });
        } catch (error) {
            console.warn('Failed to import skeleton specs:', error);
        }
    }
}

// Global registry instance
export const skeletonRegistry = SkeletonRegistry.getInstance();

// Pre-defined skeleton specifications for common components
export const SKELETON_SPECS = {
    // Product Card Skeleton
    ProductCard: {
        children: [
            {
                key: 'product-image',
                shape: 'rect' as const,
                width: '100%',
                height: '200px',
                style: { marginBottom: '16px', borderRadius: '8px' }
            },
            {
                key: 'product-title',
                shape: 'line' as const,
                width: '80%',
                height: '1.5rem',
                style: { marginBottom: '8px' }
            },
            {
                key: 'product-description',
                shape: 'line' as const,
                width: '100%',
                height: '1rem',
                lines: 2,
                style: { marginBottom: '12px' }
            },
            {
                key: 'product-price',
                shape: 'line' as const,
                width: '40%',
                height: '1.25rem',
                style: { marginBottom: '16px' }
            },
            {
                key: 'product-button',
                shape: 'rect' as const,
                width: '120px',
                height: '40px',
                style: { borderRadius: '6px' }
            }
        ],
        layout: 'stack' as const
    },

    // User Profile Skeleton
    UserProfile: {
        children: [
            {
                key: 'profile-header',
                shape: 'rect' as const,
                width: '100%',
                height: '120px',
                style: { marginBottom: '16px', borderRadius: '8px' }
            },
            {
                key: 'profile-avatar',
                shape: 'circle' as const,
                width: '80px',
                height: '80px',
                style: { marginBottom: '12px' }
            },
            {
                key: 'profile-name',
                shape: 'line' as const,
                width: '60%',
                height: '1.5rem',
                style: { marginBottom: '8px' }
            },
            {
                key: 'profile-email',
                shape: 'line' as const,
                width: '80%',
                height: '1rem',
                style: { marginBottom: '16px' }
            },
            {
                key: 'profile-stats',
                shape: 'rect' as const,
                width: '100%',
                height: '60px',
                style: { borderRadius: '6px' }
            }
        ],
        layout: 'stack' as const
    },

    // Dashboard Card Skeleton
    DashboardCard: {
        children: [
            {
                key: 'card-header',
                shape: 'line' as const,
                width: '50%',
                height: '1.25rem',
                style: { marginBottom: '16px' }
            },
            {
                key: 'card-metric',
                shape: 'line' as const,
                width: '30%',
                height: '2rem',
                style: { marginBottom: '8px' }
            },
            {
                key: 'card-change',
                shape: 'line' as const,
                width: '40%',
                height: '1rem',
                style: { marginBottom: '16px' }
            },
            {
                key: 'card-chart',
                shape: 'rect' as const,
                width: '100%',
                height: '80px',
                style: { borderRadius: '4px' }
            }
        ],
        layout: 'stack' as const
    },

    // List Item Skeleton
    ListItem: {
        children: [
            {
                key: 'item-avatar',
                shape: 'circle' as const,
                width: '40px',
                height: '40px',
                style: { marginRight: '12px' }
            },
            {
                key: 'item-content',
                shape: 'rect' as const,
                width: '100%',
                height: '40px',
                style: { borderRadius: '4px' }
            }
        ],
        layout: 'row' as const,
        gap: '12px'
    },

    // Form Skeleton
    Form: {
        children: [
            {
                key: 'form-title',
                shape: 'line' as const,
                width: '40%',
                height: '1.5rem',
                style: { marginBottom: '24px' }
            },
            {
                key: 'form-field-1',
                shape: 'rect' as const,
                width: '100%',
                height: '40px',
                style: { marginBottom: '16px', borderRadius: '4px' }
            },
            {
                key: 'form-field-2',
                shape: 'rect' as const,
                width: '100%',
                height: '40px',
                style: { marginBottom: '16px', borderRadius: '4px' }
            },
            {
                key: 'form-field-3',
                shape: 'rect' as const,
                width: '100%',
                height: '80px',
                style: { marginBottom: '24px', borderRadius: '4px' }
            },
            {
                key: 'form-submit',
                shape: 'rect' as const,
                width: '120px',
                height: '40px',
                style: { borderRadius: '6px' }
            }
        ],
        layout: 'stack' as const
    },

    // Table Row Skeleton
    TableRow: {
        children: [
            {
                key: 'col-1',
                shape: 'line' as const,
                width: '20%',
                height: '1rem'
            },
            {
                key: 'col-2',
                shape: 'line' as const,
                width: '30%',
                height: '1rem'
            },
            {
                key: 'col-3',
                shape: 'line' as const,
                width: '25%',
                height: '1rem'
            },
            {
                key: 'col-4',
                shape: 'rect' as const,
                width: '80px',
                height: '32px',
                style: { borderRadius: '4px' }
            }
        ],
        layout: 'row' as const,
        gap: '16px'
    }
} as const;

// Register pre-defined specs
Object.entries(SKELETON_SPECS).forEach(([name, spec]) => {
    skeletonRegistry.register(name, spec);
});

// Utility functions for enterprise use
export const createSkeletonSpec = (
    name: string,
    children: SkeletonPrimitiveSpec[],
    layout: 'stack' | 'row' | 'grid' = 'stack',
    gap?: string
): SkeletonSpec => {
    const spec: SkeletonSpec = {
        children,
        layout,
        ...(gap && { gap })
    };

    skeletonRegistry.register(name, spec);
    return spec;
};

// Get skeleton spec by name with fallback
export const getSkeletonSpec = (name: string): SkeletonSpec => {
    const spec = skeletonRegistry.get(name);
    if (!spec) {
        console.warn(`Skeleton spec '${name}' not found, using default`);
        return SKELETON_SPECS.ProductCard; // Default fallback
    }
    return spec;
};

// Validate skeleton spec
export const validateSkeletonSpec = (spec: SkeletonSpec): boolean => {
    if (!spec.children || !Array.isArray(spec.children)) {
        return false;
    }

    return spec.children.every(child =>
        child.key &&
        child.shape &&
        ['rect', 'circle', 'line'].includes(child.shape)
    );
};

// Build-time spec generator for custom components
export const generateComponentSpec = (
    componentName: string,
    elements: Array<{
        type: 'text' | 'image' | 'button' | 'input' | 'container';
        width?: string;
        height?: string;
        lines?: number;
    }>
): SkeletonSpec => {
    const children: SkeletonPrimitiveSpec[] = elements.map((element, index) => {
        const key = `${componentName}-${element.type}-${index}`;

        switch (element.type) {
            case 'text':
                return {
                    key,
                    shape: 'line' as const,
                    width: element.width || '80%',
                    height: element.height || '1rem',
                    lines: element.lines || 1
                };
            case 'image':
                return {
                    key,
                    shape: 'rect' as const,
                    width: element.width || '100px',
                    height: element.height || '100px'
                };
            case 'button':
                return {
                    key,
                    shape: 'rect' as const,
                    width: element.width || '120px',
                    height: element.height || '40px',
                    style: { borderRadius: '6px' }
                };
            case 'input':
                return {
                    key,
                    shape: 'rect' as const,
                    width: element.width || '100%',
                    height: element.height || '40px',
                    style: { borderRadius: '4px' }
                };
            default:
                return {
                    key,
                    shape: 'rect' as const,
                    width: element.width || '100%',
                    height: element.height || '60px'
                };
        }
    });

    const spec: SkeletonSpec = {
        children,
        layout: 'stack'
    };

    skeletonRegistry.register(componentName, spec);
    return spec;
};