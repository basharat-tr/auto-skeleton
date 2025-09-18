import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useRef } from 'react';
import { DynamicSkeleton } from './DynamicSkeleton';
import { SkeletonThemeProvider, createSkeletonTheme } from './SkeletonThemeProvider';
import { MappingRule, SkeletonSpec, CustomTheme } from '../types';

const meta: Meta = {
  title: 'Skeleton Tester/Interactive Testing',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Interactive Skeleton Testing

This collection of stories provides comprehensive testing capabilities for the Dynamic Skeleton Loader. 
Each story includes interactive controls to test different configurations and see real-time results.

## Features
- **Live Skeleton Toggle**: Switch between original and skeleton versions
- **Animation Controls**: Test different animation types
- **Theme Customization**: Try light, dark, and custom themes
- **Mapping Rule Testing**: Add and test custom mapping rules
- **Spec Generation**: Generate and test skeleton specifications
- **Performance Comparison**: Compare DOM scanning vs precomputed specs

## How to Use
1. Use the Controls panel to adjust settings
2. Toggle between skeleton and original views
3. Test different mapping rules and themes
4. Generate specs for production use
5. Copy generated JSON for your applications

## Testing Scenarios
- Simple components (cards, buttons)
- Complex layouts (grids, nested content)
- Text-heavy content (articles, descriptions)
- Interactive elements (forms, navigation)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Test component with various element types
const TestComponent: React.FC<{
  showSkeleton?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
  theme?: 'light' | 'dark' | CustomTheme;
  keepSpace?: boolean;
  mappingRules?: MappingRule[];
  customSpec?: SkeletonSpec;
}> = ({ 
  showSkeleton = false, 
  animation = 'pulse', 
  theme = 'light', 
  keepSpace = false,
  mappingRules = [],
  customSpec
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const originalComponent = (
    <div 
      ref={componentRef}
      style={{
        padding: '2rem',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: 'white',
        maxWidth: '500px',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <img 
          className="avatar"
          src="https://via.placeholder.com/64x64/4f46e5/ffffff?text=JS"
          alt="User avatar"
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            marginRight: '1rem',
            border: '2px solid #e5e7eb'
          }}
        />
        <div>
          <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
            Jane Smith
          </h2>
          <p style={{ margin: '0 0 0.25rem 0', color: '#6b7280', fontSize: '1rem' }}>
            Senior Product Designer
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="tag" style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              Design
            </span>
            <span className="tag" style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#dcfce7',
              color: '#166534',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              UX Research
            </span>
          </div>
        </div>
      </div>
      
      <p style={{ margin: '0 0 1.5rem 0', color: '#374151', lineHeight: '1.6' }}>
        Passionate about creating user-centered designs that solve real problems. 
        8+ years of experience in product design, UX research, and design systems. 
        Currently leading design for mobile experiences at a fintech startup.
      </p>
      
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          className="btn primary"
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
          className="btn secondary"
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

  if (showSkeleton) {
    return (
      <SkeletonThemeProvider theme={typeof theme === 'string' ? theme : createSkeletonTheme(theme)}>
        <DynamicSkeleton
          forRef={componentRef}
          renderSpec={customSpec}
          mappingRules={mappingRules}
          animation={animation}
          theme={theme}
          keepSpace={keepSpace}
          ariaLabel="Loading user profile..."
        />
        {/* Hidden original for DOM scanning */}
        <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
          {originalComponent}
        </div>
      </SkeletonThemeProvider>
    );
  }

  return originalComponent;
};

// Interactive skeleton tester with full controls
export const InteractiveSkeletonTester: Story = {
  render: (args) => <TestComponent {...args} />,
  args: {
    showSkeleton: false,
    animation: 'pulse',
    theme: 'light',
    keepSpace: false,
    mappingRules: [],
  },
  argTypes: {
    showSkeleton: {
      control: { type: 'boolean' },
      description: 'Toggle between original component and skeleton version',
    },
    animation: {
      control: { type: 'select' },
      options: ['pulse', 'wave', 'none'],
      description: 'Animation type for skeleton elements',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Theme preset (use Custom Theme story for custom colors)',
    },
    keepSpace: {
      control: { type: 'boolean' },
      description: 'Preserve original component dimensions to prevent layout shifts',
    },
    mappingRules: {
      control: { type: 'object' },
      description: 'Custom mapping rules (see documentation for format)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Interactive skeleton tester with full control over all skeleton properties. 

**Usage:**
1. Toggle "showSkeleton" to switch between original and skeleton
2. Adjust animation, theme, and layout preservation settings
3. Add custom mapping rules in the mappingRules control
4. Observe how changes affect the skeleton generation

**Example Mapping Rules:**
\`\`\`json
[
  {
    "match": { "classContains": "avatar" },
    "to": { "shape": "circle", "size": { "w": "64px", "h": "64px" } },
    "priority": 100
  },
  {
    "match": { "tag": "button" },
    "to": { "shape": "rect", "size": { "w": "120px", "h": "40px" }, "radius": "8px" },
    "priority": 90
  }
]
\`\`\`
        `,
      },
    },
  },
};

// Custom theme tester
export const CustomThemeTester: Story = {
  render: () => {
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [customTheme, setCustomTheme] = useState<CustomTheme>({
      baseColor: '#fef3c7',
      highlight: '#fbbf24',
    });

    return (
      <div>
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Custom Theme Controls</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Base Color
              </label>
              <input
                type="color"
                value={customTheme.baseColor}
                onChange={(e) => setCustomTheme(prev => ({ ...prev, baseColor: e.target.value }))}
                style={{ width: '100%', height: '40px', border: 'none', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Highlight Color
              </label>
              <input
                type="color"
                value={customTheme.highlight}
                onChange={(e) => setCustomTheme(prev => ({ ...prev, highlight: e.target.value }))}
                style={{ width: '100%', height: '40px', border: 'none', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button
                onClick={() => setShowSkeleton(!showSkeleton)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: showSkeleton ? '#ef4444' : '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                {showSkeleton ? 'Show Original' : 'Show Skeleton'}
              </button>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <strong>Current Theme:</strong> Base: {customTheme.baseColor}, Highlight: {customTheme.highlight}
          </div>
        </div>
        
        <TestComponent 
          showSkeleton={showSkeleton} 
          theme={customTheme}
          animation="pulse"
          keepSpace={true}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive custom theme tester with color pickers and real-time preview.',
      },
    },
  },
};

// Mapping rules tester
export const MappingRulesTester: Story = {
  render: () => {
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [currentRuleSet, setCurrentRuleSet] = useState<'default' | 'custom' | 'advanced'>('default');

    const ruleSets = {
      default: [] as MappingRule[],
      custom: [
        {
          match: { classContains: 'avatar' },
          to: { shape: 'rect' as const, size: { w: '64px', h: '64px' }, radius: '12px' },
          priority: 100,
        },
        {
          match: { tag: 'button' },
          to: { shape: 'circle' as const, size: { w: '48px', h: '48px' } },
          priority: 90,
        },
      ] as MappingRule[],
      advanced: [
        {
          match: { classContains: 'avatar' },
          to: { shape: 'circle' as const, size: { w: '80px', h: '80px' } },
          priority: 100,
        },
        {
          match: { classContains: 'tag' },
          to: { shape: 'rect' as const, size: { w: '60px', h: '20px' }, radius: '10px' },
          priority: 95,
        },
        {
          match: { tag: 'h2' },
          to: { shape: 'line' as const, size: { w: '80%', h: '2rem' } },
          priority: 85,
        },
        {
          match: { tag: 'p' },
          to: { shape: 'line' as const, lines: 3, size: { w: '100%', h: '1rem' } },
          priority: 80,
        },
        {
          match: { classContains: 'btn' },
          to: { shape: 'rect' as const, size: { w: '140px', h: '50px' }, radius: '25px' },
          priority: 90,
        },
      ] as MappingRule[],
    };

    return (
      <div>
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Mapping Rules Tester</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {Object.keys(ruleSets).map((ruleSetName) => (
              <button
                key={ruleSetName}
                onClick={() => setCurrentRuleSet(ruleSetName as keyof typeof ruleSets)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: currentRuleSet === ruleSetName ? '#4f46e5' : '#e5e7eb',
                  color: currentRuleSet === ruleSetName ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {ruleSetName} Rules
              </button>
            ))}
            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: showSkeleton ? '#ef4444' : '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              {showSkeleton ? 'Show Original' : 'Show Skeleton'}
            </button>
          </div>
          
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <strong>Active Rules ({ruleSets[currentRuleSet].length}):</strong>
            {ruleSets[currentRuleSet].length > 0 ? (
              <pre style={{ 
                marginTop: '0.5rem', 
                padding: '0.5rem', 
                backgroundColor: 'white', 
                borderRadius: '4px',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '150px'
              }}>
                {JSON.stringify(ruleSets[currentRuleSet], null, 2)}
              </pre>
            ) : (
              <span> Using default heuristic rules</span>
            )}
          </div>
        </div>
        
        <TestComponent 
          showSkeleton={showSkeleton} 
          mappingRules={ruleSets[currentRuleSet]}
          animation="pulse"
          theme="light"
          keepSpace={true}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Test different mapping rule configurations and see how they affect skeleton generation.',
      },
    },
  },
};

// Spec generation demo
export const SpecGenerationDemo: Story = {
  render: () => {
    const [generatedSpec, setGeneratedSpec] = useState<SkeletonSpec | null>(null);
    const [useGeneratedSpec, setUseGeneratedSpec] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    const generateSpec = async () => {
      if (!componentRef.current) return;

      try {
        // Import the utilities dynamically to avoid issues
        const { buildElementTree } = await import('../utils/domScanner');
        const { applyMappingRules, validateAndMergeRules } = await import('../utils/mappingEngine');

        const elementTree = buildElementTree(componentRef.current);
        const validatedRules = validateAndMergeRules([]);
        
        const primitives = elementTree.map(element => 
          applyMappingRules(element, validatedRules)
        );

        const spec: SkeletonSpec = {
          children: primitives,
          layout: 'stack',
          gap: '0.5rem',
        };

        setGeneratedSpec(spec);
      } catch (error) {
        console.error('Failed to generate spec:', error);
      }
    };

    return (
      <div>
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Skeleton Spec Generation</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={generateSpec}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Generate Spec from Component
            </button>
            {generatedSpec && (
              <button
                onClick={() => setUseGeneratedSpec(!useGeneratedSpec)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: useGeneratedSpec ? '#ef4444' : '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {useGeneratedSpec ? 'Use DOM Scanning' : 'Use Generated Spec'}
              </button>
            )}
            {generatedSpec && (
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedSpec, null, 2))}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Copy JSON
              </button>
            )}
          </div>
          
          {generatedSpec && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Generated Skeleton Specification:
              </label>
              <textarea
                value={JSON.stringify(generatedSpec, null, 2)}
                readOnly
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  backgroundColor: 'white',
                  resize: 'vertical',
                }}
              />
            </div>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Original Component</h4>
            <TestComponent showSkeleton={false} />
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem' }}>
              Skeleton ({useGeneratedSpec && generatedSpec ? 'Using Generated Spec' : 'DOM Scanning'})
            </h4>
            <TestComponent 
              showSkeleton={true} 
              customSpec={useGeneratedSpec ? generatedSpec || undefined : undefined}
              animation="pulse"
              theme="light"
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Generate skeleton specifications from components and compare DOM scanning vs precomputed specs.',
      },
    },
  },
};