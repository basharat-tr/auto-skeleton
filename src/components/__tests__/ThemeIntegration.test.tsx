import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import { SkeletonThemeProvider, useSkeletonTheme } from '../SkeletonThemeProvider';
import { DynamicSkeleton } from '../DynamicSkeleton';
import { SkeletonPrimitive } from '../SkeletonPrimitive';

// Test component that uses both theme provider and skeleton components
const ThemeTestApp: React.FC = () => {
  const { themePreset, setTheme } = useSkeletonTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{themePreset}</div>
      <button 
        data-testid="switch-theme" 
        onClick={() => setTheme(themePreset === 'light' ? 'dark' : 'light')}
      >
        Switch Theme
      </button>
      <button 
        data-testid="custom-theme" 
        onClick={() => setTheme({ 
          baseColor: '#ff6b6b', 
          highlight: '#feca57',
          animationDuration: '2s'
        })}
      >
        Custom Theme
      </button>
      
      <SkeletonPrimitive 
        data-testid="skeleton-primitive"
        shape="rect" 
        width="100px" 
        height="20px" 
      />
      
      <DynamicSkeleton 
        data-testid="dynamic-skeleton"
        renderSpec={{
          children: [
            { key: 'test-1', shape: 'rect', width: '50px', height: '10px' },
            { key: 'test-2', shape: 'circle', width: '30px', height: '30px' }
          ]
        }}
      />
    </div>
  );
};

describe('Theme Integration', () => {
  describe('Theme Provider Integration', () => {
    it('should apply theme to all skeleton components', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <ThemeTestApp />
        </SkeletonThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      
      // Check that theme provider has correct attributes
      const provider = container.querySelector('.skeleton-theme-provider');
      expect(provider).toHaveAttribute('data-skeleton-theme', 'dark');
      expect(provider).toHaveClass('theme-dark');
    });

    it('should switch themes dynamically', () => {
      const { container } = render(
        <SkeletonThemeProvider>
          <ThemeTestApp />
        </SkeletonThemeProvider>
      );

      // Start with light theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      let provider = container.querySelector('.skeleton-theme-provider');
      expect(provider).toHaveAttribute('data-skeleton-theme', 'light');

      // Switch to dark theme
      act(() => {
        screen.getByTestId('switch-theme').click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      provider = container.querySelector('.skeleton-theme-provider');
      expect(provider).toHaveAttribute('data-skeleton-theme', 'dark');

      // Switch back to light theme
      act(() => {
        screen.getByTestId('switch-theme').click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      provider = container.querySelector('.skeleton-theme-provider');
      expect(provider).toHaveAttribute('data-skeleton-theme', 'light');
    });

    it('should apply custom theme', () => {
      const { container } = render(
        <SkeletonThemeProvider>
          <ThemeTestApp />
        </SkeletonThemeProvider>
      );

      // Switch to custom theme
      act(() => {
        screen.getByTestId('custom-theme').click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      
      const provider = container.querySelector('.skeleton-theme-provider');
      expect(provider).toHaveAttribute('data-skeleton-theme', 'custom');
      expect(provider).toHaveStyle('--skeleton-base-color: #ff6b6b');
      expect(provider).toHaveStyle('--skeleton-highlight-color: #feca57');
      expect(provider).toHaveStyle('--skeleton-animation-duration: 2s');
    });
  });

  describe('Component Theme Inheritance', () => {
    it('should inherit theme from provider in SkeletonPrimitive', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <SkeletonPrimitive 
            data-testid="skeleton-primitive"
            shape="rect" 
            width="100px" 
            height="20px" 
          />
        </SkeletonThemeProvider>
      );

      const primitive = container.querySelector('.skeleton-primitive');
      expect(primitive).toHaveClass('theme-dark');
    });

    it('should inherit theme from provider in DynamicSkeleton', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <DynamicSkeleton 
            renderSpec={{
              children: [
                { key: 'test-1', shape: 'rect', width: '50px', height: '10px' }
              ]
            }}
          />
        </SkeletonThemeProvider>
      );

      const primitives = container.querySelectorAll('.skeleton-primitive');
      primitives.forEach(primitive => {
        expect(primitive).toHaveClass('theme-dark');
      });
    });

    it('should allow prop theme to override provider theme', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <SkeletonPrimitive 
            data-testid="skeleton-primitive"
            shape="rect" 
            width="100px" 
            height="20px"
            theme="light"
          />
        </SkeletonThemeProvider>
      );

      const primitive = container.querySelector('.skeleton-primitive');
      expect(primitive).toHaveClass('theme-light');
      expect(primitive).not.toHaveClass('theme-dark');
    });

    it('should handle custom theme objects in props', () => {
      const customTheme = {
        baseColor: '#ff0000',
        highlight: '#00ff00',
        animationDuration: '3s'
      };

      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <SkeletonPrimitive 
            data-testid="skeleton-primitive"
            shape="rect" 
            width="100px" 
            height="20px"
            theme={customTheme}
          />
        </SkeletonThemeProvider>
      );

      const primitive = container.querySelector('.skeleton-primitive');
      expect(primitive).toHaveStyle('--skeleton-base-color: #ff0000');
      expect(primitive).toHaveStyle('--skeleton-highlight-color: #00ff00');
      expect(primitive).toHaveStyle('--skeleton-animation-duration: 3s');
    });
  });

  describe('Nested Providers', () => {
    it('should handle nested theme providers', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="light">
          <div data-testid="outer-provider">
            <SkeletonPrimitive shape="rect" width="100px" height="20px" />
            <SkeletonThemeProvider theme="dark">
              <div data-testid="inner-provider">
                <SkeletonPrimitive shape="rect" width="100px" height="20px" />
              </div>
            </SkeletonThemeProvider>
          </div>
        </SkeletonThemeProvider>
      );

      const providers = container.querySelectorAll('.skeleton-theme-provider');
      expect(providers).toHaveLength(2);
      
      // Outer provider should be light
      expect(providers[0]).toHaveAttribute('data-skeleton-theme', 'light');
      
      // Inner provider should be dark
      expect(providers[1]).toHaveAttribute('data-skeleton-theme', 'dark');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid custom themes gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const invalidTheme = {
        baseColor: 'invalid-color',
        highlight: 'also-invalid'
      };

      render(
        <SkeletonThemeProvider theme={invalidTheme}>
          <SkeletonPrimitive shape="rect" width="100px" height="20px" />
        </SkeletonThemeProvider>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid custom theme provided:',
        expect.arrayContaining([
          'Invalid baseColor: invalid-color',
          'Invalid highlight color: also-invalid'
        ])
      );

      consoleSpy.mockRestore();
    });

    it('should fall back to light theme for invalid custom themes', () => {
      const { container } = render(
        <SkeletonThemeProvider theme={{ baseColor: 'invalid', highlight: 'invalid' }}>
          <SkeletonPrimitive shape="rect" width="100px" height="20px" />
        </SkeletonThemeProvider>
      );

      const provider = container.querySelector('.skeleton-theme-provider');
      // Should fall back to light theme values
      expect(provider).toHaveStyle('--skeleton-base-color: #e2e8f0');
    });
  });

  describe('Performance', () => {
    it('should memoize theme context value when theme does not change', () => {
      let contextValues: any[] = [];
      
      const TestComponent = () => {
        const contextValue = useSkeletonTheme();
        contextValues.push(contextValue);
        return <div>{contextValue.theme.baseColor}</div>;
      };

      const { rerender } = render(
        <SkeletonThemeProvider theme="light">
          <TestComponent />
        </SkeletonThemeProvider>
      );

      expect(contextValues).toHaveLength(1);

      // Re-render with same theme
      rerender(
        <SkeletonThemeProvider theme="light">
          <TestComponent />
        </SkeletonThemeProvider>
      );

      expect(contextValues).toHaveLength(2);
      // The theme objects should be the same reference due to memoization
      expect(contextValues[0].theme).toBe(contextValues[1].theme);
    });
  });
});