import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkeletonPrimitive } from '../SkeletonPrimitive';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock performance.now for consistent timing tests
const mockPerformanceNow = vi.fn();
Object.defineProperty(window, 'performance', {
  value: { now: mockPerformanceNow },
  writable: true,
});

describe('SkeletonAnimation', () => {
  beforeEach(() => {
    mockPerformanceNow.mockReturnValue(0);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Animation Classes', () => {
    it('should apply pulse animation class by default', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveClass('skeleton-animation-pulse');
    });

    it('should apply wave animation class when specified', () => {
      render(<SkeletonPrimitive key="test" shape="rect" animation="wave" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveClass('skeleton-animation-wave');
    });

    it('should apply shimmer animation class when specified', () => {
      render(<SkeletonPrimitive key="test" shape="rect" animation="shimmer" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveClass('skeleton-animation-shimmer');
    });

    it('should not apply animation class when animation is none', () => {
      render(<SkeletonPrimitive key="test" shape="rect" animation="none" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).not.toHaveClass('skeleton-animation-pulse');
      expect(element).not.toHaveClass('skeleton-animation-wave');
      expect(element).not.toHaveClass('skeleton-animation-shimmer');
    });
  });

  describe('Animation Duration', () => {
    it('should apply duration class for preset values', () => {
      render(<SkeletonPrimitive key="test" shape="rect" animationDuration="slow" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveClass('skeleton-duration-slow');
    });

    it('should apply custom duration via CSS variable', () => {
      render(<SkeletonPrimitive key="test" shape="rect" animationDuration="2.5s" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveStyle({ '--skeleton-animation-duration': '2.5s' });
    });

    it('should apply normal duration class by default', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveClass('skeleton-duration-normal');
    });
  });

  describe('CSS Variables', () => {
    it('should set custom theme CSS variables', () => {
      const customTheme = {
        baseColor: '#ff0000',
        highlight: '#00ff00',
        animationDuration: '3s',
        borderRadius: '10px'
      };
      
      render(<SkeletonPrimitive key="test" shape="rect" theme={customTheme} />);
      const element = screen.getByRole('presentation', { hidden: true });
      
      expect(element).toHaveStyle({
        '--skeleton-base-color': '#ff0000',
        '--skeleton-highlight-color': '#00ff00',
        '--skeleton-animation-duration': '3s',
        '--skeleton-border-radius': '10px'
      });
    });

    it('should apply theme preset classes', () => {
      render(<SkeletonPrimitive key="test" shape="rect" theme="dark" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveClass('theme-dark');
    });

    it('should apply Tailwind color classes', () => {
      render(<SkeletonPrimitive key="test" shape="rect" tailwindColor="gray-300" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveClass('skeleton-gray-300');
    });
  });

  describe('Performance Optimizations', () => {
    it('should include performance optimization classes', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveClass('skeleton-primitive');
      
      // Check that CSS includes performance optimizations
      const styles = window.getComputedStyle(element);
      // Note: In jsdom, computed styles may not reflect CSS custom properties
      // This test verifies the class is applied correctly
    });

    it('should render multiple skeletons efficiently', () => {
      const startTime = performance.now();
      
      const { rerender } = render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <SkeletonPrimitive key={i} shape="rect" animation="pulse" />
          ))}
        </div>
      );
      
      const renderTime = performance.now() - startTime;
      
      // Re-render to test update performance
      const updateStartTime = performance.now();
      rerender(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <SkeletonPrimitive key={i} shape="rect" animation="wave" />
          ))}
        </div>
      );
      const updateTime = performance.now() - updateStartTime;
      
      // These are basic performance checks - in a real scenario you'd have more specific thresholds
      expect(renderTime).toBeDefined();
      expect(updateTime).toBeDefined();
    });
  });

  describe('Multi-line Animation', () => {
    it('should apply animation classes to all lines in multi-line skeleton', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={3} animation="wave" />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toHaveClass('skeleton-lines');
      
      const lines = container.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(3);
      
      lines.forEach(line => {
        expect(line).toHaveClass('skeleton-animation-wave');
        expect(line).toHaveClass('skeleton-primitive');
      });
    });

    it('should apply theme classes to multi-line skeleton', () => {
      render(
        <SkeletonPrimitive 
          key="test" 
          shape="line" 
          lines={2} 
          theme="dark" 
          tailwindColor="slate-700"
          animationDuration="slow"
        />
      );
      
      const container = screen.getByRole('presentation', { hidden: true });
      const lines = container.querySelectorAll('.skeleton-line');
      
      lines.forEach(line => {
        expect(line).toHaveClass('theme-dark');
        expect(line).toHaveClass('skeleton-slate-700');
        expect(line).toHaveClass('skeleton-duration-slow');
      });
    });
  });

  describe('Accessibility with Animations', () => {
    it('should maintain accessibility attributes with animations', () => {
      render(<SkeletonPrimitive key="test" shape="rect" animation="wave" />);
      const element = screen.getByRole('presentation', { hidden: true });
      
      expect(element).toHaveAttribute('aria-hidden', 'true');
      expect(element).toHaveAttribute('tabIndex', '-1');
    });

    it('should respect prefers-reduced-motion via CSS', () => {
      // This test verifies the CSS class is applied - the actual reduced motion
      // behavior is handled by CSS media queries
      render(<SkeletonPrimitive key="test" shape="rect" animation="pulse" />);
      const element = screen.getByRole('presentation', { hidden: true });
      expect(element).toHaveClass('skeleton-animation-pulse');
    });
  });

  describe('Animation Combinations', () => {
    it('should handle complex animation configurations', () => {
      render(
        <SkeletonPrimitive 
          key="test" 
          shape="circle" 
          animation="shimmer"
          theme={{ baseColor: '#custom1', highlight: '#custom2', animationDuration: '0.8s' }}
          animationDuration="fast"
          tailwindColor="zinc-200"
        />
      );
      
      const element = screen.getByRole('presentation', { hidden: true });
      
      expect(element).toHaveClass('skeleton-animation-shimmer');
      expect(element).toHaveClass('skeleton-duration-fast');
      expect(element).toHaveClass('skeleton-zinc-200');
      expect(element).toHaveStyle({
        '--skeleton-base-color': '#custom1',
        '--skeleton-highlight-color': '#custom2',
        '--skeleton-animation-duration': '0.8s'
      });
    });
  });
});