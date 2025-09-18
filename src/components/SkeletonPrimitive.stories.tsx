import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SkeletonPrimitive } from './SkeletonPrimitive';
import { SkeletonThemeProvider, LIGHT_THEME, DARK_THEME } from './SkeletonThemeProvider';

const meta: Meta<typeof SkeletonPrimitive> = {
  title: 'Components/SkeletonPrimitive',
  component: SkeletonPrimitive,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SkeletonPrimitive component renders individual skeleton shapes (rectangles, circles, and lines) with customizable styling and animations.

## Shapes
- **rect**: Rectangular skeleton for containers, images, and blocks
- **circle**: Circular skeleton for avatars and round elements  
- **line**: Line skeleton for text content with optional multi-line support

## Features
- Multiple animation types (pulse, wave, none)
- Theme support (light, dark, custom)
- Responsive sizing with px, rem, % units
- Customizable border radius
- Multi-line text simulation
        `,
      },
    },
  },
  argTypes: {
    shape: {
      control: { type: 'select' },
      options: ['rect', 'circle', 'line'],
      description: 'Shape type of the skeleton element',
    },
    width: {
      control: { type: 'text' },
      description: 'Width of the skeleton (px, rem, %, or number)',
    },
    height: {
      control: { type: 'text' },
      description: 'Height of the skeleton (px, rem, %, or number)',
    },
    borderRadius: {
      control: { type: 'text' },
      description: 'Border radius for rounded corners',
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of lines for line shape',
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
type Story = StoryObj<typeof SkeletonPrimitive>;

// Basic shapes
export const Rectangle: Story = {
  args: {
    shape: 'rect',
    width: '200px',
    height: '100px',
    animation: 'pulse',
    theme: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic rectangular skeleton shape, commonly used for containers and images.',
      },
    },
  },
};

export const Circle: Story = {
  args: {
    shape: 'circle',
    width: '64px',
    height: '64px',
    animation: 'pulse',
    theme: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Circular skeleton shape, perfect for avatars and profile pictures.',
      },
    },
  },
};

export const Line: Story = {
  args: {
    shape: 'line',
    width: '300px',
    height: '1rem',
    animation: 'pulse',
    theme: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Line skeleton shape for text content.',
      },
    },
  },
};

export const MultiLine: Story = {
  args: {
    shape: 'line',
    width: '100%',
    lines: 3,
    animation: 'pulse',
    theme: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-line skeleton for paragraph text with automatic line spacing.',
      },
    },
  },
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Small (32px)</h3>
        <SkeletonPrimitive shape="circle" width="32px" height="32px" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Medium (48px)</h3>
        <SkeletonPrimitive shape="circle" width="48px" height="48px" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Large (64px)</h3>
        <SkeletonPrimitive shape="circle" width="64px" height="64px" animation="pulse" theme="light" />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Responsive (100%)</h3>
        <div style={{ width: '200px' }}>
          <SkeletonPrimitive shape="rect" width="100%" height="40px" animation="pulse" theme="light" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different size options including responsive sizing.',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SkeletonPrimitive shape="rect" width="100%" height="40px" animation="pulse" theme="light" />
          <SkeletonPrimitive shape="line" width="80%" height="1rem" animation="pulse" theme="light" />
          <SkeletonPrimitive shape="circle" width="48px" height="48px" animation="pulse" theme="light" />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Wave Animation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SkeletonPrimitive shape="rect" width="100%" height="40px" animation="wave" theme="light" />
          <SkeletonPrimitive shape="line" width="80%" height="1rem" animation="wave" theme="light" />
          <SkeletonPrimitive shape="circle" width="48px" height="48px" animation="wave" theme="light" />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>No Animation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SkeletonPrimitive shape="rect" width="100%" height="40px" animation="none" theme="light" />
          <SkeletonPrimitive shape="line" width="80%" height="1rem" animation="none" theme="light" />
          <SkeletonPrimitive shape="circle" width="48px" height="48px" animation="none" theme="light" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different animation types available.',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <SkeletonPrimitive shape="rect" width="100%" height="40px" animation="pulse" />
            <SkeletonPrimitive shape="line" width="80%" height="1rem" animation="pulse" />
            <SkeletonPrimitive shape="circle" width="48px" height="48px" animation="pulse" />
          </div>
        </SkeletonThemeProvider>
      </div>
      <div style={{ backgroundColor: '#1f2937', padding: '1rem', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem', color: 'white' }}>Dark Theme</h3>
        <SkeletonThemeProvider theme={DARK_THEME}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <SkeletonPrimitive shape="rect" width="100%" height="40px" animation="pulse" />
            <SkeletonPrimitive shape="line" width="80%" height="1rem" animation="pulse" />
            <SkeletonPrimitive shape="circle" width="48px" height="48px" animation="pulse" />
          </div>
        </SkeletonThemeProvider>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Custom Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SkeletonPrimitive 
            shape="rect" 
            width="100%" 
            height="40px" 
            animation="pulse" 
            theme={{ baseColor: '#fef3c7', highlight: '#fbbf24' }}
          />
          <SkeletonPrimitive 
            shape="line" 
            width="80%" 
            height="1rem" 
            animation="pulse" 
            theme={{ baseColor: '#fef3c7', highlight: '#fbbf24' }}
          />
          <SkeletonPrimitive 
            shape="circle" 
            width="48px" 
            height="48px" 
            animation="pulse" 
            theme={{ baseColor: '#fef3c7', highlight: '#fbbf24' }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different theme options for skeleton primitives.',
      },
    },
  },
};

// Border radius variations
export const BorderRadiusVariations: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>No Radius</h4>
        <SkeletonPrimitive 
          shape="rect" 
          width="80px" 
          height="80px" 
          borderRadius="0" 
          animation="pulse" 
          theme="light" 
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Small (4px)</h4>
        <SkeletonPrimitive 
          shape="rect" 
          width="80px" 
          height="80px" 
          borderRadius="4px" 
          animation="pulse" 
          theme="light" 
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Medium (8px)</h4>
        <SkeletonPrimitive 
          shape="rect" 
          width="80px" 
          height="80px" 
          borderRadius="8px" 
          animation="pulse" 
          theme="light" 
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Large (16px)</h4>
        <SkeletonPrimitive 
          shape="rect" 
          width="80px" 
          height="80px" 
          borderRadius="16px" 
          animation="pulse" 
          theme="light" 
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different border radius options for rectangular shapes.',
      },
    },
  },
};

// Custom styling
export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Custom CSS Properties</h3>
        <SkeletonPrimitive 
          shape="rect" 
          width="200px" 
          height="60px" 
          animation="pulse" 
          theme="light"
          style={{
            border: '2px solid #4f46e5',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Custom Classes</h3>
        <SkeletonPrimitive 
          shape="line" 
          width="250px" 
          height="1.5rem" 
          animation="wave" 
          theme="light"
          className="custom-skeleton-line"
          style={{ marginLeft: '2rem' }}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Gradient Background</h3>
        <SkeletonPrimitive 
          shape="circle" 
          width="80px" 
          height="80px" 
          animation="none" 
          theme="light"
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            opacity: 0.7,
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of custom styling with CSS properties and classes.',
      },
    },
  },
};