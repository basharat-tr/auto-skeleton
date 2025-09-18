import { describe, it, expect } from 'vitest';

describe('Package Exports', () => {
    it('should export DynamicSkeleton component', async () => {
        const { DynamicSkeleton } = await import('./index');
        expect(DynamicSkeleton).toBeDefined();
        expect(typeof DynamicSkeleton).toBe('function');
    });

    it('should export SkeletonPrimitive component', async () => {
        const { SkeletonPrimitive } = await import('./index');
        expect(SkeletonPrimitive).toBeDefined();
        expect(typeof SkeletonPrimitive).toBe('function');
    });

    it('should export utility functions', async () => {
        const { createSkeletonSpec, skeletonRegistry } = await import('./index');
        expect(createSkeletonSpec).toBeDefined();
        expect(typeof createSkeletonSpec).toBe('function');
        expect(skeletonRegistry).toBeDefined();
        expect(typeof skeletonRegistry).toBe('object');
    });

    it('should export theme utilities', async () => {
        const { SkeletonThemeProvider, createSkeletonTheme } = await import('./index');
        expect(SkeletonThemeProvider).toBeDefined();
        expect(typeof SkeletonThemeProvider).toBe('function');
        expect(createSkeletonTheme).toBeDefined();
        expect(typeof createSkeletonTheme).toBe('function');
    });

    it('should export build-time utilities', async () => {
        const { generateStaticSpec, validateSkeletonSpec } = await import('./index');
        expect(generateStaticSpec).toBeDefined();
        expect(typeof generateStaticSpec).toBe('function');
        expect(validateSkeletonSpec).toBeDefined();
        expect(typeof validateSkeletonSpec).toBe('function');
    });
});