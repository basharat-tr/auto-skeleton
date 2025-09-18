import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SkeletonLine } from './SkeletonLine';
import { SkeletonThemeProvider, LIGHT_THEME, DARK_THEME } from './SkeletonThemeProvider';

const meta: Meta<typeof SkeletonLine> = {
  title: 'Components/SkeletonLine',
  component: SkeletonLine,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SkeletonLine component is specialized for rendering multi-line text skeletons with automatic line spacing and width variations.

## Features
- **Multi-line support**: Configurable number of lines
- **Automatic spacing**: Proper line height and gap calculations
- **Width variations**: Last line can be shorter to simulate natural text
- **Responsive sizing**: Supports percentage and fixed widths
- **Theme integration**: Works with light, dark, and custom themes
- **Animation support**: Pulse, wave, or no animation

## Use Cases
- Paragraph text placeholders
- Article content skeletons
- Comment sections
- Description text areas
        `,
      },
    },
  },
  argTypes: {
    lines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of text lines to render',
    },
    width: {
      control: { type: 'text' },
      description: 'Width of the line container',
    },
    height: {
      control: { type: 'text' },
      description: 'Height of each individual line',
    },
    gap: {
      control: { type: 'text' },
      description: 'Spacing between lines',
    },
    lastLineWidth: {
      control: { type: 'text' },
      description: 'Width of the last line (defaults to 60% for natural appearance)',
    },
    animation: {
      control: { type: 'select' },
      options: ['pulse', 'wave', 'none'],
      description: 'Animation type',
    },
    theme: {
      control: { type: 'object' },
      description: 'Theme configuration',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkeletonLine>;

// Basic single line
export const SingleLine: Story = {
  args: {
    lines: 1,
    width: '300px',
    height: '1rem',
    animation: 'pulse',
    theme: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Single line skeleton for short text content like titles or labels.',
      },
    },
  },
};

// Multiple lines
export const MultipleLines: Story = {
  args: {
    lines: 3,
    width: '400px',
    height: '1rem',
    gap: '0.5rem',
    animation: 'pulse',
    theme: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-line skeleton for paragraph text with automatic spacing.',
      },
    },
  },
};

// Different line counts
export const LineCountVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>2 Lines</h3>
        <SkeletonLine lines={2} width="350px" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>4 Lines</h3>
        <SkeletonLine lines={4} width="350px" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>6 Lines</h3>
        <SkeletonLine lines={6} width="350px" animation="pulse" theme="light" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different line counts for various text content lengths.',
      },
    },
  },
};

// Custom last line width
export const LastLineWidthVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Default (60% last line)</h3>
        <SkeletonLine lines={3} width="400px" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Short last line (30%)</h3>
        <SkeletonLine lines={3} width="400px" lastLineWidth="30%" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Full width last line (100%)</h3>
        <SkeletonLine lines={3} width="400px" lastLineWidth="100%" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Fixed width last line (120px)</h3>
        <SkeletonLine lines={3} width="400px" lastLineWidth="120px" animation="pulse" theme="light" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different last line widths to simulate natural text endings.',
      },
    },
  },
};

// Spacing variations
export const SpacingVariations: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Tight Spacing (0.25rem)</h3>
        <SkeletonLine lines={4} width="200px" gap="0.25rem" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Normal Spacing (0.5rem)</h3>
        <SkeletonLine lines={4} width="200px" gap="0.5rem" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Loose Spacing (1rem)</h3>
        <SkeletonLine lines={4} width="200px" gap="1rem" animation="pulse" theme="light" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different spacing options between lines.',
      },
    },
  },
};

// Height variations
export const HeightVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Small Text (0.875rem)</h3>
        <SkeletonLine lines={3} width="350px" height="0.875rem" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Normal Text (1rem)</h3>
        <SkeletonLine lines={3} width="350px" height="1rem" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Large Text (1.25rem)</h3>
        <SkeletonLine lines={3} width="350px" height="1.25rem" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Heading Size (1.5rem)</h3>
        <SkeletonLine lines={2} width="350px" height="1.5rem" animation="pulse" theme="light" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different line heights for various text sizes.',
      },
    },
  },
};

// Animation comparison
export const AnimationComparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Pulse Animation</h3>
        <SkeletonLine lines={4} width="200px" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Wave Animation</h3>
        <SkeletonLine lines={4} width="200px" animation="wave" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>No Animation</h3>
        <SkeletonLine lines={4} width="200px" animation="none" theme="light" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different animation types for multi-line text.',
      },
    },
  },
};

// Theme variations
export const ThemeVariations: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Light Theme</h3>
        <SkeletonThemeProvider theme={LIGHT_THEME}>
          <SkeletonLine lines={4} width="200px" animation="pulse" />
        </SkeletonThemeProvider>
      </div>
      <div style={{ backgroundColor: '#1f2937', padding: '1rem', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem', color: 'white' }}>Dark Theme</h3>
        <SkeletonThemeProvider theme={DARK_THEME}>
          <SkeletonLine lines={4} width="200px" animation="pulse" />
        </SkeletonThemeProvider>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Custom Theme</h3>
        <SkeletonLine 
          lines={4} 
          width="200px" 
          animation="pulse" 
          theme={{ baseColor: '#dcfce7', highlight: '#22c55e' }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different theme options for multi-line text skeletons.',
      },
    },
  },
};

// Responsive width
export const ResponsiveWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Full Width (100%)</h3>
        <div style={{ border: '1px dashed #e5e7eb', padding: '1rem' }}>
          <SkeletonLine lines={3} width="100%" animation="pulse" theme="light" />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Constrained Container</h3>
        <div style={{ width: '300px', border: '1px dashed #e5e7eb', padding: '1rem' }}>
          <SkeletonLine lines={3} width="100%" animation="pulse" theme="light" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive width behavior in different container sizes.',
      },
    },
  },
};

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Article Paragraph</h3>
        <div style={{ 
          padding: '1.5rem', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <SkeletonLine 
            lines={5} 
            width="100%" 
            height="1.125rem"
            gap="0.5rem"
            lastLineWidth="65%"
            animation="pulse" 
            theme="light" 
          />
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Comment Section</h3>
        <div style={{ 
          padding: '1rem', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <SkeletonLine 
            lines={2} 
            width="100%" 
            height="0.875rem"
            gap="0.375rem"
            lastLineWidth="45%"
            animation="wave" 
            theme="light" 
          />
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Product Description</h3>
        <div style={{ 
          padding: '1.5rem', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          backgroundColor: 'white',
          maxWidth: '500px'
        }}>
          <SkeletonLine 
            lines={3} 
            width="100%" 
            height="1rem"
            gap="0.5rem"
            lastLineWidth="80%"
            animation="pulse" 
            theme="light" 
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples of multi-line text skeletons in different contexts.',
      },
    },
  },
};