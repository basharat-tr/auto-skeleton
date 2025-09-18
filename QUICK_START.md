# Quick Start Guide

## 📦 Installation

```bash
npm install dynamic-skeleton-loader
```

## 🚀 Basic Usage (30 seconds)

```jsx
import { DynamicSkeleton, createSkeletonSpec } from 'dynamic-skeleton-loader';

// 1. Define your skeleton (build-time, zero overhead)
const CARD_SKELETON = createSkeletonSpec('ProductCard', [
  { key: 'image', shape: 'rect', width: '100%', height: '200px' },
  { key: 'title', shape: 'line', width: '80%', height: '1.5rem' },
  { key: 'button', shape: 'rect', width: '120px', height: '40px' }
]);

// 2. Use in your component
function ProductCard({ product, loading }) {
  if (loading) {
    return <DynamicSkeleton componentName="ProductCard" />;
  }
  
  return (
    <div>
      <img src={product.image} />
      <h3>{product.name}</h3>
      <button>Buy Now</button>
    </div>
  );
}

// 3. That's it! 🎉
```

## 🏢 Enterprise Pattern (HOC)

```jsx
import { withSkeleton, generateComponentSpec } from 'dynamic-skeleton-loader';

// Auto-generate skeleton
const USER_SKELETON = generateComponentSpec('UserProfile', [
  { type: 'image', width: '60px', height: '60px' },
  { type: 'text', width: '60%' },
  { type: 'text', width: '80%' }
]);

// Wrap your component
const UserProfile = withSkeleton(UserProfileBase, {
  componentName: 'UserProfile',
  loadingProp: 'loading'
});

// Use anywhere - skeleton shows automatically
<UserProfile user={user} loading={isLoading} />
```

## 🎯 Key Benefits

- ✅ **Zero runtime overhead** - skeletons generated at build time
- ✅ **12KB gzipped** - tiny bundle size
- ✅ **Enterprise-ready** - built for production scale
- ✅ **Type-safe** - full TypeScript support
- ✅ **Framework agnostic** - works with Next.js, Vite, CRA

## 📚 Next Steps

- [Complete Usage Guide](./HOW_TO_USE.md)
- [Real-World Examples](./PACKAGE_USAGE_EXAMPLES.md)
- [Storybook Demo](https://your-storybook-url.com)

Ready to ship! 🚀