import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SkeletonThemeProvider, LIGHT_THEME, DARK_THEME, createSkeletonTheme, useSkeletonTheme } from './SkeletonThemeProvider';
import { DynamicSkeleton } from './DynamicSkeleton';
import { SkeletonPrimitive } from './SkeletonPrimitive';
import { SkeletonLine } from './SkeletonLine';

const meta: Meta<typeof SkeletonThemeProvider> = {
  title: 'Components/SkeletonThemeProvider',
  component: SkeletonThemeProvider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SkeletonThemeProvider component provides theme context for all skeleton components in your application.

## Features
- **Built-in themes**: Light and dark theme presets
- **Custom themes**: Create themes with custom colors and properties
- **Theme validation**: Automatic validation of theme properties
- **Context-based**: Uses React Context for efficient theme distribution
- **CSS Variables**: Generates CSS custom properties for styling
- **Nested providers**: Support for nested theme contexts

## Theme Properties
- \`baseColor\`: Primary skeleton color
- \`highlightColor\`: Animation highlight color  
- \`animationDuration\`: Duration of animations
- \`borderRadius\`: Border radius presets for different sizes

## Usage
Wrap your application or component tree with SkeletonThemeProvider to provide consistent theming across all skeleton components.
        `,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: 'object' },
      description: 'Theme configuration object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkeletonThemeProvider>;

// Sample skeleton content for demonstrations
const SampleSkeletonContent: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <SkeletonPrimitive shape="circle" width="64px" height="64px" animation="pulse" />
    <SkeletonLine lines={2} width="200px" animation="pulse" />
    <SkeletonPrimitive shape="rect" width="100%" height="80px" animation="pulse" />
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <SkeletonPrimitive shape="rect" width="80px" height="32px" borderRadius="4px" animation="pulse" />
      <SkeletonPrimitive shape="rect" width="80px" height="32px" borderRadius="4px" animation="pulse" />
    </div>
  </div>
);

// Theme hook demonstration
const ThemeHookDemo: React.FC = () => {
  const theme = useSkeletonTheme();
  
  return (
    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#f3f4f6', 
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0' }}>Current Theme Values:</h4>
      <pre style={{ 
        margin: 0, 
        fontSize: '0.875rem',
        backgroundColor: 'white',
        padding: '0.5rem',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        {JSON.stringify(theme, null, 2)}
      </pre>
    </div>
  );
};

// Light theme
export const LightTheme: Story = {
  render: () => (
    <SkeletonThemeProvider theme={LIGHT_THEME}>
      <div>
        <ThemeHookDemo />
        <SampleSkeletonContent />
      </div>
    </SkeletonThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Built-in light theme with gray colors suitable for light backgrounds.',
      },
    },
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div style={{ backgroundColor: '#1f2937', padding: '2rem', borderRadius: '8px' }}>
      <SkeletonThemeProvider theme={DARK_THEME}>
        <div>
          <div style={{ color: 'white' }}>
            <ThemeHookDemo />
          </div>
          <SampleSkeletonContent />
        </div>
      </SkeletonThemeProvider>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Built-in dark theme with darker colors suitable for dark backgrounds.',
      },
    },
  },
};

// Custom theme
export const CustomTheme: Story = {
  render: () => {
    const customTheme = createSkeletonTheme({
      baseColor: '#fef3c7',
      highlightColor: '#fbbf24',
      animationDuration: '2s',
      borderRadius: {
        small: '2px',
        medium: '6px',
        large: '12px',
        circle: '50%',
      },
    });

    return (
      <SkeletonThemeProvider theme={customTheme}>
        <div>
          <ThemeHookDemo />
          <SampleSkeletonContent />
        </div>
      </SkeletonThemeProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom theme with yellow/amber colors and custom animation duration.',
      },
    },
  },
};

// Multiple custom themes
export const MultipleCustomThemes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Blue Theme</h3>
        <SkeletonThemeProvider theme={createSkeletonTheme({
          baseColor: '#dbeafe',
          highlightColor: '#3b82f6',
          animationDuration: '1.5s',
        })}>
          <SampleSkeletonContent />
        </SkeletonThemeProvider>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Green Theme</h3>
        <SkeletonThemeProvider theme={createSkeletonTheme({
          baseColor: '#dcfce7',
          highlightColor: '#22c55e',
          animationDuration: '1s',
        })}>
          <SampleSkeletonContent />
        </SkeletonThemeProvider>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Purple Theme</h3>
        <SkeletonThemeProvider theme={createSkeletonTheme({
          baseColor: '#f3e8ff',
          highlightColor: '#a855f7',
          animationDuration: '2.5s',
        })}>
          <SampleSkeletonContent />
        </SkeletonThemeProvider>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple custom themes with different color schemes and animation speeds.',
      },
    },
  },
};

// Nested theme providers
export const NestedThemeProviders: Story = {
  render: () => (
    <SkeletonThemeProvider theme={LIGHT_THEME}>
      <div style={{ padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Outer Theme (Light)</h3>
        <SampleSkeletonContent />
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#1f2937', 
          borderRadius: '8px' 
        }}>
          <SkeletonThemeProvider theme={DARK_THEME}>
            <h3 style={{ marginBottom: '1rem', color: 'white' }}>Inner Theme (Dark)</h3>
            <SampleSkeletonContent />
          </SkeletonThemeProvider>
        </div>
      </div>
    </SkeletonThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Nested theme providers allow different themes in different parts of the component tree.',
      },
    },
  },
};

// Interactive theme switcher
export const InteractiveThemeSwitcher: Story = {
  render: () => {
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'custom'>('light');
    
    const themes = {
      light: LIGHT_THEME,
      dark: DARK_THEME,
      custom: createSkeletonTheme({
        baseColor: '#fecaca',
        highlightColor: '#ef4444',
        animationDuration: '1.2s',
      }),
    };

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Theme Switcher</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {Object.keys(themes).map((themeName) => (
              <button
                key={themeName}
                onClick={() => setCurrentTheme(themeName as keyof typeof themes)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: currentTheme === themeName ? '#4f46e5' : '#e5e7eb',
                  color: currentTheme === themeName ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {themeName}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: currentTheme === 'dark' ? '#1f2937' : 'transparent',
          padding: currentTheme === 'dark' ? '1rem' : '0',
          borderRadius: '8px'
        }}>
          <SkeletonThemeProvider theme={themes[currentTheme]}>
            <div style={{ color: currentTheme === 'dark' ? 'white' : 'inherit' }}>
              <ThemeHookDemo />
            </div>
            <SampleSkeletonContent />
          </SkeletonThemeProvider>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive theme switcher demonstrating dynamic theme changes.',
      },
    },
  },
};

// Animation duration comparison
export const AnimationDurationComparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Fast (0.8s)</h3>
        <SkeletonThemeProvider theme={createSkeletonTheme({
          baseColor: '#f3f4f6',
          highlightColor: '#d1d5db',
          animationDuration: '0.8s',
        })}>
          <SampleSkeletonContent />
        </SkeletonThemeProvider>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Normal (1.5s)</h3>
        <SkeletonThemeProvider theme={createSkeletonTheme({
          baseColor: '#f3f4f6',
          highlightColor: '#d1d5db',
          animationDuration: '1.5s',
        })}>
          <SampleSkeletonContent />
        </SkeletonThemeProvider>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Slow (3s)</h3>
        <SkeletonThemeProvider theme={createSkeletonTheme({
          baseColor: '#f3f4f6',
          highlightColor: '#d1d5db',
          animationDuration: '3s',
        })}>
          <SampleSkeletonContent />
        </SkeletonThemeProvider>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different animation durations for skeleton themes.',
      },
    },
  },
};

// Border radius variations
export const BorderRadiusVariations: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Sharp Corners</h3>
        <SkeletonThemeProvider theme={createSkeletonTheme({
          baseColor: '#f3f4f6',
          highlightColor: '#d1d5db',
          borderRadius: {
            small: '0px',
            medium: '0px',
            large: '0px',
            circle: '50%',
          },
        })}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SkeletonPrimitive shape="rect" width="200px" height="40px" animation="pulse" />
            <SkeletonPrimitive shape="rect" width="150px" height="60px" animation="pulse" />
            <SkeletonPrimitive shape="circle" width="48px" height="48px" animation="pulse" />
          </div>
        </SkeletonThemeProvider>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Rounded Corners</h3>
        <SkeletonThemeProvider theme={createSkeletonTheme({
          baseColor: '#f3f4f6',
          highlightColor: '#d1d5db',
          borderRadius: {
            small: '4px',
            medium: '12px',
            large: '20px',
            circle: '50%',
          },
        })}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SkeletonPrimitive shape="rect" width="200px" height="40px" animation="pulse" />
            <SkeletonPrimitive shape="rect" width="150px" height="60px" animation="pulse" />
            <SkeletonPrimitive shape="circle" width="48px" height="48px" animation="pulse" />
          </div>
        </SkeletonThemeProvider>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different border radius configurations for skeleton themes.',
      },
    },
  },
};