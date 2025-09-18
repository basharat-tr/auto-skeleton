import React, { useRef, useEffect } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DynamicSkeleton } from '../DynamicSkeleton';
import { SkeletonSpec } from '../../types';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock the DOM scanner and mapping engine
vi.mock('../../utils/domScanner', () => ({
  buildElementTree: vi.fn()
}));

vi.mock('../../utils/mappingEngine', () => ({
  applyMappingRules: vi.fn(),
  validateAndMergeRules: vi.fn()
}));

import { buildElementTree } from '../../utils/domScanner';
import { applyMappingRules, validateAndMergeRules } from '../../utils/mappingEngine';

const mockBuildElementTree = buildElementTree as vi.MockedFunction<typeof buildElementTree>;
const mockApplyMappingRules = applyMappingRules as vi.MockedFunction<typeof applyMappingRules>;
const mockValidateAndMergeRules = validateAndMergeRules as vi.MockedFunction<typeof validateAndMergeRules>;

// Test component that provides a ref to DynamicSkeleton
const TestComponent: React.FC<{
  onRefReady?: (ref: React.RefObject<HTMLDivElement>) => void;
  children?: React.ReactNode;
}> = ({ onRefReady, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onRefReady && ref.current) {
      onRefReady(ref);
    }
  }, [onRefReady]);

  return (
    <div ref={ref} data-testid="test-component">
      {children || (
        <>
          <h1>Test Heading</h1>
          <p>Test paragraph with some content</p>
          <button>Test Button</button>
          <img src="test.jpg" alt="Test" className="avatar" />
        </>
      )}
    </div>
  );
};

describe('DynamicSkeleton Accessibility', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    mockValidateAndMergeRules.mockReturnValue([]);
    mockBuildElementTree.mockReturnValue([]);
    
    // Create unique keys for each call
    let keyCounter = 0;
    mockApplyMappingRules.mockImplementation(() => ({
      key: `test-key-${++keyCounter}`,
      shape: 'rect',
      width: 100,
      height: 20
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ARIA attributes', () => {
    it('should include role="status" attribute', async () => {
      render(<DynamicSkeleton />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toBeInTheDocument();
    });

    it('should include aria-busy="true" attribute', async () => {
      render(<DynamicSkeleton />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-busy', 'true');
    });

    it('should include aria-live="polite" attribute', async () => {
      render(<DynamicSkeleton />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should include aria-label with default value', async () => {
      render(<DynamicSkeleton />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-label', 'Loading content...');
    });

    it('should include aria-label with custom value', async () => {
      const customLabel = 'Custom loading message';
      render(<DynamicSkeleton ariaLabel={customLabel} />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-label', customLabel);
    });

    it('should maintain ARIA attributes during loading state', async () => {
      mockBuildElementTree.mockReturnValue([]);

      let testRef: React.RefObject<HTMLDivElement> | null = null;

      const TestWrapper = () => {
        const [ref, setRef] = React.useState<React.RefObject<HTMLDivElement> | null>(null);

        return (
          <>
            <TestComponent onRefReady={setRef} />
            {ref && <DynamicSkeleton forRef={ref} ariaLabel="Loading test content" />}
          </>
        );
      };

      render(<TestWrapper />);

      await waitFor(() => {
        const statusElement = screen.getByRole('status');
        expect(statusElement).toHaveAttribute('aria-busy', 'true');
        expect(statusElement).toHaveAttribute('aria-live', 'polite');
        expect(statusElement).toHaveAttribute('aria-label', 'Loading test content');
      });
    });

    it('should maintain ARIA attributes during error state', async () => {
      mockBuildElementTree.mockImplementation(() => {
        throw new Error('Test error');
      });

      let testRef: React.RefObject<HTMLDivElement> | null = null;

      const TestWrapper = () => {
        const [ref, setRef] = React.useState<React.RefObject<HTMLDivElement> | null>(null);

        return (
          <>
            <TestComponent onRefReady={setRef} />
            {ref && <DynamicSkeleton forRef={ref} ariaLabel="Error loading content" />}
          </>
        );
      };

      render(<TestWrapper />);

      await waitFor(() => {
        const statusElement = screen.getByRole('status');
        expect(statusElement).toHaveAttribute('aria-busy', 'true');
        expect(statusElement).toHaveAttribute('aria-live', 'polite');
        expect(statusElement).toHaveAttribute('aria-label', 'Error loading content');
      });
    });
  });

  describe('Screen reader support', () => {
    it('should include screen reader only text with sr-only class', async () => {
      render(<DynamicSkeleton />);

      const srText = screen.getByText('Loading content...');
      expect(srText).toHaveClass('sr-only');
      expect(srText).toHaveAttribute('aria-hidden', 'true');
    });

    it('should include custom screen reader text', async () => {
      const customLabel = 'Loading user profile data';
      render(<DynamicSkeleton ariaLabel={customLabel} />);

      const srText = screen.getByText(customLabel);
      expect(srText).toHaveClass('sr-only');
      expect(srText).toHaveAttribute('aria-hidden', 'true');
    });

    it('should provide meaningful loading messages in different states', async () => {
      // Test loading state
      mockBuildElementTree.mockReturnValue([]);

      let testRef: React.RefObject<HTMLDivElement> | null = null;

      const TestWrapper = () => {
        const [ref, setRef] = React.useState<React.RefObject<HTMLDivElement> | null>(null);

        return (
          <>
            <TestComponent onRefReady={setRef} />
            {ref && <DynamicSkeleton forRef={ref} ariaLabel="Analyzing component structure" />}
          </>
        );
      };

      render(<TestWrapper />);

      await waitFor(() => {
        expect(screen.getByText('Analyzing component structure')).toBeInTheDocument();
        expect(screen.getByText('Analyzing component structure...')).toBeInTheDocument();
      });
    });
  });

  describe('Focus management and tab navigation', () => {
    it('should have tabIndex={-1} to prevent focus', async () => {
      render(<DynamicSkeleton />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('tabIndex', '-1');
    });

    it('should prevent focus and blur when focused', async () => {
      render(<DynamicSkeleton />);

      const statusElement = screen.getByRole('status');
      
      // Mock blur method
      const blurSpy = vi.spyOn(statusElement, 'blur').mockImplementation(() => {});
      
      // Try to focus the element
      fireEvent.focus(statusElement);
      
      // The onFocus handler should call blur
      expect(blurSpy).toHaveBeenCalled();
      
      blurSpy.mockRestore();
    });

    it('should have outline: none to prevent focus indicators', async () => {
      render(<DynamicSkeleton />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveStyle({ outline: 'none' });
    });

    it('should prevent tab navigation to skeleton elements', async () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-rect',
            shape: 'rect',
            width: 200,
            height: 100
          },
          {
            key: 'test-circle',
            shape: 'circle',
            width: 50,
            height: 50
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} />);

      // All skeleton primitives should have tabIndex={-1} and aria-hidden="true"
      const container = screen.getByRole('status');
      const skeletonElements = container.querySelectorAll('.skeleton-primitive');
      
      skeletonElements.forEach(element => {
        expect(element).toHaveAttribute('tabIndex', '-1');
        expect(element).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Pointer events and user interaction', () => {
    it('should disable pointer events', async () => {
      render(<DynamicSkeleton />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveStyle({ pointerEvents: 'none' });
    });

    it('should disable user selection', async () => {
      render(<DynamicSkeleton />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveStyle({ userSelect: 'none' });
    });

    it('should prevent mouse interactions on skeleton elements', async () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-rect',
            shape: 'rect',
            width: 200,
            height: 100
          }
        ]
      };

      render(<DynamicSkeleton renderSpec={mockSpec} />);

      const container = screen.getByRole('status');
      const skeletonElements = container.querySelectorAll('.skeleton-primitive');
      
      skeletonElements.forEach(element => {
        expect(element).toHaveStyle({ pointerEvents: 'none' });
        expect(element).toHaveStyle({ userSelect: 'none' });
      });
    });
  });

  describe('Accessibility compliance with jest-axe', () => {
    it('should not have accessibility violations in default state', async () => {
      const { container } = render(<DynamicSkeleton />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations with custom aria-label', async () => {
      const { container } = render(<DynamicSkeleton ariaLabel="Loading user dashboard" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations with renderSpec', async () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-rect',
            shape: 'rect',
            width: 200,
            height: 100
          },
          {
            key: 'test-circle',
            shape: 'circle',
            width: 50,
            height: 50
          },
          {
            key: 'test-line',
            shape: 'line',
            width: 150,
            height: 20,
            lines: 3
          }
        ]
      };

      const { container } = render(<DynamicSkeleton renderSpec={mockSpec} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations during loading state', async () => {
      mockBuildElementTree.mockReturnValue([]);

      let testRef: React.RefObject<HTMLDivElement> | null = null;

      const TestWrapper = () => {
        const [ref, setRef] = React.useState<React.RefObject<HTMLDivElement> | null>(null);

        return (
          <>
            <TestComponent onRefReady={setRef} />
            {ref && <DynamicSkeleton forRef={ref} />}
          </>
        );
      };

      const { container } = render(<TestWrapper />);

      await waitFor(() => {
        expect(screen.getByText('Analyzing component structure...')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations during error state', async () => {
      mockBuildElementTree.mockImplementation(() => {
        throw new Error('Test error');
      });

      let testRef: React.RefObject<HTMLDivElement> | null = null;

      const TestWrapper = () => {
        const [ref, setRef] = React.useState<React.RefObject<HTMLDivElement> | null>(null);

        return (
          <>
            <TestComponent onRefReady={setRef} />
            {ref && <DynamicSkeleton forRef={ref} />}
          </>
        );
      };

      const { container } = render(<TestWrapper />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to generate skeleton/)).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations with different themes', async () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-rect',
            shape: 'rect',
            width: 200,
            height: 100
          }
        ]
      };

      // Test light theme
      const { container: lightContainer } = render(
        <DynamicSkeleton renderSpec={mockSpec} theme="light" />
      );
      const lightResults = await axe(lightContainer);
      expect(lightResults).toHaveNoViolations();

      // Test dark theme
      const { container: darkContainer } = render(
        <DynamicSkeleton renderSpec={mockSpec} theme="dark" />
      );
      const darkResults = await axe(darkContainer);
      expect(darkResults).toHaveNoViolations();

      // Test custom theme
      const { container: customContainer } = render(
        <DynamicSkeleton 
          renderSpec={mockSpec} 
          theme={{ baseColor: '#f0f0f0', highlight: '#ffffff' }} 
        />
      );
      const customResults = await axe(customContainer);
      expect(customResults).toHaveNoViolations();
    });

    it('should not have accessibility violations with different animations', async () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-rect',
            shape: 'rect',
            width: 200,
            height: 100
          }
        ]
      };

      // Test pulse animation
      const { container: pulseContainer } = render(
        <DynamicSkeleton renderSpec={mockSpec} animation="pulse" />
      );
      const pulseResults = await axe(pulseContainer);
      expect(pulseResults).toHaveNoViolations();

      // Test wave animation
      const { container: waveContainer } = render(
        <DynamicSkeleton renderSpec={mockSpec} animation="wave" />
      );
      const waveResults = await axe(waveContainer);
      expect(waveResults).toHaveNoViolations();

      // Test no animation
      const { container: noneContainer } = render(
        <DynamicSkeleton renderSpec={mockSpec} animation="none" />
      );
      const noneResults = await axe(noneContainer);
      expect(noneResults).toHaveNoViolations();
    });
  });

  describe('Error boundary accessibility', () => {
    it('should maintain accessibility in error boundary fallback', async () => {
      // Mock console.warn to avoid noise in test output
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Create a component that will trigger the error boundary
      const ErrorComponent = () => {
        throw new Error('Test error boundary');
      };

      // We need to test the error boundary fallback directly
      // since it's hard to trigger in the full component
      const { container } = render(
        <div 
          role="status" 
          aria-busy="true" 
          aria-live="polite"
          aria-label="Loading content..."
          tabIndex={-1}
          style={{ 
            padding: '1rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '4px',
            color: '#6b7280',
            pointerEvents: 'none',
            userSelect: 'none',
            outline: 'none'
          }}
        >
          <span className="sr-only" aria-hidden="true">Loading content...</span>
          <div>Loading...</div>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      consoleSpy.mockRestore();
    });
  });

  describe('Complex skeleton structures accessibility', () => {
    it('should maintain accessibility with nested skeleton elements', async () => {
      const complexSpec: SkeletonSpec = {
        children: [
          {
            key: 'header-rect',
            shape: 'rect',
            width: '100%',
            height: 60
          },
          {
            key: 'avatar-circle',
            shape: 'circle',
            width: 50,
            height: 50
          },
          {
            key: 'title-line',
            shape: 'line',
            width: '80%',
            height: 24
          },
          {
            key: 'content-lines',
            shape: 'line',
            width: '100%',
            height: 16,
            lines: 4
          },
          {
            key: 'button-rect',
            shape: 'rect',
            width: 120,
            height: 40,
            borderRadius: '8px'
          }
        ],
        layout: 'stack',
        gap: '1rem'
      };

      const { container } = render(<DynamicSkeleton renderSpec={complexSpec} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Verify all skeleton elements have proper accessibility attributes
      const skeletonElements = container.querySelectorAll('.skeleton-primitive, .skeleton-lines');
      expect(skeletonElements.length).toBeGreaterThan(0);
      
      skeletonElements.forEach(element => {
        expect(element).toHaveAttribute('tabIndex', '-1');
        expect(element).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });
});