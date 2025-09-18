import React from 'react';
import { render } from '@testing-library/react';
import { SkeletonThemeProvider } from '../SkeletonThemeProvider';
import { SkeletonPrimitive } from '../SkeletonPrimitive';
import { DynamicSkeleton } from '../DynamicSkeleton';

// Mock CSS custom properties for testing
const mockGetComputedStyle = (element: Element) => {
  const styles = new Map();
  
  // Extract CSS custom properties from style attribute
  const styleAttr = element.getAttribute('style');
  if (styleAttr) {
    const matches = styleAttr.match(/--[\w-]+:\s*[^;]+/g);
    if (matches) {
      matches.forEach(match => {
        const [property, value] = match.split(':').map(s => s.trim());
        styles.set(property, value);
      });
    }
  }
  
  return {
    getPropertyValue: (prop: string) => styles.get(prop) || '',
  };
};

// Mock getComputedStyle for testing
Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle,
});

describe('Theme Visual Regression Tests', () => {
  describe('Light Theme Rendering', () => {
    it('should render light theme with correct colors', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="light">
          <SkeletonPrimitive shape="rect" width="100px" height="20px" />
        </SkeletonThemeProvider>
      );

      const provider = container.querySelector('.skeleton-theme-provider');
      const primitive = container.querySelector('.skeleton-primitive');

      expect(provider).toHaveStyle('--skeleton-base-color: #e2e8f0');
      expect(provider).toHaveStyle('--skeleton-highlight-color: #f1f5f9');
      expect(primitive).toHaveClass('theme-light');
    });

    it('should render light theme skeleton spec correctly', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="light">
          <DynamicSkeleton 
            renderSpec={{
              children: [
                { key: 'rect', shape: 'rect', width: '100px', height: '20px' },
                { key: 'circle', shape: 'circle', width: '40px', height: '40px' },
                { key: 'line', shape: 'line', width: '80px', height: '1em', lines: 3 }
              ]
            }}
          />
        </SkeletonThemeProvider>
      );

      const primitives = container.querySelectorAll('.skeleton-primitive');
      expect(primitives.length).toBeGreaterThanOrEqual(3); // At least 1 rect + 1 circle + 1+ lines
      
      primitives.forEach(primitive => {
        expect(primitive).toHaveClass('theme-light');
      });
    });
  });

  describe('Dark Theme Rendering', () => {
    it('should render dark theme with correct colors', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <SkeletonPrimitive shape="rect" width="100px" height="20px" />
        </SkeletonThemeProvider>
      );

      const provider = container.querySelector('.skeleton-theme-provider');
      const primitive = container.querySelector('.skeleton-primitive');

      expect(provider).toHaveStyle('--skeleton-base-color: #374151');
      expect(provider).toHaveStyle('--skeleton-highlight-color: #4b5563');
      expect(primitive).toHaveClass('theme-dark');
    });

    it('should render dark theme with different shapes', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <div>
            <SkeletonPrimitive shape="rect" width="100px" height="20px" />
            <SkeletonPrimitive shape="circle" width="40px" height="40px" />
            <SkeletonPrimitive shape="line" width="80px" height="1em" />
          </div>
        </SkeletonThemeProvider>
      );

      const primitives = container.querySelectorAll('.skeleton-primitive');
      expect(primitives).toHaveLength(3);
      
      primitives.forEach(primitive => {
        expect(primitive).toHaveClass('theme-dark');
      });

      // Check specific shape classes
      expect(primitives[0]).toHaveClass('skeleton-rect');
      expect(primitives[1]).toHaveClass('skeleton-circle');
      expect(primitives[2]).toHaveClass('skeleton-line');
    });
  });

  describe('Custom Theme Rendering', () => {
    it('should render custom theme with specified colors', () => {
      const customTheme = {
        baseColor: '#ff6b6b',
        highlight: '#feca57',
        animationDuration: '2s',
        borderRadius: '8px'
      };

      const { container } = render(
        <SkeletonThemeProvider theme={customTheme}>
          <SkeletonPrimitive shape="rect" width="100px" height="20px" />
        </SkeletonThemeProvider>
      );

      const provider = container.querySelector('.skeleton-theme-provider');
      const primitive = container.querySelector('.skeleton-primitive');

      expect(provider).toHaveStyle('--skeleton-base-color: #ff6b6b');
      expect(provider).toHaveStyle('--skeleton-highlight-color: #feca57');
      expect(provider).toHaveStyle('--skeleton-animation-duration: 2s');
      expect(provider).toHaveStyle('--skeleton-border-radius: 8px');
      expect(primitive).toHaveClass('theme-custom');
    });

    it('should render custom theme with various color formats', () => {
      const customThemes = [
        {
          baseColor: '#ff0000',
          highlight: '#00ff00'
        },
        {
          baseColor: 'rgb(255, 0, 0)',
          highlight: 'rgba(0, 255, 0, 0.8)'
        },
        {
          baseColor: 'hsl(0, 100%, 50%)',
          highlight: 'hsla(120, 100%, 50%, 0.8)'
        }
      ];

      customThemes.forEach((theme, index) => {
        const { container } = render(
          <SkeletonThemeProvider theme={theme}>
            <SkeletonPrimitive shape="rect" width="100px" height="20px" />
          </SkeletonThemeProvider>
        );

        const provider = container.querySelector('.skeleton-theme-provider');
        expect(provider).toHaveStyle(`--skeleton-base-color: ${theme.baseColor}`);
        expect(provider).toHaveStyle(`--skeleton-highlight-color: ${theme.highlight}`);
      });
    });
  });

  describe('Animation Theme Integration', () => {
    it('should apply theme colors to pulse animation', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <SkeletonPrimitive 
            shape="rect" 
            width="100px" 
            height="20px" 
            animation="pulse"
          />
        </SkeletonThemeProvider>
      );

      const primitive = container.querySelector('.skeleton-primitive');
      expect(primitive).toHaveClass('skeleton-animation-pulse');
      expect(primitive).toHaveClass('theme-dark');
    });

    it('should apply theme colors to wave animation', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="light">
          <SkeletonPrimitive 
            shape="rect" 
            width="100px" 
            height="20px" 
            animation="wave"
          />
        </SkeletonThemeProvider>
      );

      const primitive = container.querySelector('.skeleton-primitive');
      expect(primitive).toHaveClass('skeleton-animation-wave');
      expect(primitive).toHaveClass('theme-light');
    });

    it('should apply custom animation duration from theme', () => {
      const customTheme = {
        baseColor: '#ff0000',
        highlight: '#00ff00',
        animationDuration: '3s'
      };

      const { container } = render(
        <SkeletonThemeProvider theme={customTheme}>
          <SkeletonPrimitive 
            shape="rect" 
            width="100px" 
            height="20px" 
            animation="pulse"
          />
        </SkeletonThemeProvider>
      );

      const provider = container.querySelector('.skeleton-theme-provider');
      expect(provider).toHaveStyle('--skeleton-animation-duration: 3s');
    });
  });

  describe('Multi-line Theme Integration', () => {
    it('should apply theme to multi-line skeletons', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <SkeletonPrimitive 
            shape="line" 
            width="100px" 
            height="1em" 
            lines={3}
          />
        </SkeletonThemeProvider>
      );

      const lines = container.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(3);
      
      lines.forEach(line => {
        expect(line).toHaveClass('theme-dark');
      });
    });
  });

  describe('Theme Consistency', () => {
    it('should maintain consistent theme across multiple components', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <div>
            <SkeletonPrimitive shape="rect" width="100px" height="20px" />
            <DynamicSkeleton 
              renderSpec={{
                children: [
                  { key: 'test-1', shape: 'circle', width: '40px', height: '40px' },
                  { key: 'test-2', shape: 'line', width: '80px', height: '1em' }
                ]
              }}
            />
          </div>
        </SkeletonThemeProvider>
      );

      const allPrimitives = container.querySelectorAll('.skeleton-primitive');
      expect(allPrimitives.length).toBeGreaterThan(0);
      
      allPrimitives.forEach(primitive => {
        expect(primitive).toHaveClass('theme-dark');
      });
    });

    it('should handle theme prop overrides consistently', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <div>
            <SkeletonPrimitive 
              shape="rect" 
              width="100px" 
              height="20px" 
              theme="light"
            />
            <SkeletonPrimitive 
              shape="circle" 
              width="40px" 
              height="40px"
            />
          </div>
        </SkeletonThemeProvider>
      );

      const primitives = container.querySelectorAll('.skeleton-primitive');
      
      // First primitive should use prop theme (light)
      expect(primitives[0]).toHaveClass('theme-light');
      expect(primitives[0]).not.toHaveClass('theme-dark');
      
      // Second primitive should use provider theme (dark)
      expect(primitives[1]).toHaveClass('theme-dark');
      expect(primitives[1]).not.toHaveClass('theme-light');
    });
  });

  describe('Accessibility with Themes', () => {
    it('should maintain accessibility attributes with different themes', () => {
      const themes = ['light', 'dark'] as const;
      
      themes.forEach(theme => {
        const { container } = render(
          <SkeletonThemeProvider theme={theme}>
            <DynamicSkeleton 
              renderSpec={{
                children: [
                  { key: 'test', shape: 'rect', width: '100px', height: '20px' }
                ]
              }}
            />
          </SkeletonThemeProvider>
        );

        const skeleton = container.querySelector('.dynamic-skeleton');
        expect(skeleton).toHaveAttribute('role', 'status');
        expect(skeleton).toHaveAttribute('aria-busy', 'true');
        expect(skeleton).toHaveAttribute('aria-live', 'polite');
        
        const primitives = container.querySelectorAll('.skeleton-primitive');
        primitives.forEach(primitive => {
          expect(primitive).toHaveAttribute('tabIndex', '-1');
          expect(primitive).toHaveAttribute('aria-hidden', 'true');
          expect(primitive).toHaveAttribute('role', 'presentation');
        });
      });
    });
  });
});