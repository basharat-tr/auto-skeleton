import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SkeletonLine } from '../SkeletonLine';

describe('SkeletonLine Unit Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic Rendering', () => {
    it('should render single line by default', () => {
      render(<SkeletonLine />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-line-single');
    });

    it('should render single line when lines=1', () => {
      render(<SkeletonLine lines={1} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-line-single');
    });

    it('should render multiple lines when lines > 1', () => {
      render(<SkeletonLine lines={3} />);
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).toBeInTheDocument();
      
      const lines = container!.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(3);
    });

    it('should handle edge case of 0 lines', () => {
      render(<SkeletonLine lines={0} />);
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).toBeInTheDocument();
      
      const lines = container!.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(0);
    });
  });

  describe('Size Normalization', () => {
    it('should convert number values to pixels', () => {
      render(<SkeletonLine width={200} lineHeight={20} spacing={10} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toHaveStyle({
        width: '200px',
        height: '20px'
      });
    });

    it('should preserve string values with units', () => {
      render(<SkeletonLine width="50%" lineHeight="2rem" spacing="0.5em" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toHaveStyle({
        width: '50%',
        height: '2rem'
      });
    });

    it('should use default values when not specified', () => {
      render(<SkeletonLine />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toHaveStyle({
        width: '100%',
        height: '1em'
      });
    });

    it('should handle undefined values gracefully', () => {
      render(<SkeletonLine width={undefined} lineHeight={undefined} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toHaveStyle({
        width: '100%',
        height: '1em'
      });
    });
  });

  describe('Multi-line Rendering', () => {
    it('should make last line shorter by default', () => {
      render(<SkeletonLine lines={2} />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '100%' });
      expect(lines[1]).toHaveStyle({ width: '75%' });
    });

    it('should apply custom last line width', () => {
      render(<SkeletonLine lines={2} lastLineWidth="60%" />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '100%' });
      expect(lines[1]).toHaveStyle({ width: '60%' });
    });

    it('should apply custom last line width as number', () => {
      render(<SkeletonLine lines={2} lastLineWidth={80} />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '100%' });
      expect(lines[1]).toHaveStyle({ width: '80px' });
    });

    it('should apply spacing between lines except the last', () => {
      render(<SkeletonLine lines={3} spacing="1rem" />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ marginBottom: '1rem' });
      expect(lines[1]).toHaveStyle({ marginBottom: '1rem' });
      expect(lines[2]).toHaveStyle({ marginBottom: '0px' });
    });

    it('should apply custom line height to all lines', () => {
      render(<SkeletonLine lines={2} lineHeight="1.5rem" />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      lines.forEach(line => {
        expect(line).toHaveStyle({ height: '1.5rem' });
      });
    });

    it('should handle numeric spacing values', () => {
      render(<SkeletonLine lines={2} spacing={8} />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ marginBottom: '8px' });
      expect(lines[1]).toHaveStyle({ marginBottom: '0px' });
    });
  });

  describe('Style and ClassName Handling', () => {
    it('should apply custom className to single line', () => {
      render(<SkeletonLine className="custom-line" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toHaveClass('skeleton-line-single', 'custom-line');
    });

    it('should apply custom className to multi-line container', () => {
      render(<SkeletonLine lines={2} className="custom-lines" />);
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).toHaveClass('skeleton-lines', 'custom-lines');
    });

    it('should apply custom styles to single line', () => {
      const customStyle = { margin: '10px', color: 'red' };
      render(<SkeletonLine style={customStyle} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toHaveStyle({
        margin: '10px',
        color: 'rgb(255, 0, 0)'
      });
    });

    it('should apply custom styles to multi-line container', () => {
      const customStyle = { padding: '5px', border: '1px solid black' };
      render(<SkeletonLine lines={2} style={customStyle} />);
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).toHaveStyle({
        padding: '5px',
        border: '1px solid black'
      });
    });
  });

  describe('Animation and Theme Support', () => {
    it('should pass animation prop to skeleton primitives', () => {
      render(<SkeletonLine animation="wave" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toBeInTheDocument();
      // Animation classes should be applied by SkeletonPrimitive
    });

    it('should pass theme prop to skeleton primitives', () => {
      render(<SkeletonLine theme="dark" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toBeInTheDocument();
      // Theme classes should be applied by SkeletonPrimitive
    });

    it('should pass custom theme to skeleton primitives', () => {
      const customTheme = { baseColor: '#ff0000', highlight: '#ff6666' };
      render(<SkeletonLine theme={customTheme} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toBeInTheDocument();
    });

    it('should pass animation and theme to multi-line skeletons', () => {
      render(<SkeletonLine lines={2} animation="pulse" theme="dark" />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines).toHaveLength(2);
      // Each line should receive the animation and theme props
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes for multi-line', () => {
      render(<SkeletonLine lines={2} />);
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).toHaveAttribute('tabIndex', '-1');
      expect(container).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not interfere with single line accessibility', () => {
      render(<SkeletonLine />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toBeInTheDocument();
      // Single line uses SkeletonPrimitive directly, which handles accessibility
    });
  });

  describe('Line Count Accuracy', () => {
    it('should render exact number of lines specified', () => {
      const testCases = [1, 2, 3, 5, 10];
      
      testCases.forEach(lineCount => {
        document.body.innerHTML = '';
        render(<SkeletonLine lines={lineCount} />);
        
        if (lineCount === 1) {
          // Single line case
          const element = document.querySelector('.skeleton-primitive.skeleton-line');
          expect(element).toBeInTheDocument();
        } else {
          // Multi-line case
          const container = document.querySelector('.skeleton-lines');
          const lines = container!.querySelectorAll('.skeleton-line');
          expect(lines).toHaveLength(lineCount);
        }
      });
    });

    it('should handle large line counts', () => {
      render(<SkeletonLine lines={50} />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(50);
    });
  });

  describe('Line Width Variations', () => {
    it('should apply consistent width to all lines except last', () => {
      render(<SkeletonLine lines={4} width="80%" />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      // First 3 lines should have full width
      for (let i = 0; i < 3; i++) {
        expect(lines[i]).toHaveStyle({ width: '80%' });
      }
      
      // Last line should have reduced width
      expect(lines[3]).toHaveStyle({ width: '75%' });
    });

    it('should handle numeric width values', () => {
      render(<SkeletonLine lines={2} width={150} />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '150px' });
      expect(lines[1]).toHaveStyle({ width: '75%' }); // lastLineWidth default
    });

    it('should handle mixed width units', () => {
      render(<SkeletonLine lines={2} width="10rem" lastLineWidth="8rem" />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '10rem' });
      expect(lines[1]).toHaveStyle({ width: '8rem' });
    });
  });

  describe('Props Forwarding', () => {
    it('should forward additional props to SkeletonPrimitive for single line', () => {
      render(<SkeletonLine data-testid="single-line" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toHaveAttribute('data-testid', 'single-line');
    });

    it('should forward additional props to container for multi-line', () => {
      render(<SkeletonLine lines={2} data-testid="multi-line" />);
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).toHaveAttribute('data-testid', 'multi-line');
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative line counts', () => {
      render(<SkeletonLine lines={-1} />);
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).toBeInTheDocument();
      
      const lines = container!.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(0);
    });

    it('should handle very small dimensions', () => {
      render(<SkeletonLine width={1} lineHeight={1} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toHaveStyle({
        width: '1px',
        height: '1px'
      });
    });

    it('should handle empty string values', () => {
      render(<SkeletonLine width="" lineHeight="" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toHaveStyle({
        width: '100%', // Default fallback
        height: '1em'  // Default fallback
      });
    });
  });
});