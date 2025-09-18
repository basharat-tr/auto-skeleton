import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DynamicSkeleton } from '../DynamicSkeleton';
import { SkeletonSpec, MappingRule, ElementMetadata } from '../../types';

// Import actual implementations for integration testing
import { buildElementTree, scanElement } from '../../utils/domScanner';
import { applyMappingRules, createDefaultRules, validateAndMergeRules } from '../../utils/mappingEngine';

describe('Integration Tests - End-to-End Skeleton Generation', () => {
  beforeEach(() => {
    // Setup DOM environment
    globalThis.window = {
      getComputedStyle: vi.fn(() => ({
        display: 'block',
        position: 'static',
        fontSize: '16px'
      }))
    } as any;

    globalThis.document = {} as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete DOM to Skeleton Flow', () => {
    it('should integrate DOM scanner and mapping engine correctly', () => {
      // Test the integration between DOM scanner and mapping engine
      const mockElement = {
        tagName: 'BUTTON',
        className: 'btn primary',
        textContent: 'Click me',
        attributes: [
          { name: 'class', value: 'btn primary' },
          { name: 'type', value: 'button' }
        ],
        getBoundingClientRect: () => ({ width: 120, height: 40, x: 0, y: 0 }),
        children: []
      } as any;

      globalThis.window = {
        getComputedStyle: () => ({
          display: 'inline-block',
          position: 'static',
          fontSize: '14px'
        })
      } as any;

      // Test DOM scanning
      const scannedElement = scanElement(mockElement);
      expect(scannedElement.tagName).toBe('button');
      expect(scannedElement.className).toBe('btn primary');

      // Test mapping rules application
      const rules = createDefaultRules();
      const skeletonPrimitive = applyMappingRules(scannedElement, rules);
      
      expect(skeletonPrimitive.shape).toBe('rect');
      expect(skeletonPrimitive.borderRadius).toBe('6px');
      expect(skeletonPrimitive.width).toBe(120);
      expect(skeletonPrimitive.height).toBe(40);
    });

    it('should handle nested element structures correctly', () => {
      // Test nested DOM tree processing
      const createNestedElement = (depth: number): any => {
        if (depth === 0) {
          return {
            tagName: 'SPAN',
            className: 'leaf',
            textContent: 'Leaf content',
            attributes: [],
            getBoundingClientRect: () => ({ width: 50, height: 20, x: 0, y: 0 }),
            children: []
          };
        }

        const children = [createNestedElement(depth - 1)];
        return {
          tagName: 'DIV',
          className: `level-${depth}`,
          textContent: '',
          attributes: [],
          getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 }),
          children: children
        };
      };

      globalThis.window = {
        getComputedStyle: () => ({
          display: 'block',
          position: 'static',
          fontSize: '16px'
        })
      } as any;

      const nestedElement = createNestedElement(3);
      const elementTree = buildElementTree(nestedElement);
      
      expect(elementTree).toHaveLength(1);
      expect(elementTree[0].tagName).toBe('div');
      expect(elementTree[0].children).toHaveLength(1);
      expect(elementTree[0].children[0].children).toHaveLength(1);
    });

    it('should apply custom mapping rules with correct priority', () => {
      const customRules: MappingRule[] = [
        {
          match: { classContains: 'custom-card' },
          to: { shape: 'rect', radius: '12px' },
          priority: 100
        },
        {
          match: { tag: 'article' },
          to: { shape: 'rect', size: { w: '100%', h: '200px' } },
          priority: 90
        }
      ];

      const element: ElementMetadata = {
        tagName: 'div',
        className: 'custom-card special',
        textContent: 'Custom content',
        dimensions: { width: 200, height: 100, x: 0, y: 0 },
        computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
        attributes: {},
        children: []
      };

      const mergedRules = validateAndMergeRules(customRules);
      const result = applyMappingRules(element, mergedRules);

      expect(result.shape).toBe('rect');
      expect(result.borderRadius).toBe('12px');
      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
    });

    it('should handle data-skeleton attribute overrides correctly', () => {
      const elementWithSkip: ElementMetadata = {
        tagName: 'div',
        className: 'test',
        textContent: 'Skip me',
        dimensions: { width: 100, height: 50, x: 0, y: 0 },
        computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
        attributes: { 'data-skeleton': 'skip' },
        children: []
      };

      const elementWithCircle: ElementMetadata = {
        tagName: 'div',
        className: 'test',
        textContent: 'Circle me',
        dimensions: { width: 100, height: 50, x: 0, y: 0 },
        computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
        attributes: { 'data-skeleton': 'circle:40px' },
        children: []
      };

      const skipResult = applyMappingRules(elementWithSkip, []);
      expect(skipResult.className).toBe('__skeleton-skip__');
      expect(skipResult.width).toBe(0);
      expect(skipResult.height).toBe(0);

      const circleResult = applyMappingRules(elementWithCircle, []);
      expect(circleResult.shape).toBe('circle');
      expect(circleResult.width).toBe('40px');
      expect(circleResult.height).toBe('40px');
    });
  });

  describe('Performance Integration Tests', () => {
    it('should handle large element trees efficiently', () => {
      const createLargeTree = (depth: number, breadth: number): any => {
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

        const children = Array.from({ length: breadth }, () => createLargeTree(depth - 1, breadth));
        return {
          tagName: 'DIV',
          className: `level-${depth}`,
          textContent: '',
          attributes: [],
          getBoundingClientRect: () => ({ width: 100, height: 50, x: 0, y: 0 }),
          children: children
        };
      };

      globalThis.window = {
        getComputedStyle: () => ({
          display: 'block',
          position: 'static',
          fontSize: '16px'
        })
      } as any;

      const largeTree = createLargeTree(3, 4); // 64 total nodes
      
      const startTime = performance.now();
      const result = buildElementTree(largeTree);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(100); // Should be fast
    });

    it('should process multiple elements efficiently', () => {
      const elements: ElementMetadata[] = Array.from({ length: 100 }, (_, i) => ({
        tagName: 'div',
        className: `element-${i}`,
        textContent: `Content ${i}`,
        dimensions: { width: 100, height: 20, x: 0, y: 0 },
        computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
        attributes: {},
        children: []
      }));

      const rules = createDefaultRules();
      
      const startTime = performance.now();
      const results = elements.map(element => applyMappingRules(element, rules));
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      
      expect(results).toHaveLength(100);
      expect(results.every(r => r.key && r.shape)).toBe(true);
      expect(duration).toBeLessThan(50); // Should be very fast
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle DOM scanning errors gracefully', () => {
      const errorElement = {
        tagName: 'DIV',
        className: 'error-element',
        textContent: 'Test',
        attributes: [],
        getBoundingClientRect: () => {
          throw new Error('getBoundingClientRect failed');
        }
      } as any;

      globalThis.window = {
        getComputedStyle: () => ({
          display: 'block',
          position: 'static',
          fontSize: '16px'
        })
      } as any;

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = scanElement(errorElement);
      
      // Should return fallback values
      expect(result.dimensions).toEqual({ width: 0, height: 0, x: 0, y: 0 });
      expect(result.tagName).toBe('div');
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle invalid renderSpec gracefully', async () => {
      const invalidSpec = {
        children: [
          {
            // Missing key
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      } as SkeletonSpec;

      render(<DynamicSkeleton renderSpec={invalidSpec} />);

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Should show error message
      expect(screen.getByText(/Failed to generate skeleton/)).toBeInTheDocument();
    });
  });

  describe('Theme and Animation Integration', () => {
    it('should render skeleton with different themes', async () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-element',
            shape: 'rect',
            width: 200,
            height: 100
          }
        ]
      };

      // Test light theme
      const { rerender } = render(<DynamicSkeleton renderSpec={mockSpec} theme="light" />);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Test dark theme
      rerender(<DynamicSkeleton renderSpec={mockSpec} theme="dark" />);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Test custom theme
      const customTheme = { baseColor: '#ff6b6b', highlight: '#ffa8a8' };
      rerender(<DynamicSkeleton renderSpec={mockSpec} theme={customTheme} />);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });

    it('should render skeleton with different animations', async () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-element',
            shape: 'rect',
            width: 200,
            height: 100
          }
        ]
      };

      // Test pulse animation
      const { rerender } = render(<DynamicSkeleton renderSpec={mockSpec} animation="pulse" />);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Test wave animation
      rerender(<DynamicSkeleton renderSpec={mockSpec} animation="wave" />);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Test no animation
      rerender(<DynamicSkeleton renderSpec={mockSpec} animation="none" />);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });
  });

  describe('Layout Preservation Integration', () => {
    it('should handle keepSpace option correctly', async () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'layout-element',
            shape: 'rect',
            width: 400,
            height: 300
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} keepSpace={true} />);

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const skeletonContainer = screen.getByRole('status');
      expect(skeletonContainer).toBeInTheDocument();
    });
  });

  describe('Real-world Component Integration', () => {
    it('should handle card-like skeleton specifications', async () => {
      const cardSpec: SkeletonSpec = {
        children: [
          {
            key: 'card-image',
            shape: 'rect',
            width: '100%',
            height: '200px',
            borderRadius: '8px 8px 0 0'
          },
          {
            key: 'card-title',
            shape: 'line',
            width: '80%',
            height: '24px'
          },
          {
            key: 'card-description',
            shape: 'line',
            lines: 2,
            width: '100%',
            height: '16px'
          },
          {
            key: 'card-button',
            shape: 'rect',
            width: '120px',
            height: '40px',
            borderRadius: '6px'
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={cardSpec} />);

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const skeletonContainer = screen.getByRole('status');
      expect(skeletonContainer).toBeInTheDocument();
    });

    it('should handle list-like skeleton specifications', async () => {
      const listSpec: SkeletonSpec = {
        children: [
          {
            key: 'list-title',
            shape: 'line',
            width: '200px',
            height: '32px'
          },
          {
            key: 'list-item-1',
            shape: 'rect',
            width: '100%',
            height: '60px',
            borderRadius: '4px'
          },
          {
            key: 'list-item-2',
            shape: 'rect',
            width: '100%',
            height: '60px',
            borderRadius: '4px'
          },
          {
            key: 'list-item-3',
            shape: 'rect',
            width: '100%',
            height: '60px',
            borderRadius: '4px'
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={listSpec} />);

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      const skeletonContainer = screen.getByRole('status');
      expect(skeletonContainer).toBeInTheDocument();
    });
  });
});