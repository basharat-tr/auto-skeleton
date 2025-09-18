# Dynamic Skeleton Loader - Package Usage Examples

## 📦 Installation

```bash
npm install dynamic-skeleton-loader
# or
yarn add dynamic-skeleton-loader
# or
pnpm add dynamic-skeleton-loader
```

## 🏢 Enterprise Usage (Recommended for Production)

### 1. E-commerce Product Card

```jsx
// ProductCard.jsx
import React from 'react';
import { DynamicSkeleton, createSkeletonSpec } from 'dynamic-skeleton-loader';

// Define skeleton specification at build time
const PRODUCT_CARD_SKELETON = createSkeletonSpec('ProductCard', [
  {
    key: 'product-image',
    shape: 'rect',
    width: '100%',
    height: '250px',
    style: { marginBottom: '16px', borderRadius: '8px' }
  },
  {
    key: 'product-brand',
    shape: 'line',
    width: '40%',
    height: '0.875rem',
    style: { marginBottom: '4px' }
  },
  {
    key: 'product-title',
    shape: 'line',
    width: '90%',
    height: '1.25rem',
    style: { marginBottom: '8px' }
  },
  {
    key: 'product-rating',
    shape: 'line',
    width: '30%',
    height: '1rem',
    style: { marginBottom: '12px' }
  },
  {
    key: 'product-price',
    shape: 'line',
    width: '25%',
    height: '1.5rem',
    style: { marginBottom: '16px' }
  },
  {
    key: 'add-to-cart-btn',
    shape: 'rect',
    width: '100%',
    height: '44px',
    style: { borderRadius: '6px' }
  }
]);

const ProductCard = ({ product, loading = false }) => {
  if (loading || !product) {
    return (
      <div className="product-card-container">
        <DynamicSkeleton 
          componentName="ProductCard" 
          priority="high"
          animation="pulse"
        />
      </div>
    );
  }

  return (
    <div className="product-card-container">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-brand">{product.brand}</div>
      <h3 className="product-title">{product.name}</h3>
      <div className="product-rating">⭐ {product.rating} ({product.reviews})</div>
      <div className="product-price">${product.price}</div>
      <button className="add-to-cart-btn">Add to Cart</button>
    </div>
  );
};

export default ProductCard;
```

### 2. User Dashboard with HOC Pattern

```jsx
// UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  withSkeleton, 
  generateComponentSpec,
  DynamicSkeleton 
} from 'dynamic-skeleton-loader';

// Define skeleton for user stats
const USER_STATS_SKELETON = generateComponentSpec('UserStats', [
  { type: 'text', width: '40%', height: '1.25rem' }, // Title
  { type: 'container', width: '100%', height: '120px' }, // Stats grid
  { type: 'text', width: '60%', height: '1rem' }, // Description
]);

// Base component without skeleton logic
const UserDashboardBase = ({ user, stats }) => (
  <div className="dashboard">
    <div className="user-header">
      <img src={user.avatar} alt={user.name} className="avatar" />
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <span className="role-badge">{user.role}</span>
      </div>
    </div>
    
    <div className="user-stats">
      <h3>Your Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.orders}</div>
          <div className="stat-label">Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${stats.spent}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.points}</div>
          <div className="stat-label">Reward Points</div>
        </div>
      </div>
      <p>Member since {stats.memberSince}</p>
    </div>
  </div>
);

// Wrap with skeleton HOC
const UserDashboard = withSkeleton(UserDashboardBase, {
  componentName: 'UserStats',
  loadingProp: 'loading'
});

// Usage in your app
const App = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    Promise.all([
      fetch('/api/user').then(res => res.json()),
      fetch('/api/user/stats').then(res => res.json())
    ]).then(([userData, statsData]) => {
      setUser(userData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  return (
    <UserDashboard 
      user={user} 
      stats={stats} 
      loading={loading} 
    />
  );
};

export default App;
```

### 3. Blog Post List with Priority Loading

```jsx
// BlogList.jsx
import React, { useState, useEffect } from 'react';
import { DynamicSkeleton, SKELETON_SPECS } from 'dynamic-skeleton-loader';

const BlogPost = ({ post, loading = false, priority = 'normal' }) => {
  if (loading) {
    return (
      <article className="blog-post-card">
        <DynamicSkeleton 
          componentName="BlogPost"
          priority={priority}
          lazy={priority === 'low'}
          animation="wave"
        />
      </article>
    );
  }

  return (
    <article className="blog-post-card">
      <img src={post.featuredImage} alt={post.title} />
      <div className="post-content">
        <div className="post-meta">
          <span className="category">{post.category}</span>
          <span className="date">{post.publishedAt}</span>
        </div>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <div className="author">
          <img src={post.author.avatar} alt={post.author.name} />
          <span>{post.author.name}</span>
        </div>
      </div>
    </article>
  );
};

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="blog-list">
      <h1>Latest Blog Posts</h1>
      <div className="posts-grid">
        {loading ? (
          // Show skeletons with different priorities
          <>
            {/* Above-the-fold posts - high priority */}
            <BlogPost loading priority="high" />
            <BlogPost loading priority="high" />
            <BlogPost loading priority="high" />
            
            {/* Below-the-fold posts - lower priority */}
            <BlogPost loading priority="normal" />
            <BlogPost loading priority="normal" />
            <BlogPost loading priority="low" />
          </>
        ) : (
          posts.map((post, index) => (
            <BlogPost 
              key={post.id} 
              post={post}
              priority={index < 3 ? 'high' : 'normal'}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;
```

### 4. Data Table with Custom Skeleton

```jsx
// DataTable.jsx
import React from 'react';
import { DynamicSkeleton, createSkeletonSpec } from 'dynamic-skeleton-loader';

// Custom table row skeleton
const TABLE_ROW_SKELETON = createSkeletonSpec('TableRow', [
  {
    key: 'col-checkbox',
    shape: 'rect',
    width: '16px',
    height: '16px',
    style: { borderRadius: '2px' }
  },
  {
    key: 'col-name',
    shape: 'line',
    width: '25%',
    height: '1rem'
  },
  {
    key: 'col-email',
    shape: 'line',
    width: '30%',
    height: '1rem'
  },
  {
    key: 'col-role',
    shape: 'rect',
    width: '80px',
    height: '24px',
    style: { borderRadius: '12px' }
  },
  {
    key: 'col-status',
    shape: 'rect',
    width: '60px',
    height: '20px',
    style: { borderRadius: '10px' }
  },
  {
    key: 'col-actions',
    shape: 'rect',
    width: '100px',
    height: '32px',
    style: { borderRadius: '4px' }
  }
], 'row', '16px');

const DataTable = ({ users, loading = false }) => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Show skeleton rows
            Array.from({ length: 5 }, (_, index) => (
              <tr key={`skeleton-${index}`}>
                <td colSpan={6}>
                  <DynamicSkeleton 
                    componentName="TableRow"
                    priority={index < 3 ? 'high' : 'normal'}
                  />
                </td>
              </tr>
            ))
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td><input type="checkbox" /></td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className="role-badge">{user.role}</span></td>
                <td><span className={`status ${user.status}`}>{user.status}</span></td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
```

## 🎨 Theme Integration

### 1. With Styled Components

```jsx
// StyledProductCard.jsx
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { DynamicSkeleton, SkeletonThemeProvider, createSkeletonTheme } from 'dynamic-skeleton-loader';

const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#f8f9fa'
  }
};

// Create matching skeleton theme
const skeletonTheme = createSkeletonTheme({
  baseColor: '#e9ecef',
  highlight: '#f8f9fa',
  animationDuration: '1.2s',
  borderRadius: '8px'
});

const StyledCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProductCard = ({ product, loading }) => {
  return (
    <ThemeProvider theme={theme}>
      <SkeletonThemeProvider theme={skeletonTheme}>
        <StyledCard>
          {loading ? (
            <DynamicSkeleton componentName="ProductCard" />
          ) : (
            <div>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          )}
        </StyledCard>
      </SkeletonThemeProvider>
    </ThemeProvider>
  );
};
```

### 2. With Tailwind CSS

```jsx
// TailwindProductCard.jsx
import React from 'react';
import { DynamicSkeleton, createSkeletonSpec } from 'dynamic-skeleton-loader';

// Tailwind-optimized skeleton
const TAILWIND_PRODUCT_SKELETON = createSkeletonSpec('TailwindProduct', [
  {
    key: 'image',
    shape: 'rect',
    width: '100%',
    height: '12rem', // h-48
    style: { marginBottom: '1rem' }
  },
  {
    key: 'title',
    shape: 'line',
    width: '75%',
    height: '1.5rem', // text-xl
    style: { marginBottom: '0.5rem' }
  },
  {
    key: 'description',
    shape: 'line',
    width: '100%',
    height: '1rem', // text-base
    lines: 2,
    style: { marginBottom: '1rem' }
  },
  {
    key: 'price',
    shape: 'line',
    width: '25%',
    height: '1.25rem', // text-lg
    style: { marginBottom: '1rem' }
  },
  {
    key: 'button',
    shape: 'rect',
    width: '100%',
    height: '2.5rem', // h-10
    style: { borderRadius: '0.375rem' } // rounded-md
  }
]);

const TailwindProductCard = ({ product, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
        <DynamicSkeleton 
          componentName="TailwindProduct"
          className="tailwind-skeleton"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
      <div className="text-lg font-bold text-blue-600 mb-4">${product.price}</div>
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        Add to Cart
      </button>
    </div>
  );
};
```

## 🔧 Advanced Configuration

### 1. Performance Monitoring

```jsx
// PerformanceMonitoredComponent.jsx
import React from 'react';
import { 
  DynamicSkeleton, 
  useSkeletonPerformance,
  skeletonRegistry 
} from 'dynamic-skeleton-loader';

const PerformanceMonitoredComponent = ({ data, loading }) => {
  const metrics = useSkeletonPerformance('ProductCard');
  
  // Log performance metrics in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && metrics.renderTime > 0) {
      console.log('Skeleton Performance:', {
        renderTime: `${metrics.renderTime.toFixed(2)}ms`,
        specSize: `${metrics.specSize} bytes`,
        cacheHit: metrics.cacheHit
      });
    }
  }, [metrics]);

  if (loading) {
    return <DynamicSkeleton componentName="ProductCard" />;
  }

  return <div>{/* Your component content */}</div>;
};
```

### 2. Custom Skeleton Registry

```jsx
// skeletonRegistry.js
import { skeletonRegistry, createSkeletonSpec } from 'dynamic-skeleton-loader';

// Register all your app's skeletons in one place
export const initializeSkeletons = () => {
  // E-commerce skeletons
  skeletonRegistry.register('ProductCard', createSkeletonSpec('ProductCard', [
    // ... skeleton definition
  ]));
  
  skeletonRegistry.register('ProductList', createSkeletonSpec('ProductList', [
    // ... skeleton definition
  ]));
  
  // User interface skeletons
  skeletonRegistry.register('UserProfile', createSkeletonSpec('UserProfile', [
    // ... skeleton definition
  ]));
  
  // Dashboard skeletons
  skeletonRegistry.register('DashboardCard', createSkeletonSpec('DashboardCard', [
    // ... skeleton definition
  ]));
  
  console.log(`Registered ${skeletonRegistry.getAll().size} skeleton specifications`);
};

// Call this in your app's entry point
// main.jsx or App.jsx
initializeSkeletons();
```

### 3. Build-Time Optimization

```jsx
// webpack.config.js or vite.config.js
import { skeletonRegistry } from 'dynamic-skeleton-loader';

// Export skeleton specs for build-time optimization
export default {
  // ... your config
  plugins: [
    // Custom plugin to export skeleton specs
    {
      name: 'skeleton-specs-export',
      generateBundle() {
        const specs = skeletonRegistry.exportSpecs();
        this.emitFile({
          type: 'asset',
          fileName: 'skeleton-specs.json',
          source: specs
        });
      }
    }
  ]
};
```

## 📱 Framework Integration Examples

### Next.js App Router

```jsx
// app/products/page.jsx
import { DynamicSkeleton } from 'dynamic-skeleton-loader';
import { Suspense } from 'react';

async function ProductList() {
  const products = await fetch('/api/products').then(res => res.json());
  
  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div>
      <h1>Our Products</h1>
      <Suspense fallback={
        <div className="products-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <DynamicSkeleton 
              key={i}
              componentName="ProductCard" 
              priority={i < 3 ? 'high' : 'normal'}
            />
          ))}
        </div>
      }>
        <ProductList />
      </Suspense>
    </div>
  );
}
```

### React Query Integration

```jsx
// useProducts.js
import { useQuery } from '@tanstack/react-query';
import { DynamicSkeleton } from 'dynamic-skeleton-loader';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ProductsPage.jsx
const ProductsPage = () => {
  const { data: products, isLoading, error } = useProducts();

  if (error) return <div>Error loading products</div>;

  return (
    <div className="products-grid">
      {isLoading ? (
        Array.from({ length: 8 }, (_, i) => (
          <DynamicSkeleton 
            key={i}
            componentName="ProductCard"
            priority={i < 4 ? 'high' : 'normal'}
          />
        ))
      ) : (
        products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
};
```

This comprehensive guide shows how to use the Dynamic Skeleton Loader package in real-world enterprise applications with optimal performance and maintainability! 🚀