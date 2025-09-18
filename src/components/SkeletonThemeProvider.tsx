import React, { createContext, useContext, useMemo } from 'react';
import { SkeletonTheme, ThemePreset, CustomTheme } from '../types';

// Theme presets
const LIGHT_THEME: SkeletonTheme = {
  baseColor: '#e2e8f0',
  highlightColor: '#f1f5f9',
  animationDuration: '1.5s',
  borderRadius: {
    small: '2px',
    medium: '4px',
    large: '8px',
    circle: '50%',
  },
};

const DARK_THEME: SkeletonTheme = {
  baseColor: '#374151',
  highlightColor: '#4b5563',
  animationDuration: '1.5s',
  borderRadius: {
    small: '2px',
    medium: '4px',
    large: '8px',
    circle: '50%',
  },
};

// Theme context
interface SkeletonThemeContextValue {
  theme: SkeletonTheme;
  themePreset: ThemePreset | 'custom';
  setTheme: (theme: ThemePreset | CustomTheme) => void;
}

const SkeletonThemeContext = createContext<SkeletonThemeContextValue | undefined>(undefined);

// Color validation utilities
const isValidColor = (color: string): boolean => {
  // Check for hex colors
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return true;
  }
  
  // Check for rgb/rgba colors
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
    return true;
  }
  
  // Check for hsl/hsla colors
  if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
    return true;
  }
  
  // Check for CSS color keywords (basic set)
  const cssColors = [
    'transparent', 'black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
    'gray', 'grey', 'darkgray', 'darkgrey', 'lightgray', 'lightgrey', 'orange', 'purple',
    'brown', 'pink', 'lime', 'navy', 'teal', 'silver', 'maroon', 'olive', 'aqua', 'fuchsia'
  ];
  
  return cssColors.includes(color.toLowerCase());
};

const validateCustomTheme = (customTheme: CustomTheme): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!isValidColor(customTheme.baseColor)) {
    errors.push(`Invalid baseColor: ${customTheme.baseColor}`);
  }
  
  if (!isValidColor(customTheme.highlight)) {
    errors.push(`Invalid highlight color: ${customTheme.highlight}`);
  }
  
  if (customTheme.animationDuration && !/^\d+(\.\d+)?(s|ms)$/.test(customTheme.animationDuration)) {
    errors.push(`Invalid animationDuration: ${customTheme.animationDuration}`);
  }
  
  if (customTheme.borderRadius && !/^\d+(\.\d+)?(px|rem|em|%)|none|inherit|initial$/.test(customTheme.borderRadius)) {
    errors.push(`Invalid borderRadius: ${customTheme.borderRadius}`);
  }
  
  return { isValid: errors.length === 0, errors };
};

const createThemeFromCustom = (customTheme: CustomTheme): SkeletonTheme => {
  const validation = validateCustomTheme(customTheme);
  
  if (!validation.isValid) {
    console.warn('Invalid custom theme provided:', validation.errors);
    // Fall back to light theme
    return LIGHT_THEME;
  }
  
  return {
    baseColor: customTheme.baseColor,
    highlightColor: customTheme.highlight,
    animationDuration: customTheme.animationDuration || '1.5s',
    borderRadius: {
      small: '2px',
      medium: customTheme.borderRadius || '4px',
      large: '8px',
      circle: '50%',
    },
  };
};

// Theme provider props
interface SkeletonThemeProviderProps {
  children: React.ReactNode;
  theme?: ThemePreset | CustomTheme;
}

export const SkeletonThemeProvider: React.FC<SkeletonThemeProviderProps> = ({
  children,
  theme: initialTheme = 'light',
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<ThemePreset | CustomTheme>(initialTheme);
  
  const contextValue = useMemo(() => {
    let resolvedTheme: SkeletonTheme;
    let themePreset: ThemePreset | 'custom';
    
    if (typeof currentTheme === 'string') {
      themePreset = currentTheme;
      resolvedTheme = currentTheme === 'dark' ? DARK_THEME : LIGHT_THEME;
    } else {
      themePreset = 'custom';
      resolvedTheme = createThemeFromCustom(currentTheme);
    }
    
    return {
      theme: resolvedTheme,
      themePreset,
      setTheme: setCurrentTheme,
    };
  }, [currentTheme]);
  
  // Apply theme CSS variables to the provider element
  const themeStyles = useMemo(() => ({
    '--skeleton-base-color': contextValue.theme.baseColor,
    '--skeleton-highlight-color': contextValue.theme.highlightColor,
    '--skeleton-animation-duration': contextValue.theme.animationDuration,
    '--skeleton-border-radius': contextValue.theme.borderRadius.medium,
    '--skeleton-border-radius-small': contextValue.theme.borderRadius.small,
    '--skeleton-border-radius-large': contextValue.theme.borderRadius.large,
    '--skeleton-border-radius-circle': contextValue.theme.borderRadius.circle,
  } as React.CSSProperties), [contextValue.theme]);
  
  return (
    <SkeletonThemeContext.Provider value={contextValue}>
      <div 
        className={`skeleton-theme-provider theme-${contextValue.themePreset}`}
        style={themeStyles}
        data-skeleton-theme={contextValue.themePreset}
      >
        {children}
      </div>
    </SkeletonThemeContext.Provider>
  );
};

// Hook to use skeleton theme
export const useSkeletonTheme = (): SkeletonThemeContextValue => {
  const context = useContext(SkeletonThemeContext);
  
  if (!context) {
    // Return default theme if no provider is found
    return {
      theme: LIGHT_THEME,
      themePreset: 'light',
      setTheme: () => {
        console.warn('SkeletonThemeProvider not found. Theme changes will not be applied.');
      },
    };
  }
  
  return context;
};

// Export theme presets for external use
export { LIGHT_THEME, DARK_THEME };

// Utility function to validate and create themes
export const createSkeletonTheme = (customTheme: CustomTheme): SkeletonTheme => {
  return createThemeFromCustom(customTheme);
};

// Utility function to validate custom theme
export const validateSkeletonTheme = (customTheme: CustomTheme): { isValid: boolean; errors: string[] } => {
  return validateCustomTheme(customTheme);
};