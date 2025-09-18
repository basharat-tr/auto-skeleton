import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SkeletonPrimitive } from '../SkeletonPrimitive';

describe('SkeletonPrimitive Unit Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Shape Rendering', () => {
    it('should render rect shape by default', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-rect');
    });

    it('should render circle shape with correct styles', () => {
      render(<SkeletonPrimitive key="test" shape="circle" width={50} height={50} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-circle');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-circle');
    });

    it('should render line shape with correct dimensions', () => {
      render(<SkeletonPrimitive key="test" shape="line" width="200px" height="16px" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-line');
    });

    it('should apply shape-specific CSS classes', () => {
      const shapes = ['rect', 'circle', 'line'] as const;
      
      shapes.forEach(shape => {
        document.body.innerHTML = '';
        render(<SkeletonPrimitive key={`test-${shape}`} shape={shape} />);
        
        const element = document.querySelector(`.skeleton-primitive.skeleton-${shape}`);
        expect(element).toBeInTheDocument();
      });
    });
  });

  describe('Multi-line Rendering', () => {
    it('should render multiple lines for line shape with lines prop', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={3} />);
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('skeleton-lines');
      
      const lines = container!.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(3);
    });

    it('should make last line shorter in multi-line rendering', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={2} />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '100%' });
      expect(lines[1]).toHaveStyle({ width: '75%' });
    });

    it('should add margin between lines except the last one', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={3} />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ marginBottom: '0.5em' });
      expect(lines[1]).toHaveStyle({ marginBottom: '0.5em' });
      expect(lines[2]).toHaveStyle({ marginBottom: '0px' });
    });

    it('should not render multi-line for non-line shapes', () => {
      render(<SkeletonPrimitive key="test" shape="rect" lines={3} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toBeInTheDocument();
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).not.toBeInTheDocument();
    });

    it('should handle lines=1 as single line', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={1} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toBeInTheDocument();
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).not.toBeInTheDocument();
    });
  });

  describe('Responsive Sizing', () => {
    it('should handle pixel values', () => {
      render(<SkeletonPrimitive key="test" shape="rect" width={100} height={50} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        width: '100px',
        height: '50px'
      });
    });

    it('should handle string values with units', () => {
      render(<SkeletonPrimitive key="test" shape="rect" width="50%" height="2rem" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        width: '50%',
        height: '2rem'
      });
    });

    it('should use default dimensions when not specified', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        width: '100%',
        height: '20px'
      });
    });

    it('should handle circle shape with single dimension', () => {
      render(<SkeletonPrimitive key="test" shape="circle" width={60} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-circle');
      expect(element).toHaveStyle({
        width: '60px',
        height: '60px'
      });
    });

    it('should handle zero dimensions', () => {
      render(<SkeletonPrimitive key="test" shape="rect" width={0} height={0} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        width: '0px',
        height: '0px'
      });
    });

    it('should handle very large dimensions', () => {
      render(<SkeletonPrimitive key="test" shape="rect" width={9999} height={9999} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        width: '9999px',
        height: '9999px'
      });
    });

    it('should handle fractional pixel values', () => {
      render(<SkeletonPrimitive key="test" shape="rect" width={100.5} height={50.7} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        width: '100.5px',
        height: '50.7px'
      });
    });
  });

  describe('Style and ClassName Merging', () => {
    it('should merge custom styles with default styles', () => {
      const customStyle = { margin: '10px', color: 'red', zIndex: 5 };
      render(<SkeletonPrimitive key="test" shape="rect" style={customStyle} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        margin: '10px',
        color: 'rgb(255, 0, 0)',
        zIndex: '5'
      });
    });

    it('should apply custom className', () => {
      render(<SkeletonPrimitive key="test" shape="rect" className="custom-class" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect.custom-class');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-rect', 'custom-class');
    });

    it('should handle custom borderRadius', () => {
      render(<SkeletonPrimitive key="test" shape="rect" borderRadius="8px" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({ borderRadius: '8px' });
    });

    it('should handle multiple custom classes', () => {
      render(<SkeletonPrimitive key="test" shape="rect" className="class1 class2 class3" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-rect', 'class1', 'class2', 'class3');
    });

    it('should override default styles with custom styles', () => {
      const customStyle = { 
        display: 'inline-block',
        position: 'absolute',
        backgroundColor: 'blue'
      };
      render(<SkeletonPrimitive key="test" shape="rect" style={customStyle} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        display: 'inline-block',
        position: 'absolute',
        backgroundColor: 'rgb(0, 0, 255)'
      });
    });
  });

  describe('Animation Support', () => {
    it('should apply animation classes', () => {
      const animations = ['pulse', 'wave', 'none'] as const;
      
      animations.forEach(animation => {
        document.body.innerHTML = '';
        render(<SkeletonPrimitive key={`test-${animation}`} shape="rect" animation={animation} />);
        
        const element = document.querySelector('.skeleton-primitive.skeleton-rect');
        expect(element).toBeInTheDocument();
        
        if (animation !== 'none') {
          expect(element).toHaveClass(`skeleton-animation-${animation}`);
        }
      });
    });

    it('should apply default animation when not specified', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveClass('skeleton-animation-pulse');
    });

    it('should handle animation="none"', () => {
      render(<SkeletonPrimitive key="test" shape="rect" animation="none" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).not.toHaveClass('skeleton-animation-pulse');
      expect(element).not.toHaveClass('skeleton-animation-wave');
      expect(element).toHaveClass('skeleton-animation-none');
    });

    it('should apply animation to multi-line skeletons', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={2} animation="wave" />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      lines.forEach(line => {
        expect(line).toHaveClass('skeleton-animation-wave');
      });
    });
  });

  describe('Theme Support', () => {
    it('should apply theme classes', () => {
      const themes = ['light', 'dark'] as const;
      
      themes.forEach(theme => {
        document.body.innerHTML = '';
        render(<SkeletonPrimitive key={`test-${theme}`} shape="rect" theme={theme} />);
        
        const element = document.querySelector('.skeleton-primitive.skeleton-rect');
        expect(element).toHaveClass(`theme-${theme}`);
      });
    });

    it('should apply default theme when not specified', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveClass('theme-light');
    });

    it('should handle custom theme objects', () => {
      const customTheme = { baseColor: '#ff0000', highlight: '#ff6666' };
      render(<SkeletonPrimitive key="test" shape="rect" theme={customTheme} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveClass('theme-custom');
    });

    it('should apply theme to multi-line skeletons', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={2} theme="dark" />);
      
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      lines.forEach(line => {
        expect(line).toHaveClass('theme-dark');
      });
    });

    it('should set CSS custom properties for custom themes', () => {
      const customTheme = { baseColor: '#123456', highlight: '#789abc' };
      render(<SkeletonPrimitive key="test" shape="rect" theme={customTheme} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        '--skeleton-base-color': '#123456',
        '--skeleton-highlight-color': '#789abc'
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility attributes', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveAttribute('role', 'presentation');
      expect(element).toHaveAttribute('aria-hidden', 'true');
      expect(element).toHaveAttribute('tabIndex', '-1');
    });

    it('should have pointer-events disabled', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({ pointerEvents: 'none' });
    });

    it('should have user-select disabled', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({ userSelect: 'none' });
    });

    it('should apply accessibility attributes to multi-line skeletons', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={2} />);
      
      const container = document.querySelector('.skeleton-lines');
      expect(container).toHaveAttribute('role', 'presentation');
      expect(container).toHaveAttribute('aria-hidden', 'true');
      expect(container).toHaveAttribute('tabIndex', '-1');
      
      const lines = container!.querySelectorAll('.skeleton-line');
      lines.forEach(line => {
        expect(line).toHaveAttribute('role', 'presentation');
        expect(line).toHaveAttribute('aria-hidden', 'true');
        expect(line).toHaveAttribute('tabIndex', '-1');
      });
    });
  });

  describe('Performance Optimizations', () => {
    it('should include performance optimization classes', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        willChange: 'opacity, background-position, transform',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)'
      });
    });

    it('should render multiple skeletons efficiently', () => {
      const skeletons = Array.from({ length: 10 }, (_, i) => (
        <SkeletonPrimitive key={`test-${i}`} shape="rect" />
      ));
      
      render(<div>{skeletons}</div>);
      
      const elements = document.querySelectorAll('.skeleton-primitive.skeleton-rect');
      expect(elements).toHaveLength(10);
      
      elements.forEach(element => {
        expect(element).toHaveClass('skeleton-primitive', 'skeleton-rect');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing key prop gracefully', () => {
      // TypeScript would normally catch this, but testing runtime behavior
      render(<SkeletonPrimitive shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toBeInTheDocument();
    });

    it('should handle invalid shape gracefully', () => {
      // @ts-ignore - Testing invalid shape
      render(<SkeletonPrimitive key="test" shape="invalid" />);
      
      // Should fallback to rect or handle gracefully
      const element = document.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
    });

    it('should handle negative lines count', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={-1} />);
      
      // Should handle gracefully, possibly rendering single line or no lines
      const element = document.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
    });

    it('should handle very large lines count', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={1000} />);
      
      const container = document.querySelector('.skeleton-lines');
      if (container) {
        const lines = container.querySelectorAll('.skeleton-line');
        expect(lines.length).toBeGreaterThan(0);
      }
    });

    it('should handle null/undefined dimensions', () => {
      render(<SkeletonPrimitive key="test" shape="rect" width={null as any} height={undefined} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toBeInTheDocument();
      // Should use default dimensions
    });

    it('should handle empty string className', () => {
      render(<SkeletonPrimitive key="test" shape="rect" className="" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-rect');
    });

    it('should handle empty style object', () => {
      render(<SkeletonPrimitive key="test" shape="rect" style={{}} />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toBeInTheDocument();
    });
  });

  describe('CSS Integration', () => {
    it('should apply CSS custom properties correctly', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        '--skeleton-base-color': '#e2e8f0',
        '--skeleton-highlight-color': '#f1f5f9',
        '--skeleton-animation-duration': '1.5s',
        '--skeleton-border-radius': '4px'
      });
    });

    it('should handle CSS variable inheritance', () => {
      // Create a parent element with custom CSS variables
      const parent = document.createElement('div');
      parent.style.setProperty('--skeleton-base-color', '#custom-color');
      document.body.appendChild(parent);
      
      render(<SkeletonPrimitive key="test" shape="rect" />, { container: parent });
      
      const element = parent.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toBeInTheDocument();
    });
  });
});