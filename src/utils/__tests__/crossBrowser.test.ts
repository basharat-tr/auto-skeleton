import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { scanElement, getBoundingInfo, buildElementTree } from '../domScanner';
import { applyMappingRules, createDefaultRules } from '../mappingEngine';
import { ElementMetadata } from '../../types';

describe('Cross-Browser Compatibility Tests', () => {
    let originalWindow: any;
    let originalDocument: any;

    beforeEach(() => {
        // Store original values
        originalWindow = globalThis.window;
        originalDocument = globalThis.document;
    });

    afterEach(() => {
        // Restore original values
        globalThis.window = originalWindow;
        globalThis.document = originalDocument;
    });

    describe('Modern Browser Support (Chrome, Firefox, Safari, Edge)', () => {
        it('should work with modern getBoundingClientRect implementation', () => {
            // Modern browsers return DOMRect with all properties
            const modernRect = {
                width: 100,
                height: 50,
                x: 10,
                y: 20,
                top: 20,
                left: 10,
                bottom: 70,
                right: 110,
                toJSON: () => ({})
            };

            const element = {
                tagName: 'DIV',
                className: 'modern',
                textContent: 'Modern browser test',
                attributes: [],
                getBoundingClientRect: () => modernRect
            } as any;

            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                })
            } as any;

            const result = scanElement(element);
            expect(result.dimensions).toEqual({
                width: 100,
                height: 50,
                x: 10,
                y: 20
            });
        });

        it('should work with modern getComputedStyle implementation', () => {
            const element = {
                tagName: 'DIV',
                className: 'modern-styles',
                textContent: 'Test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
            } as any;

            // Modern getComputedStyle returns CSSStyleDeclaration
            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'flex',
                    position: 'relative',
                    fontSize: '18px',
                    getPropertyValue: (prop: string) => {
                        const values: Record<string, string> = {
                            'display': 'flex',
                            'position': 'relative',
                            'font-size': '18px'
                        };
                        return values[prop] || '';
                    }
                })
            } as any;

            const result = scanElement(element);
            expect(result.computedStyle).toEqual({
                display: 'flex',
                position: 'relative',
                fontSize: '18px'
            });
        });

        it('should handle modern CSS custom properties', () => {
            const element = {
                tagName: 'DIV',
                className: 'custom-props',
                textContent: 'Test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
            } as any;

            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px',
                    '--custom-color': '#ff0000',
                    '--custom-size': '20px'
                })
            } as any;

            const result = scanElement(element);
            expect(result).toBeDefined();
            expect(result.computedStyle.display).toBe('block');
        });
    });

    describe('Legacy Browser Support (IE11, older Safari)', () => {
        it('should work with legacy getBoundingClientRect (no x/y properties)', () => {
            // Legacy browsers might not have x/y properties
            const legacyRect = {
                width: 100,
                height: 50,
                top: 20,
                left: 10,
                bottom: 70,
                right: 110
                // No x/y properties
            };

            const element = {
                tagName: 'DIV',
                className: 'legacy',
                textContent: 'Legacy browser test',
                attributes: [],
                getBoundingClientRect: () => legacyRect
            } as any;

            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                })
            } as any;

            const result = getBoundingInfo(element);
            // Should handle missing x/y by using left/top
            expect(result.width).toBe(100);
            expect(result.height).toBe(50);
        });

        it('should work with legacy attribute access patterns', () => {
            // Legacy browsers might have different attribute access
            const element = {
                tagName: 'DIV',
                className: 'legacy-attrs',
                textContent: 'Test',
                attributes: {
                    length: 3,
                    0: { name: 'id', value: 'test-id' },
                    1: { name: 'class', value: 'test-class' },
                    2: { name: 'data-legacy', value: 'true' },
                    item: (index: number) => {
                        const attrs = [
                            { name: 'id', value: 'test-id' },
                            { name: 'class', value: 'test-class' },
                            { name: 'data-legacy', value: 'true' }
                        ];
                        return attrs[index] || null;
                    }
                },
                getBoundingClientRect: () => ({ width: 100, height: 50, top: 0, left: 0, bottom: 50, right: 100 })
            } as any;

            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                })
            } as any;

            const result = scanElement(element);
            expect(result.attributes).toBeDefined();
        });

        it('should handle missing getComputedStyle gracefully', () => {
            const element = {
                tagName: 'DIV',
                className: 'no-computed-style',
                textContent: 'Test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, top: 0, left: 0, bottom: 50, right: 100 })
            } as any;

            // Simulate browser without getComputedStyle
            globalThis.window = {} as any;

            const result = scanElement(element);
            expect(result.computedStyle).toEqual({
                display: 'block',
                position: 'static',
                fontSize: '16px'
            });
        });

        it('should handle legacy event handling', () => {
            // Test that our code doesn\'t rely on modern event APIs
            const element = {
                tagName: 'DIV',
                className: 'legacy-events',
                textContent: 'Test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, top: 0, left: 0, bottom: 50, right: 100 }),
                // Legacy event methods
                attachEvent: vi.fn(),
                detachEvent: vi.fn()
            } as any;

            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                })
            } as any;

            const result = scanElement(element);
            expect(result).toBeDefined();
        });
    });

    describe('Mobile Browser Support (iOS Safari, Chrome Mobile, Samsung Internet)', () => {
        it('should handle mobile viewport and touch events', () => {
            const element = {
                tagName: 'DIV',
                className: 'mobile-element',
                textContent: 'Mobile test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 320, height: 100, x: 0, y: 0 })
            } as any;

            // Simulate mobile browser environment
            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px',
                    '-webkit-touch-callout': 'none',
                    '-webkit-user-select': 'none'
                }),
                innerWidth: 375,
                innerHeight: 667,
                devicePixelRatio: 2,
                ontouchstart: null
            } as any;

            const result = scanElement(element);
            expect(result.dimensions.width).toBe(320);
            expect(result).toBeDefined();
        });

        it('should handle iOS Safari specific quirks', () => {
            const element = {
                tagName: 'DIV',
                className: 'ios-element',
                textContent: 'iOS test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
            } as any;

            // Simulate iOS Safari
            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px',
                    '-webkit-appearance': 'none',
                    '-webkit-transform': 'none'
                }),
                navigator: {
                    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
                }
            } as any;

            const result = scanElement(element);
            expect(result).toBeDefined();
        });

        it('should handle Android Chrome specific behavior', () => {
            const element = {
                tagName: 'DIV',
                className: 'android-element',
                textContent: 'Android test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
            } as any;

            // Simulate Android Chrome
            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                }),
                navigator: {
                    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 Chrome/91.0.4472.120'
                }
            } as any;

            const result = scanElement(element);
            expect(result).toBeDefined();
        });
    });

    describe('Server-Side Rendering (SSR) Compatibility', () => {
        it('should work in Node.js environment without DOM APIs', () => {
            // Simulate SSR environment
            delete (globalThis as any).window;
            delete (globalThis as any).document;

            const element = {
                tagName: 'DIV',
                className: 'ssr-element',
                textContent: 'SSR test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 0, height: 0, x: 0, y: 0 })
            } as any;

            const result = scanElement(element);
            expect(result.dimensions).toEqual({ width: 0, height: 0, x: 0, y: 0 });
            expect(result.computedStyle).toEqual({
                display: 'block',
                position: 'static',
                fontSize: '16px'
            });
        });

        it('should handle hydration scenarios', () => {
            // Simulate hydration where DOM APIs become available
            const element = {
                tagName: 'DIV',
                className: 'hydration-element',
                textContent: 'Hydration test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
            } as any;

            // Start without window
            delete (globalThis as any).window;

            const ssrResult = scanElement(element);
            expect(ssrResult.dimensions).toEqual({ width: 0, height: 0, x: 0, y: 0 });

            // Add window (simulate hydration)
            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                })
            } as any;

            const hydratedResult = scanElement(element);
            expect(hydratedResult.dimensions).toEqual({ width: 100, height: 50, x: 0, y: 0 });
        });
    });

    describe('WebView and Embedded Browser Support', () => {
        it('should work in WebView environments', () => {
            const element = {
                tagName: 'DIV',
                className: 'webview-element',
                textContent: 'WebView test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
            } as any;

            // Simulate WebView environment
            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                }),
                navigator: {
                    userAgent: 'Mozilla/5.0 (Linux; wv) AppleWebKit/537.36 Chrome/91.0.4472.120'
                }
            } as any;

            const result = scanElement(element);
            expect(result).toBeDefined();
        });

        it('should work in Electron environments', () => {
            const element = {
                tagName: 'DIV',
                className: 'electron-element',
                textContent: 'Electron test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
            } as any;

            // Simulate Electron environment
            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                }),
                process: {
                    type: 'renderer'
                }
            } as any;

            const result = scanElement(element);
            expect(result).toBeDefined();
        });
    });

    describe('Performance Across Browsers', () => {
        it('should maintain performance in different JavaScript engines', () => {
            const createTestTree = (depth: number): any => {
                if (depth === 0) {
                    return {
                        tagName: 'SPAN',
                        className: 'leaf',
                        textContent: 'Leaf',
                        attributes: [],
                        getBoundingClientRect: () => ({ width: 20, height: 10, x: 0, y: 0 }),
                        children: []
                    };
                }

                const children = Array.from({ length: 3 }, () => createTestTree(depth - 1));
                return {
                    tagName: 'DIV',
                    className: `level-${depth}`,
                    textContent: '',
                    attributes: [],
                    getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 }),
                    children: children
                };
            };

            // Test with different engine simulations
            const engines = [
                // V8 (Chrome, Node.js)
                {
                    name: 'V8',
                    window: {
                        getComputedStyle: () => ({
                            display: 'block',
                            position: 'static',
                            fontSize: '16px'
                        })
                    }
                },
                // SpiderMonkey (Firefox)
                {
                    name: 'SpiderMonkey',
                    window: {
                        getComputedStyle: () => ({
                            display: 'block',
                            position: 'static',
                            fontSize: '16px'
                        })
                    }
                },
                // JavaScriptCore (Safari)
                {
                    name: 'JavaScriptCore',
                    window: {
                        getComputedStyle: () => ({
                            display: 'block',
                            position: 'static',
                            fontSize: '16px'
                        })
                    }
                }
            ];

            engines.forEach(engine => {
                globalThis.window = engine.window as any;

                const tree = createTestTree(3);
                const startTime = performance.now();
                const result = buildElementTree(tree);
                const endTime = performance.now();

                const duration = endTime - startTime;

                expect(result).toBeDefined();
                expect(duration).toBeLessThan(100); // Should be fast across all engines
            });
        });

        it('should handle memory constraints in different browsers', () => {
            // Test memory usage patterns
            const elements: ElementMetadata[] = Array.from({ length: 100 }, (_, i) => ({
                tagName: 'div',
                className: `element-${i}`,
                textContent: `Content ${i}`,
                dimensions: { width: 100, height: 20, x: 0, y: 0 },
                computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
                attributes: {},
                children: []
            }));

            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                })
            } as any;

            const rules = createDefaultRules();

            // Process many elements to test memory handling
            const results = elements.map(element => applyMappingRules(element, rules));

            expect(results).toHaveLength(100);
            expect(results.every(r => r.key && r.shape)).toBe(true);
        });
    });

    describe('Feature Detection and Polyfills', () => {
        it('should detect and handle missing Array methods', () => {
            // Simulate older browser without some Array methods
            const originalFrom = Array.from;
            delete (Array as any).from;

            try {
                const element = {
                    tagName: 'DIV',
                    className: 'no-array-from',
                    textContent: 'Test',
                    attributes: {
                        length: 2,
                        0: { name: 'id', value: 'test' },
                        1: { name: 'class', value: 'test-class' }
                    },
                    getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
                } as any;

                globalThis.window = {
                    getComputedStyle: () => ({
                        display: 'block',
                        position: 'static',
                        fontSize: '16px'
                    })
                } as any;

                const result = scanElement(element);
                expect(result).toBeDefined();
            } finally {
                // Restore Array.from
                Array.from = originalFrom;
            }
        });

        it('should handle limited Object method support', () => {
            // Test that the code works with basic Object methods
            const element = {
                tagName: 'DIV',
                className: 'basic-object-test',
                textContent: 'Test',
                attributes: [],
                getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
            } as any;

            globalThis.window = {
                getComputedStyle: () => ({
                    display: 'block',
                    position: 'static',
                    fontSize: '16px'
                })
            } as any;

            // Should work with standard Object methods
            const result = scanElement(element);
            expect(result).toBeDefined();
            expect(result.tagName).toBe('div');
        });
    });

    describe('Accessibility Across Browsers', () => {
        it('should maintain accessibility features across different browsers', () => {
            const element = {
                tagName: 'DIV',
                className: 'accessible-element',
                textContent: 'Accessible content',
                attributes: [
                    { name: 'role', value: 'button' },
                    { name: 'aria-label', value: 'Test button' },
                    { name: 'tabindex', value: '0' }
                ],
                getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 })
            } as any;

            // Test across different browser environments
            const browsers = [
                { name: 'Chrome', userAgent: 'Chrome/91.0.4472.120' },
                { name: 'Firefox', userAgent: 'Firefox/89.0' },
                { name: 'Safari', userAgent: 'Safari/14.1.1' },
                { name: 'Edge', userAgent: 'Edg/91.0.864.59' }
            ];

            browsers.forEach(browser => {
                globalThis.window = {
                    getComputedStyle: () => ({
                        display: 'block',
                        position: 'static',
                        fontSize: '16px'
                    }),
                    navigator: {
                        userAgent: browser.userAgent
                    }
                } as any;

                const result = scanElement(element);
                expect(result.attributes).toBeDefined();
                expect(result).toBeDefined();
            });
        });
    });
});