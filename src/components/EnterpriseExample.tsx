/**
 * Enterprise Example: Production-Ready Components with Build-Time Skeletons
 */

import React, { useState, useEffect } from 'react';
import { DynamicSkeleton, withSkeleton } from './DynamicSkeletonEnterprise';
import { createSkeletonSpec, generateComponentSpec } from '../utils/enterpriseSkeletonGenerator';

// Example 1: Product Card with Build-Time Skeleton
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface ProductCardProps {
    product?: Product;
    loading?: boolean;
}

// Define skeleton spec at build time
const PRODUCT_CARD_SKELETON = createSkeletonSpec('ProductCard', [
    {
        key: 'product-image',
        shape: 'rect',
        width: '100%',
        height: '200px',
        style: { marginBottom: '16px', borderRadius: '8px' }
    },
    {
        key: 'product-title',
        shape: 'line',
        width: '80%',
        height: '1.5rem',
        style: { marginBottom: '8px' }
    },
    {
        key: 'product-description',
        shape: 'line',
        width: '100%',
        height: '1rem',
        lines: 2,
        style: { marginBottom: '12px' }
    },
    {
        key: 'product-price',
        shape: 'line',
        width: '40%',
        height: '1.25rem',
        style: { marginBottom: '16px' }
    },
    {
        key: 'add-to-cart',
        shape: 'rect',
        width: '120px',
        height: '40px',
        style: { borderRadius: '6px' }
    }
]);

const ProductCard: React.FC<ProductCardProps> = ({ product, loading = false }) => {
    if (loading || !product) {
        return <DynamicSkeleton componentName="ProductCard" priority="high" />;
    }

    return (
        <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '300px'
        }}>
            <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
            />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>{product.name}</h3>
            <p style={{ margin: '0 0 12px 0', color: '#6b7280' }}>{product.description}</p>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '16px' }}>
                ${product.price}
            </div>
            <button style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
            }}>
                Add to Cart
            </button>
        </div>
    );
};

// Example 2: User Profile with HOC
interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
}

interface UserProfileProps {
    user?: User;
    loading?: boolean;
}

const UserProfileBase: React.FC<UserProfileProps> = ({ user }) => {
    if (!user) return null;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
        }}>
            <img
                src={user.avatar}
                alt={user.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%' }}
            />
            <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{user.name}</h3>
                <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>{user.email}</p>
                <span style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.875rem'
                }}>
                    {user.role}
                </span>
            </div>
        </div>
    );
};

// Create skeleton spec for UserProfile
const USER_PROFILE_SKELETON = generateComponentSpec('UserProfile', [
    { type: 'image', width: '60px', height: '60px' },
    { type: 'text', width: '60%', height: '1.25rem' },
    { type: 'text', width: '80%', height: '1rem' },
    { type: 'button', width: '80px', height: '24px' }
]);

// Wrap with skeleton HOC
const UserProfile = withSkeleton(UserProfileBase, {
    componentName: 'UserProfile',
    loadingProp: 'loading'
});

// Example 3: Dashboard with Multiple Skeletons
const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Simulate API calls
        const timer = setTimeout(() => {
            setProducts([
                {
                    id: '1',
                    name: 'Premium Headphones',
                    description: 'High-quality wireless headphones with noise cancellation',
                    price: 299.99,
                    image: 'https://via.placeholder.com/300x200/2563eb/ffffff?text=Headphones'
                },
                {
                    id: '2',
                    name: 'Smart Watch',
                    description: 'Advanced fitness tracking and smart notifications',
                    price: 399.99,
                    image: 'https://via.placeholder.com/300x200/059669/ffffff?text=Watch'
                }
            ]);

            setUser({
                id: '1',
                name: 'John Doe',
                email: 'john.doe@company.com',
                avatar: 'https://via.placeholder.com/60x60/7c3aed/ffffff?text=JD',
                role: 'Admin'
            });

            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Enterprise Dashboard</h1>

            {/* User Profile Section */}
            <div style={{ marginBottom: '32px' }}>
                <h2>User Profile</h2>
                <UserProfile user={user} loading={loading} />
            </div>

            {/* Products Section */}
            <div>
                <h2>Featured Products</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {loading ? (
                        // Show skeleton cards while loading
                        <>
                            <DynamicSkeleton componentName="ProductCard" priority="high" />
                            <DynamicSkeleton componentName="ProductCard" priority="normal" />
                            <DynamicSkeleton componentName="ProductCard" priority="low" lazy />
                        </>
                    ) : (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>

            {/* Performance Info */}
            <div style={{
                marginTop: '40px',
                padding: '16px',
                background: '#f0f9ff',
                borderRadius: '8px',
                fontSize: '14px'
            }}>
                <h3>🚀 Enterprise Features Demonstrated:</h3>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li><strong>Build-Time Specs</strong>: No runtime DOM scanning</li>
                    <li><strong>Component Registry</strong>: Centralized skeleton management</li>
                    <li><strong>HOC Pattern</strong>: Automatic skeleton wrapping</li>
                    <li><strong>Priority Loading</strong>: High/normal/low priority rendering</li>
                    <li><strong>Lazy Loading</strong>: Deferred skeleton rendering</li>
                    <li><strong>Performance Monitoring</strong>: Built-in metrics tracking</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;