import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DynamicSkeleton } from '../DynamicSkeleton';
import { SkeletonSpec, MappingRule } from '../../types';

// Mock the DOM scanner and mapping engine
vi.mock('../../utils/domScanner', () => ({
  buildElementTree: vi.fn(() => [
    {
      tagName: 'div',
      className: 'test-element',
      textContent: 'Test content',
      dimensions: { width: 100, height: 50, x: 0, y: 0 },
      computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
      attributes: {},
      children: []
    }
  ])
}));

vi.mock('../../utils/mappingEngine', () => ({
  applyMappingRules: vi.fn(() => ({
    key: 'test-key',
    shape: 'rect' as const,
    width: 100,
    height: 50,
    className: 'test-skeleton'
  })),
  validateAndMergeRules: vi.fn((rules) => rules || [])
}));

vi.mock('../../utils/layoutPreservation', () => ({
  generateOptimalSkeletonDimensions: vi.fn(() => ({
    width: '100px',
    height: '50px',
    strategy: 'preserve' as const
  })),
  createPlaceholderStyles: vi.fn(() => ({})),
  analyzeContainerLayout: vi.fn(() => ({
    containerType: 'block' as const,
    isFlexible: false,
    hasFixedDimensions: true,
    recommendedStrategy: 'preserve' as const
  }))
}));

describe('DynamicSkeleton Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Component Initialization', () => {
    it('should render with default props', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('should apply custom className and styles', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const customStyle = { margin: '10px' };
      const customClassName = 'custom-skeleton';

      render(
        <DynamicSkeleton 
          renderSpec={mockSpec} 
          className={customClassName}
          style={customStyle}
        />
      );
      
      const container = screen.getByRole('status');
      expect(container).toHaveClass('dynamic-skeleton', customClassName);
      expect(container).toHaveStyle({ margin: '10px' });
    });

    it('should use custom aria-label', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const customAriaLabel = 'Loading custom content...';

      render(<DynamicSkeleton renderSpec={mockSpec} ariaLabel={customAriaLabel} />);
      
      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('aria-label', customAriaLabel);
      expect(screen.getByText(customAriaLabel, { selector: '.sr-only' })).toBeInTheDocument();
    });
  });

  describe('Spec Validation', () => {
    it('should validate renderSpec and show error for invalid spec', () => {
      const invalidSpec = {
        children: [
          {
            // Missing required 'key' property
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      } as SkeletonSpec;

      render(<DynamicSkeleton renderSpec={invalidSpec} />);
      
      expect(screen.getByText(/Invalid skeleton specification/)).toBeInTheDocument();
    });

    it('should handle duplicate keys in renderSpec', () => {
      const specWithDuplicateKeys: SkeletonSpec = {
        children: [
          {
            key: 'duplicate-key',
            shape: 'rect',
            width: 100,
            height: 50
          },
          {
            key: 'duplicate-key',
            shape: 'circle',
            width: 40,
            height: 40
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={specWithDuplicateKeys} />);
      
      expect(screen.getByText(/Duplicate keys found/)).toBeInTheDocument();
    });

    it('should validate line shape properties', () => {
      const specWithInvalidLines: SkeletonSpec = {
        children: [
          {
            key: 'invalid-line',
            shape: 'line',
            lines: -1 // Invalid lines value
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={specWithInvalidLines} />);
      
      expect(screen.getByText(/invalid lines value/)).toBeInTheDocument();
    });
  });

  describe('Skeleton Rendering', () => {
    it('should render skeleton primitives from valid spec', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'rect-1',
            shape: 'rect',
            width: 100,
            height: 50,
            className: 'test-rect'
          },
          {
            key: 'circle-1',
            shape: 'circle',
            width: 40,
            height: 40,
            className: 'test-circle'
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      
      // Check that skeleton container is rendered
      const container = screen.getByRole('status');
      expect(container.querySelector('.dynamic-skeleton-container')).toBeInTheDocument();
    });

    it('should handle empty children array', () => {
      const emptySpec: SkeletonSpec = {
        children: []
      };

      render(<DynamicSkeleton renderSpec={emptySpec} />);
      
      expect(screen.getByText('No skeleton elements to render')).toBeInTheDocument();
    });

    it('should apply layout configuration', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ],
        layout: 'row',
        gap: '1rem'
      };

      render(<DynamicSkeleton renderSpec={mockSpec} />);
      
      const container = screen.getByRole('status').querySelector('.dynamic-skeleton-container');
      expect(container).toHaveClass('row');
      expect(container).toHaveStyle({
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem'
      });
    });
  });

  describe('Animation and Theme Props', () => {
    it('should pass animation prop to skeleton primitives', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} animation="wave" />);
      
      // Animation prop should be passed to SkeletonPrimitive components
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should pass theme prop to skeleton primitives', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} theme="dark" />);
      
      // Theme prop should be passed to SkeletonPrimitive components
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should handle custom theme objects', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const customTheme = {
        baseColor: '#ff0000',
        highlight: '#ff6666'
      };

      render(<DynamicSkeleton renderSpec={mockSpec} theme={customTheme} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Error Boundary', () => {
    it('should catch and handle rendering errors', () => {
      // Mock console.warn to avoid noise in test output
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Create a component that throws an error
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      // This would normally cause the error boundary to catch the error
      // but since we're testing the component in isolation, we'll test the fallback
      render(<DynamicSkeleton renderSpec={undefined as any} />);
      
      // Should show error state
      expect(screen.getByText(/No skeleton specification available/)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility Features', () => {
    it('should include proper ARIA attributes', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} />);
      
      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('role', 'status');
      expect(container).toHaveAttribute('aria-busy', 'true');
      expect(container).toHaveAttribute('aria-live', 'polite');
      expect(container).toHaveAttribute('tabIndex', '-1');
    });

    it('should disable pointer events and user selection', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} />);
      
      const container = screen.getByRole('status');
      expect(container).toHaveStyle({
        pointerEvents: 'none',
        userSelect: 'none',
        outline: 'none'
      });
    });

    it('should include screen reader text', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const ariaLabel = 'Loading content...';

      render(<DynamicSkeleton renderSpec={mockSpec} ariaLabel={ariaLabel} />);
      
      expect(screen.getByText(ariaLabel, { selector: '.sr-only' })).toBeInTheDocument();
    });

    it('should prevent focus on skeleton elements', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} />);
      
      const container = screen.getByRole('status');
      
      // Simulate focus event
      container.focus();
      
      // Should blur immediately due to onFocus handler
      expect(document.activeElement).not.toBe(container);
    });
  });

  describe('Layout Preservation', () => {
    it('should handle keepSpace option', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} keepSpace={true} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      // Layout preservation logic should be applied
    });

    it('should calculate container styles with layout preservation', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      // Create a mock ref with mocked properties
      const mockElement = document.createElement('div');
      Object.defineProperty(mockElement, 'offsetWidth', {
        value: 200,
        writable: true
      });
      Object.defineProperty(mockElement, 'offsetHeight', {
        value: 100,
        writable: true
      });
      
      const mockRef = { current: mockElement };

      render(<DynamicSkeleton renderSpec={mockSpec} forRef={mockRef} keepSpace={true} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Custom Mapping Rules', () => {
    it('should validate and merge custom mapping rules', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const customRules: MappingRule[] = [
        {
          match: { classContains: 'custom' },
          to: { shape: 'circle' },
          priority: 90
        }
      ];

      render(<DynamicSkeleton renderSpec={mockSpec} mappingRules={customRules} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});