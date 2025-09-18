import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Skeleton Tester Addon/Demo',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Skeleton Tester Addon Demo

This story demonstrates the Skeleton Tester addon functionality. Use the "Skeleton Tester" panel in the addons section to:

## Features
- **Toggle Skeleton Mode**: Switch between original component and skeleton version
- **Configure Animation**: Choose between pulse, wave, or no animation
- **Theme Selection**: Use light, dark, or custom themes
- **Custom Mapping Rules**: Define how elements should be converted to skeleton shapes
- **Spec Generation**: Generate skeleton specifications from the current story
- **Real-time Preview**: See changes instantly as you adjust settings

## How to Use
1. Open the "Skeleton Tester" panel in the addons section (bottom panel)
2. Toggle "Enable Skeleton Mode" to see the skeleton version
3. Adjust animation, theme, and other settings
4. Add custom mapping rules to control element conversion
5. Generate skeleton specs for production use

## Mapping Rules
Mapping rules control how DOM elements are converted to skeleton shapes:
- **Match criteria**: Tag name, class contains, role, or attributes
- **Target shape**: Rectangle, circle, or line
- **Size**: Width and height (supports px, %, rem, etc.)
- **Priority**: Higher numbers take precedence

## Tips
- Use higher priority values for more specific rules
- Test different animations to find what works best
- Generate specs for optimal production performance
- Custom themes help match your design system
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Sample components for testing the addon
const SimpleCard: React.FC = () => (
  <div style={{
    padding: '1.5rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    maxWidth: '300px',
  }}>
    <img 
      className="avatar"
      src="https://via.placeholder.com/48x48/4f46e5/ffffff?text=U"
      alt="User"
      style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: '50%', 
        marginBottom: '1rem' 
      }}
    />
    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
      John Doe
    </h3>
    <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>
      Software Engineer at TechCorp
    </p>
    <button 
      className="btn primary"
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Connect
    </button>
  </div>
);

const BlogPostCard: React.FC = () => (
  <article style={{
    padding: '2rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    maxWidth: '500px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
      <img 
        className="avatar small"
        src="https://via.placeholder.com/32x32/22c55e/ffffff?text=A"
        alt="Author"
        style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          marginRight: '0.75rem' 
        }}
      />
      <div>
        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem' }}>Alex Smith</p>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.75rem' }}>March 15, 2024</p>
      </div>
    </div>
    
    <h1 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
      Building Better User Interfaces with React
    </h1>
    
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <span className="tag" style={{
        padding: '0.25rem 0.5rem',
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        borderRadius: '4px',
        fontSize: '0.75rem',
      }}>
        React
      </span>
      <span className="tag" style={{
        padding: '0.25rem 0.5rem',
        backgroundColor: '#dcfce7',
        color: '#166534',
        borderRadius: '4px',
        fontSize: '0.75rem',
      }}>
        UI/UX
      </span>
    </div>
    
    <p style={{ margin: '0 0 1rem 0', lineHeight: '1.6', color: '#374151' }}>
      Learn how to create intuitive and accessible user interfaces using modern React patterns. 
      This comprehensive guide covers component design, state management, and performance optimization.
    </p>
    
    <p style={{ margin: '0 0 1.5rem 0', lineHeight: '1.6', color: '#374151' }}>
      We'll explore best practices for building scalable applications that provide excellent 
      user experiences across different devices and accessibility needs.
    </p>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>8 min read</span>
      <button 
        className="btn secondary"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          color: '#4f46e5',
          border: '1px solid #4f46e5',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Read More
      </button>
    </div>
  </article>
);

const ProductGrid: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '600px' }}>
    {[1, 2, 3, 4].map(i => (
      <div key={i} style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
      }}>
        <div style={{
          width: '100%',
          height: '120px',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
        }}>
          Product {i}
        </div>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
            Product Name {i}
          </h3>
          <p style={{ margin: '0 0 0.75rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
            Short product description here
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>${99 + i * 10}</span>
            <button 
              className="btn small"
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ComplexLayout: React.FC = () => (
  <div style={{ maxWidth: '800px' }}>
    <header style={{ 
      padding: '2rem', 
      backgroundColor: '#f8fafc', 
      borderRadius: '8px',
      marginBottom: '2rem',
      textAlign: 'center'
    }}>
      <img 
        className="avatar large"
        src="https://via.placeholder.com/80x80/8b5cf6/ffffff?text=CL"
        alt="Company Logo"
        style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          marginBottom: '1rem' 
        }}
      />
      <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '800' }}>
        Complex Layout Demo
      </h1>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '1.125rem' }}>
        This layout tests various element types and nesting levels
      </p>
    </header>
    
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <main>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
            Main Content Area
          </h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="metric-card" style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: '#fef3c7',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#92400e' }}>1,234</div>
              <div style={{ fontSize: '0.875rem', color: '#a16207' }}>Total Users</div>
            </div>
            <div className="metric-card" style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: '#dcfce7',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#166534' }}>567</div>
              <div style={{ fontSize: '0.875rem', color: '#15803d' }}>Active Sessions</div>
            </div>
          </div>
          <p style={{ lineHeight: '1.6', color: '#374151' }}>
            This is a complex layout with multiple sections, nested elements, and various content types. 
            The skeleton tester addon should be able to analyze this structure and generate appropriate 
            skeleton representations for each element type.
          </p>
        </section>
        
        <section>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
            Action Buttons
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn primary large" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}>
              Primary Action
            </button>
            <button className="btn secondary" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#4f46e5',
              border: '2px solid #4f46e5',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}>
              Secondary
            </button>
            <button className="btn danger" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}>
              Delete
            </button>
          </div>
        </section>
      </main>
      
      <aside>
        <div style={{
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: 'white',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
            Sidebar Content
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Navigation item 1</li>
            <li style={{ marginBottom: '0.5rem' }}>Navigation item 2</li>
            <li style={{ marginBottom: '0.5rem' }}>Navigation item 3</li>
          </ul>
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
            <div className="widget" style={{
              padding: '1rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '6px',
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
                Widget Title
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                Widget content goes here
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
);

// Stories for testing the addon
export const SimpleCardDemo: Story = {
  render: () => <SimpleCard />,
  parameters: {
    docs: {
      description: {
        story: 'Simple card component for testing basic skeleton generation. Try toggling skeleton mode in the addon panel.',
      },
    },
  },
};

export const BlogPostDemo: Story = {
  render: () => <BlogPostCard />,
  parameters: {
    docs: {
      description: {
        story: 'Blog post card with multiple content types. Test different mapping rules for tags, avatars, and buttons.',
      },
    },
  },
};

export const ProductGridDemo: Story = {
  render: () => <ProductGrid />,
  parameters: {
    docs: {
      description: {
        story: 'Product grid layout for testing repeated elements and grid structures.',
      },
    },
  },
};

export const ComplexLayoutDemo: Story = {
  render: () => <ComplexLayout />,
  parameters: {
    docs: {
      description: {
        story: 'Complex layout with nested sections, metrics, and various element types. Perfect for testing comprehensive skeleton generation.',
      },
    },
  },
};