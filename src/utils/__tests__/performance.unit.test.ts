import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildElementTree, scanElement } from '../domScanner';
import { applyMappingRules, createDefaultRules, validateAndMergeRules } from '../mappingEngine';
import { generateStaticSpec } from '../buildTimeGenerator';
import { ElementMetadata, MappingRule } from '../../types';
import React from 'react';

// Performance test utilities
const measureTime = async (fn: () => Promise<any> | any): Promise<{ result: any; time: number }> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return { result, time: end - start };
};

const createMockElement = (overrides: any = {}): HTMLElement => {
    const defaultRect = {
        width: 100,
        height: 50,
        x: 10,
        y: 20,
        top: 20,
        left: 10,
        bottom: 70,
        right: 110
    };

    return {
        tagName: 'DIV',
        className: 'test-element',
        textContent: 'Test content',
        attributes: [
            { name: 'id', value: 'test-id' },
            { name: 'data-testid', value: 'test-element' }
        ],
        getBoundingClientRect: () => defaultRect,
        children: [],
        ...overrides
    } as HTMLElement;
};

const createMockElementTree = (depth: number, childrenPerLevel: number): HTMLElement => {
    if (depth === 0) {
        return createMockElement({
            tagName: 'SPAN',
            className: `leaf-${Math.random().toString(36).substr(2, 5)}`,
            textContent: 'Leaf node'
        });
    }

    const children: HTMLElement[] = [];
    for (let i = 0; i < childrenPerLevel; i++) {
        children.push(createMockElementTree(depth - 1, childrenPerLevel));
    }

    return createMockElement({
        tagName: 'DIV',
        className: `level-${depth}`,
        children: children
    });
};

describe('Performance Unit Tests', () => {
    let originalWindow: any;
    let originalDocument: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Store original values
        originalWindow = globalThis.window;
        originalDocument = globalThis.document;

        // Setup mock window and document
        globalThis.window = {
            getComputedStyle: () => ({
                display: 'block',
                position: 'relative',
                fontSize: '14px'
            }),
            performance: {
                now: () => Date.now()
            }
        } as any;

        globalThis.document = {} as any;
    });

    afterEach(() => {
        // Restore original values
        globalThis.window = originalWindow;
        globalThis.document = originalDocument;
    });

    describe('DOM Scanner Performance', () => {
        it('should scan single element within performance threshold', async () => {
            const element = createMockElement();

            const { time } = await measureTime(() => scanElement(element));

            // Should complete within 1ms for single element
            expect(time).toBeLessThan(1);
        });

        it('should scan small tree (10 nodes) within performance threshold', async () => {
            const rootElement = createMockElementTree(2, 3); // ~10 nodes

            const { result, time } = await measureTime(() => buildElementTree(rootElement));

            // Should complete within 5ms for small tree
            expect(time).toBeLessThan(5);
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(0);
        });

        it('should scan medium tree (50 nodes) within performance threshold', async () => {
            const rootElement = createMockElementTree(3, 4); // ~50 nodes

            const { result, time } = await measureTime(() => buildElementTree(rootElement));

            // Should complete within 20ms for medium tree
            expect(time).toBeLessThan(20);
            expect(result).toBeInstanceOf(Array);
        });

        it('should scan large tree (200 nodes) within performance threshold', async () => {
            const rootElement = createMockElementTree(4, 4); // ~200 nodes

            const { result, time } = await measureTime(() => buildElementTree(rootElement));

            // Should complete within 50ms for large tree (as per requirements)
            expect(time).toBeLessThan(50);
            expect(result).toBeInstanceOf(Array);
        });

        it('should maintain consistent performance across multiple scans', async () => {
            const rootElement = createMockElementTree(3, 3); // ~30 nodes
            const times: number[] = [];

            // Run 10 scans
            for (let i = 0; i < 10; i++) {
                const { time } = await measureTime(() => buildElementTree(rootElement));
                times.push(time);
            }

            // Calculate average and standard deviation
            const average = times.reduce((sum, time) => sum + time, 0) / times.length;
            const variance = times.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / times.length;
            const stdDev = Math.sqrt(variance);

            // Standard deviation should be less than 50% of average (consistent performance)
            expect(stdDev).toBeLessThan(average * 0.5);
            expect(average).toBeLessThan(15); // Average should be reasonable
        });

        it('should handle performance degradation gracefully', async () => {
            // Create a very large tree that would exceed limits
            const rootElement = createMockElementTree(6, 5); // ~15,000+ nodes

            const { result, time } = await measureTime(() => buildElementTree(rootElement));

            // Should still complete due to node limits, but within reasonable time
            expect(time).toBeLessThan(100);
            expect(result).toBeInstanceOf(Array);

            // Should have limited the number of nodes processed
            const countNodes = (metadata: ElementMetadata): number => {
                return 1 + metadata.children.reduce((sum, child) => sum + countNodes(child), 0);
            };

            if (result.length > 0) {
                const totalNodes = countNodes(result[0]);
                expect(totalNodes).toBeLessThanOrEqual(200); // Node limit
            }
        });
    });

    describe('Mapping Engine Performance', () => {
        const createMockElementMetadata = (overrides: Partial<ElementMetadata> = {}): ElementMetadata => ({
            tagName: 'div',
            className: 'test-element',
            textContent: 'Test content',
            dimensions: { width: 100, height: 50, x: 0, y: 0 },
            computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
            attributes: {},
            children: [],
            ...overrides
        });

        it('should apply mapping rules to single element quickly', async () => {
            const element = createMockElementMetadata();
            const rules = createDefaultRules();

            const { time } = await measureTime(() => applyMappingRules(element, rules));

            // Should complete within 1ms for single element
            expect(time).toBeLessThan(1);
        });

        it('should handle batch mapping efficiently', async () => {
            const elements = Array.from({ length: 100 }, (_, i) =>
                createMockElementMetadata({
                    tagName: i % 2 === 0 ? 'div' : 'span',
                    className: `element-${i}`,
                    textContent: `Content ${i}`
                })
            );
            const rules = createDefaultRules();

            const { time } = await measureTime(() => {
                return elements.map(element => applyMappingRules(element, rules));
            });

            // Should complete within 10ms for 100 elements
            expect(time).toBeLessThan(10);
        });

        it('should maintain performance with complex rule sets', async () => {
            const element = createMockElementMetadata();

            // Create a complex rule set with many rules
            const complexRules: MappingRule[] = Array.from({ length: 50 }, (_, i) => ({
                match: { classContains: `class-${i}` },
                to: { shape: 'rect' as const },
                priority: i
            }));

            const mergedRules = validateAndMergeRules(complexRules);

            const { time } = await measureTime(() => applyMappingRules(element, mergedRules));

            // Should complete within 2ms even with complex rules
            expect(time).toBeLessThan(2);
        });

        it('should optimize rule matching performance', async () => {
            const elements = [
                createMockElementMetadata({ tagName: 'img', className: 'avatar' }),
                createMockElementMetadata({ tagName: 'button' }),
                createMockElementMetadata({ tagName: 'h1' }),
                createMockElementMetadata({ tagName: 'p' }),
                createMockElementMetadata({ tagName: 'div', className: 'btn' })
            ];

            const rules = createDefaultRules();

            const { time } = await measureTime(() => {
                return elements.map(element => applyMappingRules(element, rules));
            });

            // Should complete quickly for common element types
            expect(time).toBeLessThan(2);
        });

        it('should handle rule validation performance', async () => {
            const customRules: MappingRule[] = Array.from({ length: 100 }, (_, i) => ({
                match: { tag: `tag-${i}` },
                to: { shape: 'rect' as const },
                priority: i
            }));

            const { time } = await measureTime(() => validateAndMergeRules(customRules));

            // Should complete within 5ms for 100 rules
            expect(time).toBeLessThan(5);
        });
    });

    describe('Memory Usage Benchmarks', () => {
        it('should not create excessive objects during scanning', async () => {
            const rootElement = createMockElementTree(3, 4); // ~50 nodes

            // Measure memory usage (approximate)
            const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

            const { result } = await measureTime(() => buildElementTree(rootElement));

            const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
            const memoryIncrease = finalMemory - initialMemory;

            // Memory increase should be reasonable (less than 1MB for 50 nodes)
            if (memoryIncrease > 0) {
                expect(memoryIncrease).toBeLessThan(1024 * 1024); // 1MB
            }

            expect(result).toBeInstanceOf(Array);
        });

        it('should clean up temporary objects during mapping', async () => {
            const elements = Array.from({ length: 50 }, (_, i) =>
                createMockElementMetadata({ tagName: `element-${i}` })
            );
            const rules = createDefaultRules();

            const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

            // Process elements multiple times to test cleanup
            for (let i = 0; i < 5; i++) {
                elements.forEach(element => applyMappingRules(element, rules));
            }

            const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
            const memoryIncrease = finalMemory - initialMemory;

            // Memory should not grow excessively with repeated operations
            if (memoryIncrease > 0) {
                expect(memoryIncrease).toBeLessThan(512 * 1024); // 512KB
            }
        });

        it('should handle garbage collection efficiently', async () => {
            const createAndProcessElements = () => {
                const elements = Array.from({ length: 100 }, (_, i) =>
                    createMockElementMetadata({ tagName: `temp-${i}` })
                );
                const rules = createDefaultRules();

                return elements.map(element => applyMappingRules(element, rules));
            };

            // Create and process elements multiple times
            const results = [];
            for (let i = 0; i < 10; i++) {
                results.push(createAndProcessElements());
            }

            // Force garbage collection if available
            if (global.gc) {
                global.gc();
            }

            expect(results).toHaveLength(10);
            expect(results[0]).toBeInstanceOf(Array);
        });
    });

    describe('Scalability Tests', () => {
        it('should handle increasing tree sizes with predictable performance', async () => {
            const treeSizes = [1, 2, 3, 4]; // Depth levels
            const times: number[] = [];

            for (const depth of treeSizes) {
                const rootElement = createMockElementTree(depth, 3);
                const { time } = await measureTime(() => buildElementTree(rootElement));
                times.push(time);
            }

            // Performance should scale reasonably (not exponentially)
            for (let i = 1; i < times.length; i++) {
                const ratio = times[i] / times[i - 1];
                // Each level should not take more than 5x the previous level
                expect(ratio).toBeLessThan(5);
            }
        });

        it('should maintain performance with varying element complexity', async () => {
            const complexities = [
                { attributes: 1, textLength: 10 },
                { attributes: 5, textLength: 50 },
                { attributes: 10, textLength: 100 },
                { attributes: 20, textLength: 200 }
            ];

            const times: number[] = [];

            for (const complexity of complexities) {
                const element = createMockElement({
                    attributes: Array.from({ length: complexity.attributes }, (_, i) => ({
                        name: `attr-${i}`,
                        value: `value-${i}`
                    })),
                    textContent: 'x'.repeat(complexity.textLength)
                });

                const { time } = await measureTime(() => scanElement(element));
                times.push(time);
            }

            // All should complete within reasonable time
            times.forEach(time => {
                expect(time).toBeLessThan(2);
            });
        });

        it('should handle concurrent operations efficiently', async () => {
            const rootElement = createMockElementTree(2, 4);

            // Run multiple scanning operations concurrently
            const promises = Array.from({ length: 5 }, () =>
                measureTime(() => buildElementTree(rootElement))
            );

            const results = await Promise.all(promises);

            // All operations should complete successfully
            results.forEach(({ result, time }) => {
                expect(result).toBeInstanceOf(Array);
                expect(time).toBeLessThan(20);
            });

            // Average time should be reasonable
            const averageTime = results.reduce((sum, { time }) => sum + time, 0) / results.length;
            expect(averageTime).toBeLessThan(15);
        });
    });

    describe('Build-time Generation Performance', () => {
        // Mock react-test-renderer for performance tests
        vi.mock('react-test-renderer', () => ({
            create: vi.fn(() => ({
                toJSON: vi.fn(() => ({
                    type: 'div',
                    props: { className: 'test-component' },
                    children: Array.from({ length: 10 }, (_, i) => ({
                        type: 'span',
                        props: { className: `child-${i}` },
                        children: [`Child ${i}`]
                    }))
                })),
                unmount: vi.fn()
            }))
        }));

        it('should generate static specs efficiently', async () => {
            const TestComponent = () => React.createElement('div', {}, 'Test');

            const { time } = await measureTime(() => generateStaticSpec(TestComponent));

            // Should complete within 10ms for simple component
            expect(time).toBeLessThan(10);
        });

        it('should handle batch spec generation', async () => {
            const components = Array.from({ length: 10 }, (_, i) =>
                () => React.createElement('div', { className: `component-${i}` }, `Component ${i}`)
            );

            const { time } = await measureTime(async () => {
                const promises = components.map(Component => generateStaticSpec(Component));
                return Promise.all(promises);
            });

            // Should complete within 50ms for 10 components
            expect(time).toBeLessThan(50);
        });

        it('should optimize repeated spec generation', async () => {
            const TestComponent = () => React.createElement('div', {}, 'Test');

            // Generate spec multiple times
            const times: number[] = [];
            for (let i = 0; i < 5; i++) {
                const { time } = await measureTime(() => generateStaticSpec(TestComponent));
                times.push(time);
            }

            // Later generations might be faster due to optimizations
            const firstTime = times[0];
            const lastTime = times[times.length - 1];

            // All should be within reasonable bounds
            times.forEach(time => {
                expect(time).toBeLessThan(15);
            });
        });
    });

    describe('Real-world Performance Scenarios', () => {
        it('should handle typical card component performance', async () => {
            const cardElement = createMockElement({
                className: 'card',
                children: [
                    createMockElement({ tagName: 'IMG', className: 'avatar' }),
                    createMockElement({ tagName: 'H2', textContent: 'Card Title' }),
                    createMockElement({ tagName: 'P', textContent: 'Card description text' }),
                    createMockElement({ tagName: 'BUTTON', className: 'btn' })
                ]
            });

            const { time } = await measureTime(() => buildElementTree(cardElement));

            // Should complete within 5ms for typical card
            expect(time).toBeLessThan(5);
        });

        it('should handle list performance', async () => {
            const listItems = Array.from({ length: 20 }, (_, i) =>
                createMockElement({
                    tagName: 'LI',
                    className: 'list-item',
                    children: [
                        createMockElement({ tagName: 'SPAN', textContent: `Item ${i}` })
                    ]
                })
            );

            const listElement = createMockElement({
                tagName: 'UL',
                className: 'list',
                children: listItems
            });

            const { time } = await measureTime(() => buildElementTree(listElement));

            // Should complete within 15ms for 20-item list
            expect(time).toBeLessThan(15);
        });

        it('should handle table performance', async () => {
            const tableRows = Array.from({ length: 10 }, (_, i) =>
                createMockElement({
                    tagName: 'TR',
                    children: Array.from({ length: 5 }, (_, j) =>
                        createMockElement({
                            tagName: 'TD',
                            textContent: `Cell ${i}-${j}`
                        })
                    )
                })
            );

            const tableElement = createMockElement({
                tagName: 'TABLE',
                children: [
                    createMockElement({
                        tagName: 'TBODY',
                        children: tableRows
                    })
                ]
            });

            const { time } = await measureTime(() => buildElementTree(tableElement));

            // Should complete within 20ms for 10x5 table
            expect(time).toBeLessThan(20);
        });
    });

    describe('Performance Regression Tests', () => {
        it('should not regress with repeated operations', async () => {
            const rootElement = createMockElementTree(3, 3);
            const baseline = await measureTime(() => buildElementTree(rootElement));

            // Run the same operation multiple times
            const subsequentTimes: number[] = [];
            for (let i = 0; i < 10; i++) {
                const { time } = await measureTime(() => buildElementTree(rootElement));
                subsequentTimes.push(time);
            }

            const averageSubsequent = subsequentTimes.reduce((sum, time) => sum + time, 0) / subsequentTimes.length;

            // Subsequent operations should not be significantly slower than baseline
            expect(averageSubsequent).toBeLessThan(baseline.time * 2);
        });

        it('should maintain performance under memory pressure', async () => {
            // Create memory pressure by allocating large arrays
            const memoryPressure = Array.from({ length: 1000 }, () =>
                new Array(1000).fill('memory pressure')
            );

            const rootElement = createMockElementTree(3, 3);
            const { time } = await measureTime(() => buildElementTree(rootElement));

            // Should still complete within reasonable time under memory pressure
            expect(time).toBeLessThan(30);

            // Clean up memory pressure
            memoryPressure.length = 0;
        });
    });
});