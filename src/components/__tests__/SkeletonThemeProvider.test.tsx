import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import { 
  SkeletonThemeProvider, 
  useSkeletonTheme, 
  LIGHT_THEME, 
  DARK_THEME,
  createSkeletonTheme,
  validateSkeletonTheme
} from '../SkeletonThemeProvider';

// Test component to access theme context
const TestComponent: React.FC = () => {
  const { theme, themePreset, setTheme } = useSkeletonTheme();
  
  return (
    <div>
      <div data-testid="theme-preset">{themePreset}</div>
      <div data-testid="base-color">{theme.baseColor}</div>
      <div data-testid="highlight-color">{theme.highlightColor}</div>
      <div data-testid="animation-duration">{theme.animationDuration}</div>
      <button 
        data-testid="switch-to-dark" 
        onClick={() => setTheme('dark')}
      >
        Switch to Dark
      </button>
      <button 
        data-testid="switch-to-light" 
        onClick={() => setTheme('light')}
      >
        Switch to Light
      </button>
      <button 
        data-testid="switch-to-custom" 
        onClick={() => setTheme({ baseColor: '#ff0000', highlight: '#00ff00' })}
      >
        Switch to Custom
      </button>
    </div>
  );
};

describe('SkeletonThemeProvider', () => {
  describe('Theme Presets', () => {
    it('should provide light theme by default', () => {
      render(
        <SkeletonThemeProvider>
          <TestComponent />
        </SkeletonThemeProvider>
      );

      expect(screen.getByTestId('theme-preset')).toHaveTextContent('light');
      expect(screen.getByTestId('base-color')).toHaveTextContent(LIGHT_THEME.baseColor);
      expect(screen.getByTestId('highlight-color')).toHaveTextContent(LIGHT_THEME.highlightColor);
    });

    it('should provide dark theme when specified', () => {
      render(
        <SkeletonThemeProvider theme="dark">
          <TestComponent />
        </SkeletonThemeProvider>
      );

      expect(screen.getByTestId('theme-preset')).toHaveTextContent('dark');
      expect(screen.getByTestId('base-color')).toHaveTextContent(DARK_THEME.baseColor);
      expect(screen.getByTestId('highlight-color')).toHaveTextContent(DARK_THEME.highlightColor);
    });

    it('should apply theme CSS variables to provider element', () => {
      const { container } = render(
        <SkeletonThemeProvider theme="dark">
          <TestComponent />
        </SkeletonThemeProvider>
      );

      const provider = container.querySelector('.skeleton-theme-provider');
      expect(provider).toHaveAttribute('data-skeleton-theme', 'dark');
      expect(provider).toHaveClass('theme-dark');
      
      const styles = getComputedStyle(provider!);
      expect(provider).toHaveStyle(`--skeleton-base-color: ${DARK_THEME.baseColor}`);
    });
  });

  describe('Custom Themes', () => {
    it('should handle custom theme objects', () => {
      const customTheme = {
        baseColor: '#ff0000',
        highlight: '#00ff00',
        animationDuration: '2s',
        borderRadius: '8px'
      };

      render(
        <SkeletonThemeProvider theme={customTheme}>
          <TestComponent />
        </SkeletonThemeProvider>
      );

      expect(screen.getByTestId('theme-preset')).toHaveTextContent('custom');
      expect(screen.getByTestId('base-color')).toHaveTextContent('#ff0000');
      expect(screen.getByTestId('highlight-color')).toHaveTextContent('#00ff00');
      expect(screen.getByTestId('animation-duration')).toHaveTextContent('2s');
    });

    it('should validate custom theme colors', () => {
      const invalidTheme = {
        baseColor: 'invalid-color',
        highlight: '#00ff00'
      };

      // Should fall back to light theme for invalid colors
      render(
        <SkeletonThemeProvider theme={invalidTheme}>
          <TestComponent />
        </SkeletonThemeProvider>
      );

      expect(screen.getByTestId('base-color')).toHaveTextContent(LIGHT_THEME.baseColor);
    });

    it('should handle partial custom themes', () => {
      const partialTheme = {
        baseColor: '#ff0000',
        highlight: '#00ff00'
        // Missing animationDuration and borderRadius
      };

      render(
        <SkeletonThemeProvider theme={partialTheme}>
          <TestComponent />
        </SkeletonThemeProvider>
      );

      expect(screen.getByTestId('base-color')).toHaveTextContent('#ff0000');
      expect(screen.getByTestId('animation-duration')).toHaveTextContent('1.5s'); // Default
    });
  });

  describe('Theme Switching', () => {
    it('should allow switching between themes', () => {
      render(
        <SkeletonThemeProvider>
          <TestComponent />
        </SkeletonThemeProvider>
      );

      // Start with light theme
      expect(screen.getByTestId('theme-preset')).toHaveTextContent('light');

      // Switch to dark theme
      act(() => {
        screen.getByTestId('switch-to-dark').click();
      });

      expect(screen.getByTestId('theme-preset')).toHaveTextContent('dark');
      expect(screen.getByTestId('base-color')).toHaveTextContent(DARK_THEME.baseColor);

      // Switch to custom theme
      act(() => {
        screen.getByTestId('switch-to-custom').click();
      });

      expect(screen.getByTestId('theme-preset')).toHaveTextContent('custom');
      expect(screen.getByTestId('base-color')).toHaveTextContent('#ff0000');
    });
  });

  describe('Without Provider', () => {
    it('should provide default theme when no provider is present', () => {
      render(<TestComponent />);

      expect(screen.getByTestId('theme-preset')).toHaveTextContent('light');
      expect(screen.getByTestId('base-color')).toHaveTextContent(LIGHT_THEME.baseColor);
    });

    it('should warn when trying to set theme without provider', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<TestComponent />);

      act(() => {
        screen.getByTestId('switch-to-dark').click();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'SkeletonThemeProvider not found. Theme changes will not be applied.'
      );

      consoleSpy.mockRestore();
    });
  });
});

describe('Theme Utilities', () => {
  describe('createSkeletonTheme', () => {
    it('should create valid theme from custom theme object', () => {
      const customTheme = {
        baseColor: '#ff0000',
        highlight: '#00ff00',
        animationDuration: '2s',
        borderRadius: '8px'
      };

      const theme = createSkeletonTheme(customTheme);

      expect(theme.baseColor).toBe('#ff0000');
      expect(theme.highlightColor).toBe('#00ff00');
      expect(theme.animationDuration).toBe('2s');
      expect(theme.borderRadius.medium).toBe('8px');
    });

    it('should fall back to light theme for invalid custom theme', () => {
      const invalidTheme = {
        baseColor: 'invalid-color',
        highlight: '#00ff00'
      };

      const theme = createSkeletonTheme(invalidTheme);

      expect(theme).toEqual(LIGHT_THEME);
    });
  });

  describe('validateSkeletonTheme', () => {
    it('should validate valid theme', () => {
      const validTheme = {
        baseColor: '#ff0000',
        highlight: 'rgba(0, 255, 0, 0.5)',
        animationDuration: '2s',
        borderRadius: '8px'
      };

      const result = validateSkeletonTheme(validTheme);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid colors', () => {
      const invalidTheme = {
        baseColor: 'invalid-color',
        highlight: 'also-invalid'
      };

      const result = validateSkeletonTheme(invalidTheme);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid baseColor: invalid-color');
      expect(result.errors).toContain('Invalid highlight color: also-invalid');
    });

    it('should detect invalid animation duration', () => {
      const invalidTheme = {
        baseColor: '#ff0000',
        highlight: '#00ff00',
        animationDuration: 'invalid-duration'
      };

      const result = validateSkeletonTheme(invalidTheme);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid animationDuration: invalid-duration');
    });

    it('should detect invalid border radius', () => {
      const invalidTheme = {
        baseColor: '#ff0000',
        highlight: '#00ff00',
        borderRadius: 'invalid-radius'
      };

      const result = validateSkeletonTheme(invalidTheme);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid borderRadius: invalid-radius');
    });

    it('should accept various valid color formats', () => {
      const validColors = [
        '#ff0000',
        '#f00',
        'rgb(255, 0, 0)',
        'rgba(255, 0, 0, 0.5)',
        'hsl(0, 100%, 50%)',
        'hsla(0, 100%, 50%, 0.5)',
        'red',
        'transparent'
      ];

      validColors.forEach(color => {
        const theme = {
          baseColor: color,
          highlight: color
        };

        const result = validateSkeletonTheme(theme);
        expect(result.isValid).toBe(true);
      });
    });

    it('should accept various valid duration formats', () => {
      const validDurations = ['1s', '1.5s', '500ms', '2.5s'];

      validDurations.forEach(duration => {
        const theme = {
          baseColor: '#ff0000',
          highlight: '#00ff00',
          animationDuration: duration
        };

        const result = validateSkeletonTheme(theme);
        expect(result.isValid).toBe(true);
      });
    });

    it('should accept various valid border radius formats', () => {
      const validRadii = ['4px', '1rem', '50%', '0.5em', 'none', 'inherit'];

      validRadii.forEach(radius => {
        const theme = {
          baseColor: '#ff0000',
          highlight: '#00ff00',
          borderRadius: radius
        };

        const result = validateSkeletonTheme(theme);
        expect(result.isValid).toBe(true);
      });
    });
  });
});