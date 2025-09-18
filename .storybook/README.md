# Dynamic Skeleton Loader - Storybook Documentation

This Storybook setup provides comprehensive documentation and testing capabilities for the Dynamic Skeleton Loader library.

## 📚 Story Categories

### Components
Individual component documentation with interactive examples:
- **DynamicSkeleton**: Main skeleton generation component
- **SkeletonPrimitive**: Individual skeleton shapes (rect, circle, line)
- **SkeletonLine**: Multi-line text skeletons
- **SkeletonThemeProvider**: Theme context provider

### Skeleton Tester
Interactive testing tools for skeleton functionality:
- **Interactive Testing**: Full-featured skeleton tester with controls
- **Custom Theme Tester**: Real-time theme customization
- **Mapping Rules Tester**: Test different mapping rule configurations
- **Spec Generation Demo**: Generate and test skeleton specifications

### Dynamic Skeleton Loader
Library overview and comprehensive examples:
- **Overview**: Complete library showcase with real-world examples
- **Performance Comparison**: DOM scanning vs precomputed specs
- **Theme Showcase**: All available themes and customization options
- **Custom Mapping Demo**: Advanced mapping rule examples

## 🎯 Key Features

### Interactive Controls
- Toggle between skeleton and original components
- Real-time animation and theme changes
- Custom mapping rule testing
- Spec generation and copying

### Testing Capabilities
- **Animation Testing**: Compare pulse, wave, and no animation
- **Theme Testing**: Light, dark, and custom themes
- **Layout Preservation**: Test keepSpace functionality
- **Accessibility Testing**: ARIA attributes and screen reader support
- **Performance Testing**: Compare different implementation approaches

### Documentation Features
- **Code Examples**: Copy-paste ready code snippets
- **API Documentation**: Complete prop and method documentation
- **Usage Patterns**: Real-world implementation examples
- **Best Practices**: Performance and accessibility guidelines

## 🚀 Getting Started

### Running Storybook
```bash
npm run storybook
```

### Building Storybook
```bash
npm run build-storybook
```

## 📖 Usage Examples

### Basic Skeleton Generation
```tsx
import { DynamicSkeleton } from 'dynamic-skeleton-loader';

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
  
  return <div ref={componentRef}>{/* Your content */}</div>;
}
```

### Custom Mapping Rules
```tsx
const customRules = [
  {
    match: { classContains: 'avatar' },
    to: { shape: 'circle', size: { w: '48px', h: '48px' } },
    priority: 100,
  },
  {
    match: { tag: 'button' },
    to: { shape: 'rect', size: { w: '120px', h: '40px' }, radius: '6px' },
    priority: 90,
  },
];

<DynamicSkeleton 
  forRef={componentRef}
  mappingRules={customRules}
  animation="wave"
  theme="dark"
/>
```

### Precomputed Specifications
```tsx
const skeletonSpec = {
  children: [
    { key: 'avatar', shape: 'circle', width: '64px', height: '64px' },
    { key: 'name', shape: 'line', width: '150px', height: '1.5rem' },
    { key: 'content', shape: 'rect', width: '100%', height: '4rem' },
  ],
  layout: 'stack',
  gap: '1rem',
};

<DynamicSkeleton 
  renderSpec={skeletonSpec}
  animation="pulse"
  theme="light"
/>
```

### Custom Themes
```tsx
import { SkeletonThemeProvider, createSkeletonTheme } from 'dynamic-skeleton-loader';

const customTheme = createSkeletonTheme({
  baseColor: '#fef3c7',
  highlightColor: '#fbbf24',
  animationDuration: '2s',
});

<SkeletonThemeProvider theme={customTheme}>
  <DynamicSkeleton forRef={componentRef} />
</SkeletonThemeProvider>
```

## 🧪 Testing Workflows

### 1. Component Development
1. Create your component story
2. Use the Interactive Skeleton Tester to test skeleton generation
3. Adjust mapping rules as needed
4. Generate optimized specs for production

### 2. Theme Development
1. Use the Custom Theme Tester
2. Adjust colors and animation timing
3. Test with different component types
4. Export theme configuration

### 3. Performance Optimization
1. Compare DOM scanning vs precomputed specs
2. Generate specs for frequently used components
3. Test loading performance with different configurations
4. Optimize mapping rules for your use cases

### 4. Accessibility Testing
1. Use browser dev tools to inspect ARIA attributes
2. Test with screen readers
3. Verify keyboard navigation is disabled during loading
4. Check color contrast for custom themes

## 📝 Story Development Guidelines

### Creating New Stories
1. Follow the existing naming convention
2. Include comprehensive documentation
3. Add interactive controls where appropriate
4. Provide real-world usage examples

### Documentation Standards
- Include component description and features
- Provide code examples for common use cases
- Document all props and their effects
- Add troubleshooting tips where relevant

### Testing Considerations
- Test with various component sizes and layouts
- Include edge cases and error scenarios
- Verify accessibility compliance
- Test performance with large component trees

## 🔧 Configuration

### Storybook Addons
- **@storybook/addon-essentials**: Core Storybook functionality
- **@storybook/addon-controls**: Interactive prop controls
- **@storybook/addon-docs**: Auto-generated documentation
- **@storybook/addon-a11y**: Accessibility testing tools

### Custom Configuration
- CSS imports for skeleton styles
- TypeScript configuration for proper type checking
- React docgen for automatic prop documentation
- Accessibility testing configuration

## 🎨 Design System Integration

### Tailwind CSS Support
The library includes Tailwind-compatible classes and can be easily integrated with Tailwind-based design systems.

### Custom Design Systems
Use the theme system to match your brand colors and animation preferences:
- Custom color palettes
- Brand-specific border radius values
- Animation timing that matches your design language
- CSS variable integration for dynamic theming

## 📊 Performance Monitoring

### Metrics to Track
- Skeleton generation time (should be < 50ms)
- Bundle size impact
- Animation performance (60fps target)
- Memory usage during DOM scanning

### Optimization Strategies
- Use precomputed specs for production
- Implement code splitting for optional features
- Optimize mapping rules for common patterns
- Cache generated specs when possible

## 🤝 Contributing

### Adding New Stories
1. Create story files following the existing patterns
2. Include comprehensive documentation
3. Add interactive controls for testing
4. Test across different browsers and devices

### Improving Documentation
1. Keep examples up-to-date with API changes
2. Add new use cases and patterns
3. Include troubleshooting guides
4. Provide migration guides for breaking changes

This Storybook setup serves as both documentation and testing environment, making it easy to understand, test, and contribute to the Dynamic Skeleton Loader library.