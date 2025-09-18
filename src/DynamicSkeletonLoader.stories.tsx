import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { DynamicSkeleton } from './components/DynamicSkeleton';
import { SkeletonPrimitive } from './components/SkeletonPrimitive';
import { SkeletonLine } from './components/SkeletonLine';
import { SkeletonThemeProvider, LIGHT_THEME, DARK_THEME, createSkeletonTheme } from './components/SkeletonThemeProvider';
import { MappingRule, SkeletonSpec } from './types';

const meta: Meta = {
  title: 'Dynamic Skeleton Loader/Overview',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Dynamic Skeleton Loader

A comprehensive React library for automatically generating skeleton UI from existing components.

## 🚀 Key Features

- **Automatic DOM Scanning**: Analyzes component structure and generates appropriate skeleton shapes
- **Custom Mapping Rules**: Define how specific elements should be converted to skeleton primitives  
- **Multiple Animation Types**: Pulse, wave, or no animation
- **Theme System**: Light, dark, and custom themes with CSS variables
- **Accessibility First**: Full ARIA support for screen readers
- **Layout Preservation**: Maintains original component dimensions to prevent layout shifts
- **Performance Optimized**: Supports build-time spec generation for production use
- **TypeScript Support**: Fully typed with comprehensive interfaces

## 📦 Components

- **DynamicSkeleton**: Main component for automatic skeleton generation
- **SkeletonPrimitive**: Individual skeleton shapes (rect, circle, line)
- **SkeletonLine**: Specialized multi-line text skeletons
- **SkeletonThemeProvider**: Theme context provider

## 🎯 Use Cases

- Loading states for user profiles, cards, and content
- Article and blog post placeholders
- E-commerce product listings
- Social media feeds
- Dashboard widgets
- Any component that needs loading states

## 🔧 Installation

\`\`\`bash
npm install dynamic-skeleton-loader
\`\`\`

## 📖 Quick Start

\`\`\`tsx
import { DynamicSkeleton, SkeletonThemeProvider } from 'dynamic-skeleton-loader';

function MyComponent({ loading }) {
  const componentRef = useRef(null);
  
  if (loading) {
    return (
      <DynamicSkeleton 
        forRef={componentRef}
        animation="pulse"
        theme="light"
        keepSpace={true}
      />
    );
  }
  
  return (
    <div ref={componentRef}>
      {/* Your actual component content */}
    </div>
  );
}
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Complex real-world component examples
const UserProfileCard: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
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
        padding: '2rem',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: 'white',
        maxWidth: '400px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <img 
          className="avatar"
          src="https://via.placeholder.com/80x80/4f46e5/ffffff?text=JS"
          alt="User avatar"
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            marginRight: '1.5rem',
            border: '3px solid #e5e7eb'
          }}
        />
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
            Jane Smith
          </h2>
          <p style={{ margin: '0 0 0.25rem 0', color: '#6b7280', fontSize: '1rem' }}>
            Senior Product Designer
          </p>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem' }}>
            San Francisco, CA
          </p>
        </div>
      </div>
      
      <p style={{ margin: '0 0 1.5rem 0', color: '#374151', lineHeight: '1.6' }}>
        Passionate about creating user-centered designs that solve real problems. 
        8+ years of experience in product design, UX research, and design systems. 
        Currently leading design for mobile experiences at a fintech startup.
      </p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600' }}>Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['UX Design', 'Figma', 'Prototyping', 'User Research', 'Design Systems'].map(skill => (
            <span 
              key={skill}
              className="tag"
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          className="btn"
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Connect
        </button>
        <button 
          className="btn"
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: '#4f46e5',
            border: '2px solid #4f46e5',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Message
        </button>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <DynamicSkeleton
        forRef={cardRef}
        animation="wave"
        theme="light"
        keepSpace={true}
        ariaLabel="Loading product information..."
      />
    );
  }

  return (
    <div 
      ref={cardRef}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: 'white',
        overflow: 'hidden',
        maxWidth: '320px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <img 
        src="https://via.placeholder.com/320x200/f3f4f6/9ca3af?text=Product+Image"
        alt="Product"
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
            Wireless Headphones
          </h3>
          <span className="badge" style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#dcfce7',
            color: '#166534',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            NEW
          </span>
        </div>
        
        <p style={{ margin: '0 0 1rem 0', color: '#6b7280', lineHeight: '1.5' }}>
          Premium noise-cancelling wireless headphones with 30-hour battery life 
          and crystal-clear audio quality.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>$299</span>
            <span style={{ fontSize: '1rem', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '0.5rem' }}>$399</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#fbbf24', marginRight: '0.25rem' }}>★★★★★</span>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>(128)</span>
          </div>
        </div>
        
        <button 
          className="btn"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#111827',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const ArticlePreview: React.FC<{ loading?: boolean }> = ({ loading = false }) => {
  const articleRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <DynamicSkeleton
        forRef={articleRef}
        animation="pulse"
        theme="light"
        keepSpace={true}
        ariaLabel="Loading article preview..."
      />
    );
  }

  return (
    <article 
      ref={articleRef}
      style={{
        padding: '2rem',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: 'white',
        maxWidth: '600px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <img 
          className="avatar"
          src="https://via.placeholder.com/40x40/6366f1/ffffff?text=AB"
          alt="Author"
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            marginRight: '0.75rem' 
          }}
        />
        <div>
          <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem' }}>Alex Brown</p>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.75rem' }}>March 18, 2024</p>
        </div>
      </div>
      
      <h1 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: '800', lineHeight: '1.2' }}>
        The Future of Web Development: Trends to Watch in 2024
      </h1>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['React', 'TypeScript', 'Web Development'].map(tag => (
          <span 
            key={tag}
            className="tag"
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#e0e7ff',
              color: '#3730a3',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      
      <p style={{ margin: '0 0 1rem 0', lineHeight: '1.7', color: '#374151', fontSize: '1.125rem' }}>
        As we move through 2024, the web development landscape continues to evolve at a rapid pace. 
        New frameworks, tools, and methodologies are reshaping how we build and deploy applications.
      </p>
      
      <p style={{ margin: '0 0 1.5rem 0', lineHeight: '1.7', color: '#374151' }}>
        From the rise of edge computing to the mainstream adoption of AI-powered development tools, 
        developers need to stay informed about the trends that will define the next generation of web applications.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>5 min read</span>
        <button 
          className="btn"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          Read More
        </button>
      </div>
    </article>
  );
};

// Comprehensive showcase
export const LibraryShowcase: Story = {
  render: () => {
    const [loadingStates, setLoadingStates] = useState({
      profile: true,
      product: true,
      article: true,
    });

    const toggleLoading = (component: keyof typeof loadingStates) => {
      setLoadingStates(prev => ({
        ...prev,
        [component]: !prev[component]
      }));
    };

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Interactive Demo</h2>
          <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
            Toggle between skeleton and loaded states to see the Dynamic Skeleton Loader in action.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {Object.entries(loadingStates).map(([key, isLoading]) => (
              <button
                key={key}
                onClick={() => toggleLoading(key as keyof typeof loadingStates)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: isLoading ? '#ef4444' : '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {key}: {isLoading ? 'Loading' : 'Loaded'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>User Profile Card</h3>
            <UserProfileCard loading={loadingStates.profile} />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Product Card</h3>
            <ProductCard loading={loadingStates.product} />
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '1rem' }}>Article Preview</h3>
            <ArticlePreview loading={loadingStates.article} />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive showcase of the Dynamic Skeleton Loader with real-world components.',
      },
    },
  },
};

// Performance comparison
export const PerformanceComparison: Story = {
  render: () => {
    const precomputedSpec: SkeletonSpec = {
      children: [
        { key: 'avatar', shape: 'circle', width: '80px', height: '80px' },
        { key: 'name', shape: 'line', width: '150px', height: '1.5rem' },
        { key: 'title', shape: 'line', width: '120px', height: '1rem' },
        { key: 'bio', shape: 'rect', width: '100%', height: '4rem' },
        { key: 'skills', shape: 'rect', width: '100%', height: '2rem' },
        { key: 'buttons', shape: 'rect', width: '100%', height: '3rem' },
      ],
      layout: 'stack',
      gap: '1rem',
    };

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Performance Comparison</h2>
          <p style={{ color: '#6b7280' }}>
            Compare DOM scanning vs precomputed specifications for optimal performance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>DOM Scanning (Runtime)</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Automatically analyzes component structure at runtime. Great for development and dynamic content.
            </p>
            <UserProfileCard loading={true} />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Precomputed Spec (Optimized)</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Uses precomputed skeleton specification. Optimal for production with consistent layouts.
            </p>
            <DynamicSkeleton
              renderSpec={precomputedSpec}
              animation="pulse"
              theme="light"
              style={{
                padding: '2rem',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: 'white',
                maxWidth: '400px',
              }}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance comparison between DOM scanning and precomputed specifications.',
      },
    },
  },
};

// Theme showcase
export const ThemeShowcase: Story = {
  render: () => (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Theme System</h2>
        <p style={{ color: '#6b7280' }}>
          Comprehensive theming system with built-in presets and custom theme support.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Light Theme</h3>
          <SkeletonThemeProvider theme={LIGHT_THEME}>
            <ProductCard loading={true} />
          </SkeletonThemeProvider>
        </div>
        
        <div style={{ backgroundColor: '#1f2937', padding: '1rem', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1rem', color: 'white' }}>Dark Theme</h3>
          <SkeletonThemeProvider theme={DARK_THEME}>
            <ProductCard loading={true} />
          </SkeletonThemeProvider>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Custom Brand Theme</h3>
          <SkeletonThemeProvider theme={createSkeletonTheme({
            baseColor: '#fef3c7',
            highlightColor: '#f59e0b',
            animationDuration: '2s',
          })}>
            <ProductCard loading={true} />
          </SkeletonThemeProvider>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of the theme system with light, dark, and custom themes.',
      },
    },
  },
};

// Custom mapping rules demo
export const CustomMappingDemo: Story = {
  render: () => {
    const customRules: MappingRule[] = [
      {
        match: { classContains: 'special-avatar' },
        to: { shape: 'rect', size: { w: '80px', h: '80px' }, radius: '12px' },
        priority: 100,
      },
      {
        match: { classContains: 'highlight-text' },
        to: { shape: 'line', size: { w: '100%', h: '1.5rem' }, radius: '8px' },
        priority: 90,
      },
      {
        match: { tag: 'button' },
        to: { shape: 'circle', size: { w: '48px', h: '48px' } },
        priority: 80,
      },
    ];

    const CustomComponent: React.FC = () => {
      const ref = useRef<HTMLDivElement>(null);
      
      return (
        <div>
          <div 
            ref={ref}
            style={{ 
              padding: '2rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '12px',
              backgroundColor: 'white',
              maxWidth: '400px'
            }}
          >
            <img 
              className="special-avatar"
              src="https://via.placeholder.com/80x80/4f46e5/ffffff?text=CS"
              alt="Custom avatar"
              style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '12px',
                marginBottom: '1rem'
              }}
            />
            <h2 className="highlight-text" style={{ 
              margin: '0 0 0.5rem 0', 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: '#4f46e5'
            }}>
              Custom Styled Component
            </h2>
            <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
              This component uses custom mapping rules to override default skeleton generation.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}>
                ❤️
              </button>
              <button style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}>
                👍
              </button>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>With Custom Mapping Rules</h3>
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
        story: 'Demonstration of custom mapping rules to control skeleton generation behavior.',
      },
    },
  },
};