# Dynamic Skeleton Loader - Enterprise Usage Guide

## 🏢 Enterprise Approach (Recommended for Production)

### 1. Run the Demo
```bash
npm run storybook
```
Go to **Enterprise/Dashboard** for the production-ready example.

### 2. Build-Time Skeleton Generation

**Best for:** Enterprise applications, production environments, performance-critical apps

```jsx
import React, { useState } from 'react';
import { DynamicSkeleton, createSkeletonSpec } from 'dynamic-skeleton-loader';

// Define skeleton at build time (no runtime overhead)
const PRODUCT_CARD_SKELETON = createSkeletonSpec('ProductCard', [
  { key: 'image', shape: 'rect', width: '100%', height: '200px' },
  { key: 'title', shape: 'line', width: '80%', height: '1.5rem' },
  { key: 'description', shape: 'line', width: '100%', height: '1rem', lines: 2 },
  { key: 'price', shape: 'line', width: '40%', height: '1.25rem' },
  { key: 'button', shape: 'rect', width: '120px', height: '40px' }
]);

function ProductCard({ product, loading }) {
  if (loading) {
    return <DynamicSkeleton componentName="ProductCard" priority="high" />;
  }

  return (
    <div>
      <img src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div>${product.price}</div>
      <button>Add to Cart</button>
    </div>
  );
}
```

### 3. HOC Pattern (Automatic Skeleton)

```jsx
import { withSkeleton, generateComponentSpec } from 'dynamic-skeleton-loader';

// Define skeleton spec
const USER_PROFILE_SKELETON = generateComponentSpec('UserProfile', [
  { type: 'image', width: '60px', height: '60px' },
  { type: 'text', width: '60%', height: '1.25rem' },
  { type: 'text', width: '80%', height: '1rem' }
]);

// Your component
const UserProfileBase = ({ user }) => (
  <div>
    <img src={user.avatar} />
    <h3>{user.name}</h3>
    <p>{user.email}</p>
  </div>
);

// Wrap with automatic skeleton
const UserProfile = withSkeleton(UserProfileBase, {
  componentName: 'UserProfile',
  loadingProp: 'loading'
});

// Usage - skeleton shows automatically when loading=true
<UserProfile user={user} loading={loading} />
```

## 🎯 Runtime Approach (For Simple Cases)

**Best for:** Prototypes, simple apps, dynamic content

```jsx
import { DynamicSkeletonRuntime } from 'dynamic-skeleton-loader';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  return (
    <div>
      {/* Always render content for ref, but hide when loading */}
      <div ref={contentRef} style={{ display: loading ? 'none' : 'block' }}>
        <h1>My Title</h1>
        <p>Some content here...</p>
        <button>Click me</button>
      </div>
      
      {/* Show skeleton when loading */}
      {loading && <DynamicSkeletonRuntime forRef={contentRef} />}
    </div>
  );
}
```

## 📖 Available Components

### DynamicSkeleton
Main component that scans DOM and generates skeletons
```jsx
<DynamicSkeleton 
  forRef={contentRef}
  animation="pulse"    // pulse, wave, shimmer, none
  theme="light"        // light, dark
  maxNodes={100}       // performance limit
  timeout={50}         // scanning timeout (ms)
/>
```

### SkeletonPrimitive
Individual skeleton element
```jsx
<SkeletonPrimitive 
  shape="rect"         // rect, circle, line
  width="100px"
  height="20px"
  animation="pulse"
/>
```

### SkeletonLine
Text line skeleton
```jsx
<SkeletonLine 
  lines={3}           // number of lines
  width="80%"         // line width
/>
```

### SkeletonThemeProvider
Theme wrapper
```jsx
import { SkeletonThemeProvider, DARK_THEME } from 'dynamic-skeleton-loader';

<SkeletonThemeProvider theme={DARK_THEME}>
  <DynamicSkeleton forRef={contentRef} />
</SkeletonThemeProvider>
```

## 🎨 Themes

### Built-in Themes
```jsx
import { LIGHT_THEME, DARK_THEME } from 'dynamic-skeleton-loader';

// Light theme (default)
<SkeletonThemeProvider theme={LIGHT_THEME}>

// Dark theme
<SkeletonThemeProvider theme={DARK_THEME}>
```

### Custom Theme
```jsx
import { createSkeletonTheme } from 'dynamic-skeleton-loader';

const customTheme = createSkeletonTheme({
  baseColor: '#f0f0f0',
  highlightColor: '#ffffff',
  borderRadius: '8px',
  animationDuration: '2s'
});

<SkeletonThemeProvider theme={customTheme}>
```

## 🔧 Advanced Features

### Data Attributes Override
Control skeleton appearance with HTML attributes:
```jsx
<div>
  <img data-skeleton="circle:50px" src="avatar.jpg" />
  <h1 data-skeleton="line">Title</h1>
  <p data-skeleton="skip">This won't be skeletonized</p>
</div>
```

### Static Spec Generation (Build-time)
```jsx
import { generateStaticSpec } from 'dynamic-skeleton-loader';

// At build time
const spec = await generateStaticSpec(MyComponent);

// At runtime (no DOM scanning)
<DynamicSkeleton renderSpec={spec} />
```

### Custom Mapping Rules
```jsx
const customRules = [
  {
    match: { tag: 'img', classContains: 'avatar' },
    to: { shape: 'circle', size: { w: '40px', h: '40px' } },
    priority: 100
  }
];

<DynamicSkeleton mappingRules={customRules} />
```

## 📱 Common Use Cases

### Product Card
```jsx
function ProductCard({ loading, product }) {
  const cardRef = useRef(null);
  
  return loading ? (
    <DynamicSkeleton forRef={cardRef} />
  ) : (
    <div ref={cardRef}>
      <img src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <button>Add to Cart</button>
    </div>
  );
}
```

### User List
```jsx
function UserList({ loading, users }) {
  const listRef = useRef(null);
  
  return loading ? (
    <DynamicSkeleton forRef={listRef} maxNodes={50} />
  ) : (
    <div ref={listRef}>
      {users.map(user => (
        <div key={user.id}>
          <img src={user.avatar} className="avatar" />
          <h4>{user.name}</h4>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### Form
```jsx
function ContactForm({ loading }) {
  const formRef = useRef(null);
  
  return loading ? (
    <DynamicSkeleton forRef={formRef} />
  ) : (
    <form ref={formRef}>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <textarea placeholder="Message"></textarea>
      <button type="submit">Send</button>
    </form>
  );
}
```

## 🎯 Best Practices

1. **Use refs correctly**: Always attach ref to the content container
2. **Set performance limits**: Use `maxNodes` and `timeout` for large components
3. **Choose appropriate animations**: `pulse` for general use, `wave` for cards
4. **Use themes consistently**: Wrap your app with `SkeletonThemeProvider`
5. **Test different scenarios**: Various content layouts and loading states

## 🐛 Troubleshooting

### Skeleton not showing
- Check if `forRef` is properly attached
- Ensure content is rendered (even if hidden)
- Verify loading state logic

### Performance issues
- Reduce `maxNodes` limit
- Decrease `timeout` value
- Use static specs for complex components

### Styling issues
- Use `SkeletonThemeProvider` for consistent theming
- Check CSS conflicts with skeleton classes
- Verify theme colors match your design

## 📚 Examples in Storybook

Run `npm run storybook` to see:
- **Testing/QuickTest** - Simple testing component
- **Components/DynamicSkeleton** - Main component examples
- **Components/SkeletonPrimitive** - Individual skeleton elements
- **Components/SkeletonThemeProvider** - Theme examples

## 🎉 That's It!

The Dynamic Skeleton Loader is designed to be simple and intuitive. Start with the basic usage and explore advanced features as needed.