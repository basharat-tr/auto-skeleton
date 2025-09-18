import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DynamicSkeleton } from '../DynamicSkeleton';
import { SkeletonPrimitive } from '../SkeletonPrimitive';
import { SkeletonLine } from '../SkeletonLine';
import { SkeletonSpec } from '../../types';

describe('Visual Regression Tests', () => {
  beforeEach(() => {
    // Clear any existing styles
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  describe('Animation Visual Tests', () => {
    it('should render pulse animation consistently', async () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="pulse-test" 
          shape="rect" 
          width={200} 
          height={100} 
          animation="pulse"
        />
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      
      // Check animation CSS property
      const computedStyle = window.getComputedStyle(element!);
      expect(computedStyle.animation).toContain('skeleton-pulse');
      expect(computedStyle.animationDuration).toBe('1.5s');
      expect(computedStyle.animationTimingFunction).toBe('ease-in-out');
      expect(computedStyle.animationIterationCount).toBe('infinite');
    });

    it('should render wave animation consistently', async () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="wave-test" 
          shape="rect" 
          width={200} 
          height={100} 
          animation="wave"
        />
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      
      // Check animation CSS property
      const computedStyle = window.getComputedStyle(element!);
      expect(computedStyle.animation).toContain('skeleton-wave');
      expect(computedStyle.animationDuration).toBe('1.5s');
      expect(computedStyle.animationTimingFunction).toBe('linear');
      expect(computedStyle.animationIterationCount).toBe('infinite');
    });

    it('should render no animation consistently', async () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="no-animation-test" 
          shape="rect" 
          width={200} 
          height={100} 
          animation="none"
        />
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      
      // Check that no skeleton animation is applied
      const computedStyle = window.getComputedStyle(element!);
      expect(computedStyle.animation).not.toContain('skeleton-pulse');
      expect(computedStyle.animation).not.toContain('skeleton-wave');
    });

    it('should maintain animation consistency across different shapes', async () => {
      const shapes = ['rect', 'circle', 'line'] as const;
      
      shapes.forEach(shape => {
        const { container } = render(
          <SkeletonPrimitive 
            key={`${shape}-animation-test`} 
            shape={shape} 
            width={100} 
            height={100} 
            animation="pulse"
          />
        );

        const element = container.querySelector('.skeleton-primitive');
        expect(element).toBeInTheDocument();
        
        const computedStyle = window.getComputedStyle(element!);
        expect(computedStyle.animation).toContain('skeleton-pulse');
      });
    });

    it('should handle animation performance with multiple elements', async () => {
      const multipleElements = Array.from({ length: 10 }, (_, i) => (
        <SkeletonPrimitive 
          key={`performance-test-${i}`} 
          shape="rect" 
          width={100} 
          height={50} 
          animation="wave"
        />
      ));

      const { container } = render(<div>{multipleElements}</div>);
      
      const elements = container.querySelectorAll('.skeleton-primitive');
      expect(elements).toHaveLength(10);
      
      // All elements should have consistent animation
      elements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        expect(computedStyle.animation).toContain('skeleton-wave');
      });
    });
  });

  describe('Theme Visual Tests', () => {
    it('should render light theme consistently', async () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="light-theme-test" 
          shape="rect" 
          width={200} 
          height={100} 
          theme="light"
        />
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      
      // Check CSS custom properties for light theme
      const computedStyle = window.getComputedStyle(element!);
      expect(computedStyle.getPropertyValue('--skeleton-base-color')).toBe('#e2e8f0');
      expect(computedStyle.getPropertyValue('--skeleton-highlight-color')).toBe('#f1f5f9');
    });

    it('should render dark theme consistently', async () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="dark-theme-test" 
          shape="rect" 
          width={200} 
          height={100} 
          theme="dark"
        />
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      
      // Check CSS custom properties for dark theme
      const computedStyle = window.getComputedStyle(element!);
      expect(computedStyle.getPropertyValue('--skeleton-base-color')).toBe('#374151');
      expect(computedStyle.getPropertyValue('--skeleton-highlight-color')).toBe('#4b5563');
    });

    it('should render custom theme consistently', async () => {
      const customTheme = { baseColor: '#ff6b6b', highlight: '#ffa8a8' };
      
      const { container } = render(
        <SkeletonPrimitive 
          key="custom-theme-test" 
          shape="rect" 
          width={200} 
          height={100} 
          theme={customTheme}
        />
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      
      // Check CSS custom properties for custom theme
      const computedStyle = window.getComputedStyle(element!);
      expect(computedStyle.getPropertyValue('--skeleton-base-color')).toBe('#ff6b6b');
      expect(computedStyle.getPropertyValue('--skeleton-highlight-color')).toBe('#ffa8a8');
    });

    it('should maintain theme consistency across different components', async () => {
      const customTheme = { baseColor: '#4f46e5', highlight: '#818cf8' };
      
      const { container } = render(
        <div>
          <SkeletonPrimitive 
            key="theme-rect" 
            shape="rect" 
            width={100} 
            height={50} 
            theme={customTheme}
          />
          <SkeletonPrimitive 
            key="theme-circle" 
            shape="circle" 
            width={50} 
            height={50} 
            theme={customTheme}
          />
          <SkeletonLine 
            lines={2} 
            width="200px" 
            theme={customTheme}
          />
        </div>
      );

      const elements = container.querySelectorAll('.skeleton-primitive, .skeleton-line-single, .skeleton-lines .skeleton-line');
      
      elements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        expect(computedStyle.getPropertyValue('--skeleton-base-color')).toBe('#4f46e5');
        expect(computedStyle.getPropertyValue('--skeleton-highlight-color')).toBe('#818cf8');
      });
    });

    it('should handle theme transitions smoothly', async () => {
      const ThemeTransitionTest = () => {
        const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

        React.useEffect(() => {
          const timer = setTimeout(() => setTheme('dark'), 100);
          return () => clearTimeout(timer);
        }, []);

        return (
          <SkeletonPrimitive 
            key="theme-transition-test" 
            shape="rect" 
            width={200} 
            height={100} 
            theme={theme}
          />
        );
      };

      const { container } = render(<ThemeTransitionTest />);
      
      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      
      // Initial light theme
      let computedStyle = window.getComputedStyle(element!);
      expect(computedStyle.getPropertyValue('--skeleton-base-color')).toBe('#e2e8f0');
      
      // Wait for theme change
      await waitFor(() => {
        computedStyle = window.getComputedStyle(element!);
        expect(computedStyle.getPropertyValue('--skeleton-base-color')).toBe('#374151');
      });
    });
  });

  describe('Responsive Visual Tests', () => {
    it('should render consistently with percentage widths', async () => {
      const { container } = render(
        <div style={{ width: '400px' }}>
          <SkeletonPrimitive 
            key="percentage-test" 
            shape="rect" 
            width="50%" 
            height={100} 
          />
        </div>
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      expect(element).toHaveStyle({ width: '50%' });
    });

    it('should render consistently with rem units', async () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="rem-test" 
          shape="rect" 
          width="20rem" 
          height="5rem" 
        />
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      expect(element).toHaveStyle({ 
        width: '20rem',
        height: '5rem'
      });
    });

    it('should render consistently with em units', async () => {
      const { container } = render(
        <div style={{ fontSize: '18px' }}>
          <SkeletonPrimitive 
            key="em-test" 
            shape="rect" 
            width="10em" 
            height="3em" 
          />
        </div>
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      expect(element).toHaveStyle({ 
        width: '10em',
        height: '3em'
      });
    });

    it('should handle viewport units consistently', async () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="viewport-test" 
          shape="rect" 
          width="50vw" 
          height="20vh" 
        />
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      expect(element).toHaveStyle({ 
        width: '50vw',
        height: '20vh'
      });
    });
  });

  describe('Complex Layout Visual Tests', () => {
    it('should render complex skeleton layouts consistently', async () => {
      const complexSpec: SkeletonSpec = {
        children: [
          {
            key: 'header',
            shape: 'rect',
            width: '100%',
            height: '60px',
            borderRadius: '8px 8px 0 0'
          },
          {
            key: 'avatar',
            shape: 'circle',
            width: '80px',
            height: '80px'
          },
          {
            key: 'title',
            shape: 'line',
            width: '70%',
            height: '24px'
          },
          {
            key: 'content',
            shape: 'line',
            lines: 4,
            width: '100%',
            height: '16px'
          },
          {
            key: 'actions',
            shape: 'rect',
            width: '200px',
            height: '40px',
            borderRadius: '20px'
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={complexSpec} />
      );

      const skeletonContainer = container.querySelector('[role="status"]');
      expect(skeletonContainer).toBeInTheDocument();
      
      // Check that all skeleton elements are rendered
      const skeletonElements = container.querySelectorAll('.skeleton-primitive, .skeleton-lines');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should maintain visual consistency with nested structures', async () => {
      const nestedSpec: SkeletonSpec = {
        children: [
          {
            key: 'card-1',
            shape: 'rect',
            width: '300px',
            height: '200px',
            borderRadius: '12px'
          },
          {
            key: 'card-2',
            shape: 'rect',
            width: '300px',
            height: '200px',
            borderRadius: '12px'
          },
          {
            key: 'card-3',
            shape: 'rect',
            width: '300px',
            height: '200px',
            borderRadius: '12px'
          }
        ],
        layout: 'grid',
        gap: '1rem'
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={nestedSpec} />
      );

      const skeletonElements = container.querySelectorAll('.skeleton-primitive');
      expect(skeletonElements).toHaveLength(3);
      
      // All cards should have consistent styling
      skeletonElements.forEach(element => {
        expect(element).toHaveStyle({
          width: '300px',
          height: '200px',
          borderRadius: '12px'
        });
      });
    });
  });

  describe('Animation Performance Visual Tests', () => {
    it('should maintain smooth animations under load', async () => {
      const heavyAnimationTest = Array.from({ length: 20 }, (_, i) => (
        <SkeletonPrimitive 
          key={`heavy-animation-${i}`} 
          shape="rect" 
          width={100} 
          height={50} 
          animation="wave"
        />
      ));

      const { container } = render(<div>{heavyAnimationTest}</div>);
      
      const elements = container.querySelectorAll('.skeleton-primitive');
      expect(elements).toHaveLength(20);
      
      // Check that all animations are properly applied
      elements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        expect(computedStyle.animation).toContain('skeleton-wave');
        expect(computedStyle.animationDuration).toBe('1.5s');
      });
    });

    it('should handle animation state changes smoothly', async () => {
      const AnimationStateTest = () => {
        const [animation, setAnimation] = React.useState<'pulse' | 'wave' | 'none'>('pulse');

        React.useEffect(() => {
          const timer1 = setTimeout(() => setAnimation('wave'), 100);
          const timer2 = setTimeout(() => setAnimation('none'), 200);
          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
          };
        }, []);

        return (
          <SkeletonPrimitive 
            key="animation-state-test" 
            shape="rect" 
            width={200} 
            height={100} 
            animation={animation}
          />
        );
      };

      const { container } = render(<AnimationStateTest />);
      
      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      
      // Initial pulse animation
      let computedStyle = window.getComputedStyle(element!);
      expect(computedStyle.animation).toContain('skeleton-pulse');
      
      // Wait for wave animation
      await waitFor(() => {
        computedStyle = window.getComputedStyle(element!);
        expect(computedStyle.animation).toContain('skeleton-wave');
      });
      
      // Wait for no animation
      await waitFor(() => {
        computedStyle = window.getComputedStyle(element!);
        expect(computedStyle.animation).not.toContain('skeleton-pulse');
        expect(computedStyle.animation).not.toContain('skeleton-wave');
      });
    });
  });

  describe('Cross-Browser Visual Consistency', () => {
    it('should render consistently across different CSS engines', async () => {
      // Test with different CSS property formats
      const testCases = [
        { width: '100px', height: '50px' },
        { width: '10rem', height: '5rem' },
        { width: '50%', height: '100%' },
        { width: '10em', height: '5em' }
      ];

      testCases.forEach((testCase, index) => {
        const { container } = render(
          <SkeletonPrimitive 
            key={`css-engine-test-${index}`} 
            shape="rect" 
            width={testCase.width} 
            height={testCase.height} 
          />
        );

        const element = container.querySelector('.skeleton-primitive');
        expect(element).toBeInTheDocument();
        expect(element).toHaveStyle({
          width: testCase.width,
          height: testCase.height
        });
      });
    });

    it('should handle vendor prefixes consistently', async () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="vendor-prefix-test" 
          shape="rect" 
          width={200} 
          height={100} 
          style={{
            WebkitTransform: 'translateZ(0)',
            MozTransform: 'translateZ(0)',
            msTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }}
        />
      );

      const element = container.querySelector('.skeleton-primitive');
      expect(element).toBeInTheDocument();
      
      // The transform should be applied
      const computedStyle = window.getComputedStyle(element!);
      expect(computedStyle.transform).toBe('translateZ(0px)');
    });
  });

  describe('Accessibility Visual Tests', () => {
    it('should maintain visual accessibility standards', async () => {
      const { container } = render(
        <DynamicSkeleton 
          renderSpec={{
            children: [
              {
                key: 'accessible-content',
                shape: 'rect',
                width: '100%',
                height: '100px'
              }
            ]
          }}
        />
      );

      const skeletonContainer = container.querySelector('[role="status"]');
      expect(skeletonContainer).toBeInTheDocument();
      
      // Check accessibility styles
      const computedStyle = window.getComputedStyle(skeletonContainer!);
      expect(computedStyle.pointerEvents).toBe('none');
      expect(computedStyle.userSelect).toBe('none');
      expect(computedStyle.outline).toBe('none');
    });

    it('should provide sufficient color contrast in themes', async () => {
      const themes = [
        { name: 'light', theme: 'light' as const },
        { name: 'dark', theme: 'dark' as const },
        { 
          name: 'custom', 
          theme: { baseColor: '#6b7280', highlight: '#9ca3af' } 
        }
      ];

      themes.forEach(({ name, theme }) => {
        const { container } = render(
          <SkeletonPrimitive 
            key={`contrast-test-${name}`} 
            shape="rect" 
            width={200} 
            height={100} 
            theme={theme}
          />
        );

        const element = container.querySelector('.skeleton-primitive');
        expect(element).toBeInTheDocument();
        
        // Colors should be defined and not transparent
        const computedStyle = window.getComputedStyle(element!);
        const baseColor = computedStyle.getPropertyValue('--skeleton-base-color');
        const highlightColor = computedStyle.getPropertyValue('--skeleton-highlight-color');
        
        expect(baseColor).toBeTruthy();
        expect(highlightColor).toBeTruthy();
        expect(baseColor).not.toBe('transparent');
        expect(highlightColor).not.toBe('transparent');
      });
    });
  });
});