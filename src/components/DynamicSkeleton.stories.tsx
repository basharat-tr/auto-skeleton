import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { DynamicSkeleton } from './DynamicSkeleton';
import { SkeletonThemeProvider, LIGHT_THEME, DARK_THEME } from './SkeletonThemeProvider';
import { SkeletonSpec, MappingRule, CustomTheme } from '../types';

const meta: Meta<typeof DynamicSkeleton> = {
  title: 'Components/DynamicSkeleton',
  component: DynamicSkeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The DynamicSkeleton component automatically generates skeleton UI from existing components through DOM inspection or precomputed specifications.

## Features
- **Automatic DOM scanning**: Analyzes component structure and generates appropriate skeleton shapes
- **Custom mapping rules**: Define how specific elements should be converted to skeleton primitives
- **Multiple animation types**: Pulse, wave, or no animation
- **Theme support**: Light, dark, and custom themes
- **Accessibility**: Full ARIA support for screen readers
- **Layout preservation**: Maintains original component dimensions to prevent layout shifts
- **Performance optimized**: Supports build-time spec generation for production use

## Usage Patterns
1. **Runtime DOM scanning**: Pass a React ref to scan and generate skeleton automatically
2. **Precomputed specs**: Use renderSpec for optimal performance with pre-generated skeleton specifications
3. **Custom mapping**: Define custom rules to control how elements are converted to skeleton shapes
        `,
      },
    },
  },
  argTypes: {
    animation: {
      control: { type: 'select' },
      options: ['pulse', 'wave', 'none'],
      description: 'Animation type for skeleton elements',
    },
    theme: {
      control: { type: 'object' },
      description: 'Theme configuration (light, dark, or custom theme object)',
    },
    keepSpace: {
      control: { type: 'boolean' },
      description: 'Preserve original component dimensions to prevent layout shifts',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessible label for screen readers',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicSkeleton>;

// Sample components to demonstrate skeleton generation
const UserCard: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <DynamicSkeleton
        forRef={cardRef}
        animation="pulse"
        theme="light"
        keepSpace={true}
        ariaLabel="Loading user profile..."
      />
    );
  }

  return (
    <div 
      ref={cardRef}
      style={{
        padding: '1.5rem',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: 'white',
        maxWidth: '300px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <img 
          className="avatar"
          src="https://via.placeholder.com/48x48/4f46e5/ffffff?text=JD"
          alt="User avatar"
          style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            marginRight: '1rem' 
          }}
        />
        <div>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
            John Doe
          </h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
            Software Engineer
          </p>
        </div>
      </div>
      <p style={{ margin: 0, color: '#374151', lineHeight: '1.5' }}>
        Passionate developer with 5+ years of experience building scalable web applications 
        using React, TypeScript, and modern development practices.
      </p>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button 
          className="btn"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Follow
        </button>
        <button 
          className="btn"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: '#4f46e5',
            border: '1px solid #4f46e5',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Message
        </button>
      </div>
    </div>
  );
};

const BlogPost: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
  const postRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <DynamicSkeleton
        forRef={postRef}
        animation="wave"
        theme="light"
        keepSpace={true}
        ariaLabel="Loading blog post..."
      />
    );
  }

  return (
    <article 
      ref={postRef}
      style={{
        padding: '2rem',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: 'white',
        maxWidth: '600px',
      }}
    >
      <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.875rem', fontWeight: '700' }}>
        Building Better User Interfaces
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: '#6b7280' }}>
        <span className="tag" style={{ 
          padding: '0.25rem 0.5rem', 
          backgroundColor: '#ddd6fe', 
          color: '#5b21b6',
          borderRadius: '4px',
          fontSize: '0.75rem',
          marginRight: '1rem'
        }}>
          React
        </span>
        <span>March 15, 2024</span>
      </div>
      <p style={{ margin: '0 0 1rem 0', lineHeight: '1.6', color: '#374151' }}>
        Creating intuitive and accessible user interfaces requires careful consideration of user needs, 
        design principles, and technical implementation details.
      </p>
      <p style={{ margin: '0 0 1rem 0', lineHeight: '1.6', color: '#374151' }}>
        In this comprehensive guide, we'll explore modern approaches to UI development, including 
        component-driven design, accessibility best practices, and performance optimization techniques.
      </p>
      <p style={{ margin: '0', lineHeight: '1.6', color: '#374151' }}>
        Whether you're a seasoned developer or just starting your journey, these insights will help 
        you build better, more user-friendly applications.
      </p>
    </article>
  );
};

// Interactive story with side-by-side comparison
const ComparisonDemo: React.FC = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowSkeleton(!showSkeleton)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showSkeleton ? 'Show Original' : 'Show Skeleton'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Original Component</h3>
          <UserCard loading={false} />
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Skeleton Version</h3>
          <UserCard loading={showSkeleton} />
        </div>
      </div>
    </div>
  );
};

// Basic skeleton generation story
export const Default: Story = {
  render: () => <UserCard loading={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Basic skeleton generation from a user card component using DOM scanning.',
      },
    },
  },
};

// Side-by-side comparison story
export const Comparison: Story = {
  render: () => <ComparisonDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive comparison between original component and its skeleton version.',
      },
    },
  },
};

// Animation variations
export const AnimationTypes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Pulse Animation</h3>
        <UserCard loading={true} />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Wave Animation</h3>
        <BlogPost loading={true} />
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>No Animation</h3>
        <DynamicSkeleton
          renderSpec={{
            children: [
              { key: 'title', shape: 'line', width: '60%', height: '1.5rem' },
              { key: 'subtitle', shape: 'line', width: '40%', height: '1rem' },
              { key: 'content', shape: 'rect', width: '100%', height: '4rem' },
            ],
          }}
          animation="none"
          theme="light"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different animation types: pulse, wave, and no animation.',
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
          <UserCard loading={true} />
        </SkeletonThemeProvider>
      </div>
      <div style={{ backgroundColor: '#1f2937', padding: '1rem', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem', color: 'white' }}>Dark Theme</h3>
        <SkeletonThemeProvider theme={DARK_THEME}>
          <div style={{ backgroundColor: '#374151', padding: '1rem', borderRadius: '8px' }}>
            <UserCard loading={true} />
          </div>
        </SkeletonThemeProvider>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Custom Theme</h3>
        <DynamicSkeleton
          renderSpec={{
            children: [
              { key: 'avatar', shape: 'circle', width: '48px', height: '48px' },
              { key: 'name', shape: 'line', width: '120px', height: '1.5rem' },
              { key: 'role', shape: 'line', width: '80px', height: '1rem' },
              { key: 'bio', shape: 'rect', width: '100%', height: '3rem' },
            ],
          }}
          animation="pulse"
          theme={{
            baseColor: '#fef3c7',
            highlight: '#fbbf24',
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different theme options: light, dark, and custom color themes.',
      },
    },
  },
};

// Custom mapping rules
export const CustomMappingRules: Story = {
  render: () => {
    const customRules: MappingRule[] = [
      {
        match: { classContains: 'special-button' },
        to: { shape: 'circle', size: { w: '60px', h: '60px' } },
        priority: 100,
      },
      {
        match: { tag: 'h1' },
        to: { shape: 'line', size: { w: '80%', h: '2rem' }, radius: '8px' },
        priority: 90,
      },
    ];

    const CustomComponent: React.FC = () => {
      const ref = useRef<HTMLDivElement>(null);
      
      return (
        <div>
          <div 
            ref={ref}
            style={{ padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          >
            <h1>Custom Styled Heading</h1>
            <p>This paragraph will use default mapping rules.</p>
            <button className="special-button" style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none'
            }}>
              ⭐
            </button>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <h3>With Custom Mapping Rules:</h3>
            <DynamicSkeleton
              forRef={ref}
              mappingRules={customRules}
              animation="pulse"
              theme="light"
            />
          </div>
        </div>
      );
    };

    return <CustomComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom mapping rules to control how specific elements are converted to skeleton shapes.',
      },
    },
  },
};

// RenderSpec override example
export const RenderSpecOverride: Story = {
  args: {
    renderSpec: {
      children: [
        { 
          key: 'header', 
          shape: 'line', 
          width: '70%', 
          height: '2rem',
          style: { marginBottom: '1rem' }
        },
        { 
          key: 'avatar', 
          shape: 'circle', 
          width: '64px', 
          height: '64px',
          style: { marginBottom: '1rem' }
        },
        { 
          key: 'content-1', 
          shape: 'line', 
          width: '100%', 
          height: '1rem',
          style: { marginBottom: '0.5rem' }
        },
        { 
          key: 'content-2', 
          shape: 'line', 
          width: '85%', 
          height: '1rem',
          style: { marginBottom: '0.5rem' }
        },
        { 
          key: 'content-3', 
          shape: 'line', 
          width: '60%', 
          height: '1rem',
          style: { marginBottom: '1rem' }
        },
        { 
          key: 'button', 
          shape: 'rect', 
          width: '120px', 
          height: '2.5rem',
          borderRadius: '6px'
        },
      ],
      layout: 'stack',
      gap: '0.5rem',
    },
    animation: 'pulse',
    theme: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Using a precomputed skeleton specification instead of DOM scanning for optimal performance.',
      },
    },
  },
};

// Layout preservation demo
export const LayoutPreservation: Story = {
  render: () => {
    const [preserveLayout, setPreserveLayout] = useState(true);
    
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={preserveLayout}
              onChange={(e) => setPreserveLayout(e.target.checked)}
            />
            Enable Layout Preservation (keepSpace)
          </label>
        </div>
        <div style={{ border: '2px dashed #e5e7eb', padding: '1rem' }}>
          <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>
            Container with fixed layout - watch for layout shifts:
          </p>
          <DynamicSkeleton
            renderSpec={{
              children: [
                { key: 'title', shape: 'line', width: '200px', height: '1.5rem' },
                { key: 'content', shape: 'rect', width: '300px', height: '100px' },
              ],
            }}
            keepSpace={preserveLayout}
            animation="pulse"
            theme="light"
            style={{ 
              border: '1px solid #d1d5db',
              padding: '1rem',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates layout preservation to prevent layout shifts during loading.',
      },
    },
  },
};

// Accessibility demonstration
export const AccessibilityFeatures: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
        This skeleton includes proper ARIA attributes for screen readers. 
        Use a screen reader or browser dev tools to inspect the accessibility features.
      </p>
      <DynamicSkeleton
        renderSpec={{
          children: [
            { key: 'title', shape: 'line', width: '60%', height: '1.5rem' },
            { key: 'content', shape: 'rect', width: '100%', height: '4rem' },
          ],
        }}
        animation="pulse"
        theme="light"
        ariaLabel="Loading article content, please wait..."
        className="accessible-skeleton"
      />
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Accessibility Features:</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>role="status" for screen reader announcements</li>
          <li>aria-busy="true" to indicate loading state</li>
          <li>aria-live="polite" for non-intrusive updates</li>
          <li>Custom aria-label for descriptive loading message</li>
          <li>Disabled pointer events and tab navigation</li>
          <li>Screen reader only text for additional context</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the accessibility features built into the skeleton component.',
      },
    },
  },
};