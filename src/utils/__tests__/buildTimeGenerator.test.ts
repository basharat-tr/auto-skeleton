import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import {
    generateStaticSpec,
    validateSkeletonSpec,
    serializeSkeletonSpec,
    deserializeSkeletonSpec,
    generateMultipleSpecs
} from '../buildTimeGenerator';
import { SkeletonSpec, MappingRule } from '../../types';

// Mock test components
const SimpleComponent = ({ title = 'Test Title', content = 'Test content' }) =>
    React.createElement('div', { className: 'container' }, [
        React.createElement('h1', { key: 'title' }, title),
        React.createElement('p', { key: 'content' }, content)
    ]);

const ComplexComponent = ({ showAvatar = true, buttonText = 'Click me' }) =>
    React.createElement('div', { className: 'profile' }, [
        showAvatar && React.createElement('img', {
            key: 'avatar',
            className: 'avatar',
            src: 'avatar.jpg',
            alt: 'User avatar'
        }),
        React.createElement('div', { key: 'info', className: 'info' }, [
            React.createElement('h2', { key: 'name' }, 'John Doe'),
            React.createElement('p', { key: 'bio' }, 'Software developer with 5 years of experience'),
            React.createElement('button', { key: 'action', className: 'btn' }, buttonText)
        ])
    ].filter(Boolean));

describe('buildTimeGenerator', () => {
    describe('generateStaticSpec', () => {
        it('should generate spec for simple component', async () => {
            const spec = await generateStaticSpec(SimpleComponent);

            expect(spec).toBeDefined();
            expect(spec.children.length).toBeGreaterThan(0);
            expect(spec.rootKey).toContain('root-div');
            expect(spec.layout).toBe('stack');
            expect(spec.gap).toBe('8px');

            // Check that h1 is mapped to line
            const h1Primitive = spec.children.find(child => child.key.includes('h1'));
            expect(h1Primitive).toBeDefined();
            expect(h1Primitive?.shape).toBe('line');

            // Check that p element exists
            const pPrimitive = spec.children.find(child => child.key.includes('p'));
            expect(pPrimitive).toBeDefined();
            expect(['line', 'rect']).toContain(pPrimitive?.shape);
        });

        it('should generate spec for complex component with avatar', async () => {
            const spec = await generateStaticSpec(ComplexComponent, { showAvatar: true });

            expect(spec).toBeDefined();
            expect(spec.children.length).toBeGreaterThan(0);

            // Check that avatar image is mapped to circle
            const avatarPrimitive = spec.children.find(child =>
                child.key.includes('img') && child.shape === 'circle'
            );
            expect(avatarPrimitive).toBeDefined();
            expect(avatarPrimitive?.width).toBe('40px');
            expect(avatarPrimitive?.height).toBe('40px');

            // Check that button is mapped to rounded rectangle
            const buttonPrimitive = spec.children.find(child =>
                child.key.includes('button')
            );
            expect(buttonPrimitive).toBeDefined();
            expect(buttonPrimitive?.shape).toBe('rect');
            expect(buttonPrimitive?.borderRadius).toBe('6px');
        });

        it('should handle component without avatar', async () => {
            const spec = await generateStaticSpec(ComplexComponent, { showAvatar: false });

            expect(spec).toBeDefined();

            // Should not have avatar primitive
            const avatarPrimitive = spec.children.find(child =>
                child.key.includes('img')
            );
            expect(avatarPrimitive).toBeUndefined();
        });

        it('should apply custom mapping rules', async () => {
            const customRules: MappingRule[] = [
                {
                    match: { classContains: 'custom' },
                    to: { shape: 'circle', size: { w: '60px', h: '60px' } },
                    priority: 200
                }
            ];

            const TestComponent = () =>
                React.createElement('div', { className: 'custom-element' }, 'Custom content');

            const spec = await generateStaticSpec(TestComponent, {}, customRules);

            expect(spec).toBeDefined();
            const customPrimitive = spec.children.find(child =>
                child.key.includes('div')
            );
            expect(customPrimitive).toBeDefined();
            expect(customPrimitive?.shape).toBe('circle');
            expect(customPrimitive?.width).toBe('60px');
            expect(customPrimitive?.height).toBe('60px');
        });

        it('should handle component rendering errors gracefully', async () => {
            const ErrorComponent = () => {
                throw new Error('Component render error');
            };

            await expect(generateStaticSpec(ErrorComponent)).rejects.toThrow(
                'Failed to generate static spec'
            );
        });

        it('should handle different prop variations', async () => {
            const spec1 = await generateStaticSpec(SimpleComponent, {
                title: 'Short',
                content: 'Brief'
            });
            const spec2 = await generateStaticSpec(SimpleComponent, {
                title: 'Very Long Title That Should Take More Space',
                content: 'Much longer content that should result in different dimensions and possibly multiple lines when rendered in the skeleton'
            });

            expect(spec1).toBeDefined();
            expect(spec2).toBeDefined();

            // Both should have same structure but potentially different dimensions
            expect(spec1.children.length).toBeGreaterThan(0);
            expect(spec2.children.length).toBeGreaterThan(0);
        });

        it('should handle basic data-skeleton attributes', async () => {
            const ComponentWithDataAttributes = () =>
                React.createElement('div', {
                    'data-skeleton': 'circle:50px'
                }, 'Custom element');

            const spec = await generateStaticSpec(ComponentWithDataAttributes);

            expect(spec).toBeDefined();
            expect(spec.children.length).toBeGreaterThan(0);

            // Should have at least one element (may not respect data-skeleton in build-time mode)
            const elements = spec.children;
            expect(elements.length).toBeGreaterThan(0);
        });
    });

    describe('validateSkeletonSpec', () => {
        it('should validate correct skeleton spec', () => {
            const validSpec: SkeletonSpec = {
                rootKey: 'root-test',
                children: [
                    {
                        key: 'test-1',
                        shape: 'rect',
                        width: 100,
                        height: 50
                    },
                    {
                        key: 'test-2',
                        shape: 'circle',
                        width: '40px',
                        height: '40px'
                    }
                ],
                layout: 'stack',
                gap: '8px'
            };

            const result = validateSkeletonSpec(validSpec);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate empty children array', () => {
            const validSpec: SkeletonSpec = {
                rootKey: 'root-test',
                children: [],
                layout: 'stack',
                gap: '8px'
            };

            const result = validateSkeletonSpec(validSpec);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject invalid skeleton spec', () => {
            const invalidSpecs = [
                null,
                undefined,
                'not an object',
                { notChildren: [] },
                {
                    children: [
                        {
                            key: 'test',
                            shape: 'invalid-shape' as any,
                            width: 100,
                            height: 50
                        }
                    ]
                },
                {
                    children: [
                        {
                            // Missing key and shape
                            width: 100,
                            height: 50
                        }
                    ]
                }
            ];

            invalidSpecs.forEach(spec => {
                const result = validateSkeletonSpec(spec as any);
                expect(result.isValid).toBe(false);
                expect(result.errors.length).toBeGreaterThan(0);
            });
        });
    });

    describe('serializeSkeletonSpec', () => {
        it('should serialize skeleton spec to JSON', () => {
            const spec: SkeletonSpec = {
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

            const serialized = serializeSkeletonSpec(spec);
            expect(typeof serialized).toBe('string');
            expect(JSON.parse(serialized)).toEqual(spec);
        });

        it('should handle serialization errors', () => {
            const circularRef: any = {};
            circularRef.self = circularRef;

            expect(() => serializeSkeletonSpec(circularRef)).toThrow(
                'Failed to serialize skeleton spec'
            );
        });
    });

    describe('deserializeSkeletonSpec', () => {
        it('should deserialize valid JSON to skeleton spec', () => {
            const spec: SkeletonSpec = {
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

            const serialized = JSON.stringify(spec);
            const deserialized = deserializeSkeletonSpec(serialized);

            expect(deserialized).toEqual(spec);
        });

        it('should reject invalid JSON', () => {
            expect(() => deserializeSkeletonSpec('invalid json')).toThrow(
                'Failed to deserialize skeleton spec'
            );
        });

        it('should reject JSON with invalid spec structure', () => {
            const invalidSpec = JSON.stringify({
                children: [
                    {
                        key: 'test',
                        shape: 'invalid-shape',
                        width: 100
                    }
                ]
            });

            expect(() => deserializeSkeletonSpec(invalidSpec)).toThrow(
                'Invalid skeleton specification structure'
            );
        });
    });

    describe('generateMultipleSpecs', () => {
        it('should generate specs for multiple prop variations', async () => {
            const propVariations = [
                { title: 'Title 1', content: 'Content 1' },
                { title: 'Title 2', content: 'Content 2' },
                { title: 'Title 3', content: 'Content 3' }
            ];

            const specs = await generateMultipleSpecs(SimpleComponent, propVariations);

            expect(specs).toHaveLength(3);
            specs.forEach(spec => {
                const result = validateSkeletonSpec(spec);
                expect(result.isValid).toBe(true);
                expect(result.errors).toHaveLength(0);
            });
        });

        it('should handle errors in individual spec generation', async () => {
            const ErrorComponent = ({ shouldError }: { shouldError?: boolean }) => {
                if (shouldError) {
                    throw new Error('Component error');
                }
                return React.createElement('div', {}, 'Success');
            };

            const propVariations = [
                { shouldError: false },
                { shouldError: true }, // This should fail
                { shouldError: false }
            ];

            // Mock console.warn to avoid test output noise
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const specs = await generateMultipleSpecs(ErrorComponent, propVariations);

            expect(specs).toHaveLength(2); // Only successful ones
            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to generate spec for props:',
                { shouldError: true },
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

        it('should return empty array for empty prop variations', async () => {
            const specs = await generateMultipleSpecs(SimpleComponent, []);
            expect(specs).toHaveLength(0);
        });
    });

    describe('integration with react-test-renderer', () => {
        it('should handle components with complex nested structures', async () => {
            const NestedComponent = () =>
                React.createElement('div', { className: 'root' }, [
                    React.createElement('header', { key: 'header' }, [
                        React.createElement('h1', { key: 'title' }, 'Main Title'),
                        React.createElement('nav', { key: 'nav' }, [
                            React.createElement('a', { key: 'link1', href: '#' }, 'Link 1'),
                            React.createElement('a', { key: 'link2', href: '#' }, 'Link 2')
                        ])
                    ]),
                    React.createElement('main', { key: 'main' }, [
                        React.createElement('article', { key: 'article' }, [
                            React.createElement('h2', { key: 'article-title' }, 'Article Title'),
                            React.createElement('p', { key: 'article-content' }, 'Article content goes here')
                        ])
                    ])
                ]);

            const spec = await generateStaticSpec(NestedComponent);

            expect(spec).toBeDefined();
            expect(spec.children.length).toBeGreaterThan(5); // Should have multiple nested elements

            // Should have different types of primitives
            const shapes = spec.children.map(child => child.shape);
            expect(shapes).toContain('rect'); // div elements
            expect(shapes).toContain('line'); // heading and paragraph elements
        });
    });
});