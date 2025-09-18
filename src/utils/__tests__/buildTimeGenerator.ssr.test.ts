import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import {
    isServerSide,
    isClientSide,
    generateServerSafeSpec,
    loadStaticSpec,
    hydrateStaticSpec,
    SpecCache,
    globalSpecCache,
    generateSSRSpec,
    serializeSkeletonSpec
} from '../buildTimeGenerator';
import { SkeletonSpec, MappingRule } from '../../types';

// Mock test components
const SimpleComponent = ({ title = 'Test Title' }) =>
    React.createElement('div', { className: 'container' }, [
        React.createElement('h1', { key: 'title' }, title)
    ]);

const ComplexComponent = ({ showButton = true }) =>
    React.createElement('div', { className: 'profile' }, [
        React.createElement('h2', { key: 'name' }, 'John Doe'),
        showButton && React.createElement('button', { key: 'action' }, 'Click me')
    ].filter(Boolean));

describe('buildTimeGenerator SSR', () => {
    describe('environment detection', () => {
        let originalWindow: any;
        let originalDocument: any;

        beforeEach(() => {
            originalWindow = global.window;
            originalDocument = global.document;
        });

        afterEach(() => {
            global.window = originalWindow;
            global.document = originalDocument;
        });

        it('should detect server-side environment when window is undefined', () => {
            delete (global as any).window;
            delete (global as any).document;

            expect(isServerSide()).toBe(true);
            expect(isClientSide()).toBe(false);
        });

        it('should detect client-side environment when window is defined', () => {
            global.window = {} as any;
            global.document = {} as any;

            expect(isServerSide()).toBe(false);
            expect(isClientSide()).toBe(true);
        });
    });

    describe('generateServerSafeSpec', () => {
        it('should generate spec normally when possible', async () => {
            const spec = await generateServerSafeSpec(SimpleComponent);

            expect(spec).toBeDefined();
            expect(spec.children.length).toBeGreaterThan(0);
            expect(spec.rootKey).toContain('root-div');
        });

        it('should use fallback spec when provided and on server', async () => {
            const fallbackSpec: SkeletonSpec = {
                rootKey: 'root-fallback',
                children: [
                    {
                        key: 'fallback-1',
                        shape: 'rect',
                        width: '200px',
                        height: '50px'
                    }
                ],
                layout: 'stack',
                gap: '10px'
            };

            // Mock server environment
            const originalWindow = global.window;
            delete (global as any).window;

            const spec = await generateServerSafeSpec(SimpleComponent, {}, [], fallbackSpec);

            expect(spec).toEqual(fallbackSpec);

            // Restore environment
            global.window = originalWindow;
        });

        it('should create minimal fallback when generation fails and no fallback provided', async () => {
            const ErrorComponent = () => {
                throw new Error('Component error');
            };

            const spec = await generateServerSafeSpec(ErrorComponent);

            expect(spec).toBeDefined();
            expect(spec.rootKey).toBe('root-fallback');
            expect(spec.children).toHaveLength(1);
            expect(spec.children[0].key).toBe('fallback-rect');
            expect(spec.children[0].shape).toBe('rect');
        });

        it('should use fallback spec when generation fails', async () => {
            const ErrorComponent = () => {
                throw new Error('Component error');
            };

            const fallbackSpec: SkeletonSpec = {
                rootKey: 'root-error-fallback',
                children: [
                    {
                        key: 'error-fallback',
                        shape: 'circle',
                        width: '40px',
                        height: '40px'
                    }
                ]
            };

            const spec = await generateServerSafeSpec(ErrorComponent, {}, [], fallbackSpec);

            expect(spec).toEqual(fallbackSpec);
        });
    });

    describe('loadStaticSpec', () => {
        it('should load valid spec from JSON string', () => {
            const originalSpec: SkeletonSpec = {
                rootKey: 'root-test',
                children: [
                    {
                        key: 'test-1',
                        shape: 'rect',
                        width: 100,
                        height: 50
                    }
                ]
            };

            const jsonString = serializeSkeletonSpec(originalSpec);
            const loadedSpec = loadStaticSpec(jsonString);

            expect(loadedSpec).toEqual(originalSpec);
        });

        it('should throw error for invalid JSON', () => {
            expect(() => loadStaticSpec('invalid json')).toThrow('Failed to load static spec');
        });

        it('should throw error for invalid spec structure', () => {
            const invalidSpec = JSON.stringify({
                children: [
                    {
                        key: 'test',
                        shape: 'invalid-shape'
                    }
                ]
            });

            expect(() => loadStaticSpec(invalidSpec)).toThrow('Failed to load static spec');
        });
    });

    describe('hydrateStaticSpec', () => {
        it('should hydrate spec with enhancements', () => {
            const serverSpec: SkeletonSpec = {
                rootKey: 'root-server',
                children: [
                    {
                        key: 'child-1',
                        shape: 'rect',
                        width: 100,
                        height: 50
                    },
                    {
                        key: 'child-2',
                        shape: 'circle',
                        width: '40px',
                        height: '40px'
                    }
                ],
                layout: 'stack'
            };

            const enhancements: Partial<SkeletonSpec> = {
                gap: '12px',
                children: [
                    {
                        key: 'child-1',
                        shape: 'rect',
                        width: 120, // Enhanced width
                        height: 50,
                        className: 'enhanced'
                    }
                ]
            };

            const hydratedSpec = hydrateStaticSpec(serverSpec, enhancements);

            expect(hydratedSpec.gap).toBe('12px');
            expect(hydratedSpec.children[0].width).toBe(120);
            expect(hydratedSpec.children[0].className).toBe('enhanced');
            expect(hydratedSpec.children[1]).toEqual(serverSpec.children[1]); // Unchanged
        });

        it('should work without enhancements', () => {
            const serverSpec: SkeletonSpec = {
                rootKey: 'root-server',
                children: [
                    {
                        key: 'child-1',
                        shape: 'rect',
                        width: 100,
                        height: 50
                    }
                ]
            };

            const hydratedSpec = hydrateStaticSpec(serverSpec);

            expect(hydratedSpec).toEqual(serverSpec);
        });
    });

    describe('SpecCache', () => {
        let cache: SpecCache;

        beforeEach(() => {
            cache = new SpecCache();
        });

        it('should cache and retrieve specs', async () => {
            const spec1 = await cache.getOrGenerate(SimpleComponent, { title: 'Test 1' });
            const spec2 = await cache.getOrGenerate(SimpleComponent, { title: 'Test 1' }); // Same props

            expect(spec1).toEqual(spec2);
            expect(cache.size()).toBe(1);
        });

        it('should generate different specs for different props', async () => {
            const spec1 = await cache.getOrGenerate(SimpleComponent, { title: 'Test 1' });
            const spec2 = await cache.getOrGenerate(SimpleComponent, { title: 'Test 2' });

            expect(spec1).not.toEqual(spec2);
            expect(cache.size()).toBe(2);
        });

        it('should handle component generation errors', async () => {
            const ErrorComponent = () => {
                throw new Error('Component error');
            };

            await expect(cache.getOrGenerate(ErrorComponent)).rejects.toThrow('Component error');
            expect(cache.size()).toBe(0); // Should not cache failed generations
        });

        it('should preload multiple specs', async () => {
            const entries = [
                { component: SimpleComponent, props: { title: 'Title 1' } },
                { component: SimpleComponent, props: { title: 'Title 2' } },
                { component: ComplexComponent, props: { showButton: true } }
            ];

            await cache.preload(entries);

            expect(cache.size()).toBe(3);
        });

        it('should handle preload errors gracefully', async () => {
            const ErrorComponent = () => {
                throw new Error('Component error');
            };

            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const entries = [
                { component: SimpleComponent, props: { title: 'Title 1' } },
                { component: ErrorComponent, props: {} }, // This will fail
                { component: ComplexComponent, props: { showButton: true } }
            ];

            await cache.preload(entries);

            expect(cache.size()).toBe(2); // Only successful ones
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Failed to preload spec'),
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

        it('should clear cache', async () => {
            await cache.getOrGenerate(SimpleComponent, { title: 'Test' });
            expect(cache.size()).toBe(1);

            cache.clear();
            expect(cache.size()).toBe(0);
        });

        it('should export and import cache', async () => {
            await cache.getOrGenerate(SimpleComponent, { title: 'Test 1' });
            await cache.getOrGenerate(ComplexComponent, { showButton: true });

            const exported = cache.export();
            expect(typeof exported).toBe('string');

            const newCache = new SpecCache();
            newCache.import(exported);

            expect(newCache.size()).toBe(2);
        });

        it('should handle import errors', () => {
            expect(() => cache.import('invalid json')).toThrow('Failed to import cache');
        });

        it('should validate specs during import', () => {
            const invalidCacheData = JSON.stringify([
                {
                    key: 'test-key',
                    spec: {
                        children: [
                            {
                                key: 'invalid',
                                shape: 'invalid-shape' // Invalid shape
                            }
                        ]
                    }
                }
            ]);

            cache.import(invalidCacheData);
            expect(cache.size()).toBe(0); // Should not import invalid specs
        });
    });

    describe('globalSpecCache', () => {
        beforeEach(() => {
            globalSpecCache.clear();
        });

        it('should be a shared cache instance', async () => {
            await globalSpecCache.getOrGenerate(SimpleComponent, { title: 'Global Test' });
            expect(globalSpecCache.size()).toBe(1);
        });
    });

    describe('generateSSRSpec', () => {
        beforeEach(() => {
            globalSpecCache.clear();
        });

        it('should use cache by default', async () => {
            const spec1 = await generateSSRSpec(SimpleComponent, { title: 'SSR Test' });
            const spec2 = await generateSSRSpec(SimpleComponent, { title: 'SSR Test' });

            expect(spec1).toEqual(spec2);
            expect(globalSpecCache.size()).toBe(1);
        });

        it('should bypass cache when useCache is false', async () => {
            const spec1 = await generateSSRSpec(SimpleComponent, { title: 'No Cache' }, [], { useCache: false });

            expect(spec1).toBeDefined();
            expect(globalSpecCache.size()).toBe(0);
        });

        it('should fall back to server-safe generation when cache fails', async () => {
            const ErrorComponent = () => {
                throw new Error('Component error');
            };

            const fallbackSpec: SkeletonSpec = {
                rootKey: 'root-ssr-fallback',
                children: [
                    {
                        key: 'ssr-fallback',
                        shape: 'rect',
                        width: '100%',
                        height: '30px'
                    }
                ]
            };

            const spec = await generateSSRSpec(ErrorComponent, {}, [], { fallbackSpec });

            expect(spec).toEqual(fallbackSpec);
            expect(globalSpecCache.size()).toBe(0); // Should not cache failed generations
        });

        it('should work with custom mapping rules', async () => {
            const customRules: MappingRule[] = [
                {
                    match: { tag: 'div' },
                    to: { shape: 'circle', size: { w: '50px', h: '50px' } },
                    priority: 100
                }
            ];

            const spec = await generateSSRSpec(SimpleComponent, {}, customRules);

            expect(spec).toBeDefined();
            expect(globalSpecCache.size()).toBe(1);
        });
    });

    describe('integration scenarios', () => {
        it('should handle complete SSR workflow', async () => {
            // 1. Generate spec on server
            const serverSpec = await generateSSRSpec(ComplexComponent, { showButton: true });

            // 2. Serialize for client
            const serialized = serializeSkeletonSpec(serverSpec);

            // 3. Load on client
            const clientSpec = loadStaticSpec(serialized);

            // 4. Hydrate with client enhancements
            const hydratedSpec = hydrateStaticSpec(clientSpec, {
                gap: '16px',
                children: [
                    {
                        key: clientSpec.children[0]?.key || 'enhanced',
                        shape: 'rect',
                        width: 150,
                        height: 60,
                        className: 'client-enhanced'
                    }
                ]
            });

            expect(hydratedSpec.gap).toBe('16px');
            expect(hydratedSpec.children[0].className).toBe('client-enhanced');
        });

        it('should handle cache persistence across requests', async () => {
            // Clear cache to ensure clean state
            globalSpecCache.clear();

            // Simulate multiple requests
            const spec1 = await generateSSRSpec(SimpleComponent, { title: 'Request 1' });
            const spec2 = await generateSSRSpec(ComplexComponent, { showButton: false });
            const spec3 = await generateSSRSpec(SimpleComponent, { title: 'Request 1' }); // Same as first

            expect(globalSpecCache.size()).toBe(2); // Only unique specs cached
            expect(spec1).toEqual(spec3); // Same spec returned from cache
        });
    });
});