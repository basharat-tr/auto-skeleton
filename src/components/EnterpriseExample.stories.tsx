import type { Meta, StoryObj } from '@storybook/react';
import EnterpriseExample from './EnterpriseExample';

const meta: Meta<typeof EnterpriseExample> = {
    title: 'Enterprise/Dashboard',
    component: EnterpriseExample,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: `
# Enterprise-Grade Dynamic Skeleton Loader

This example demonstrates production-ready skeleton loading for enterprise applications.

## 🏗️ Build-Time Generation Approach

Instead of runtime DOM scanning, this approach uses **pre-defined skeleton specifications** that are:

- ✅ **Generated at build time** - No performance overhead
- ✅ **Cached and optimized** - Instant skeleton rendering  
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Maintainable** - Centralized skeleton registry
- ✅ **Scalable** - Works for large enterprise applications

## 🎯 Key Features

### **1. Component Registry**
\`\`\`typescript
// Register skeleton specs at build time
const PRODUCT_CARD_SKELETON = createSkeletonSpec('ProductCard', [
  { key: 'image', shape: 'rect', width: '100%', height: '200px' },
  { key: 'title', shape: 'line', width: '80%', height: '1.5rem' },
  { key: 'price', shape: 'line', width: '40%', height: '1.25rem' }
]);
\`\`\`

### **2. HOC Pattern**
\`\`\`typescript
// Automatic skeleton wrapping
const UserProfile = withSkeleton(UserProfileBase, {
  componentName: 'UserProfile',
  loadingProp: 'loading'
});
\`\`\`

### **3. Priority Loading**
\`\`\`typescript
// Control rendering priority
<DynamicSkeleton componentName="ProductCard" priority="high" />
<DynamicSkeleton componentName="ProductCard" priority="normal" />
<DynamicSkeleton componentName="ProductCard" priority="low" lazy />
\`\`\`

## 📊 Performance Benefits

- **Zero Runtime Overhead**: No DOM scanning or analysis
- **Instant Rendering**: Pre-computed skeleton specifications
- **Memory Efficient**: No hidden component rendering
- **Bundle Optimized**: Tree-shakeable skeleton specs
- **Cache Friendly**: Persistent skeleton registry

## 🚀 Production Ready

This approach is designed for:
- Large-scale enterprise applications
- High-performance requirements
- Team collaboration and maintainability
- CI/CD pipeline integration
- A/B testing and experimentation

## 🎨 Usage Examples

The dashboard shows various enterprise patterns:
- Product cards with image, text, and button skeletons
- User profiles with avatar and text combinations  
- Priority-based loading for above-the-fold content
- Lazy loading for below-the-fold content
- HOC pattern for automatic skeleton management
        `
            }
        }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: '🏢 Enterprise Dashboard',
    parameters: {
        docs: {
            description: {
                story: `
The complete enterprise dashboard example showing:

**Build-Time Skeleton Generation:**
- No runtime DOM scanning
- Pre-defined component specifications
- Instant skeleton rendering

**Enterprise Features:**
- Component registry for centralized management
- HOC pattern for automatic skeleton wrapping
- Priority-based loading (high/normal/low)
- Lazy loading for performance optimization
- Performance monitoring and metrics

**Production Benefits:**
- Zero performance overhead
- Memory efficient (no hidden rendering)
- Type-safe skeleton specifications
- Maintainable and scalable architecture

Watch the loading sequence to see different priority levels in action!
        `
            }
        }
    }
};

export const ProductCardOnly: Story = {
    name: '🛍️ Product Card Skeleton',
    render: () => {
        const { DynamicSkeleton } = require('./DynamicSkeletonEnterprise');
        return (
            <div style={{ padding: '20px', maxWidth: '300px' }}>
                <h3>Product Card Skeleton</h3>
                <DynamicSkeleton componentName="ProductCard" priority="high" />
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: `
Individual product card skeleton showing the build-time specification:

- Image placeholder (200px height)
- Title line (80% width)
- Description lines (2 lines)
- Price line (40% width)  
- Button placeholder (120px width)

This skeleton is generated from a pre-defined specification, not runtime DOM scanning.
        `
            }
        }
    }
};

export const UserProfileOnly: Story = {
    name: '👤 User Profile Skeleton',
    render: () => {
        const { DynamicSkeleton } = require('./DynamicSkeletonEnterprise');
        return (
            <div style={{ padding: '20px', maxWidth: '400px' }}>
                <h3>User Profile Skeleton</h3>
                <DynamicSkeleton componentName="UserProfile" priority="high" />
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: `
User profile skeleton with:

- Circular avatar placeholder (60px)
- Name line (60% width)
- Email line (80% width)
- Role badge (80px width)

Generated using the \`generateComponentSpec\` utility for automatic skeleton creation.
        `
            }
        }
    }
};

export const PriorityComparison: Story = {
    name: '⚡ Priority Loading',
    render: () => {
        const { DynamicSkeleton } = require('./DynamicSkeletonEnterprise');
        return (
            <div style={{ padding: '20px' }}>
                <h3>Priority Loading Comparison</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <div>
                        <h4>High Priority (0ms delay)</h4>
                        <DynamicSkeleton componentName="ProductCard" priority="high" />
                    </div>
                    <div>
                        <h4>Normal Priority (50ms delay)</h4>
                        <DynamicSkeleton componentName="ProductCard" priority="normal" />
                    </div>
                    <div>
                        <h4>Low Priority (100ms delay)</h4>
                        <DynamicSkeleton componentName="ProductCard" priority="low" lazy />
                    </div>
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: `
Demonstrates priority-based loading:

- **High Priority**: Renders immediately (0ms delay)
- **Normal Priority**: Renders after 50ms delay  
- **Low Priority + Lazy**: Renders after 100ms delay

This allows you to prioritize above-the-fold content while deferring below-the-fold skeletons for better performance.
        `
            }
        }
    }
};