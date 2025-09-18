/**
 * Enterprise-Grade Dynamic Skeleton Component
 * Uses build-time generated specifications for optimal performance
 */

import React, { useMemo } from 'react';
import { DynamicSkeletonProps, SkeletonSpec } from '../types';
import { SkeletonPrimitive } from './SkeletonPrimitive';
import { useSkeletonTheme } from './SkeletonThemeProvider';
import { getSkeletonSpec, validateSkeletonSpec } from '../utils/enterpriseSkeletonGenerator';

interface EnterpriseSkeletonProps extends Omit<DynamicSkeletonProps, 'forRef'> {
    // Component name for build-time spec lookup
    componentName?: string;
    // Direct spec override (highest priority)
    renderSpec?: SkeletonSpec;
    // Fallback spec if componentName not found
    fallbackSpec?: SkeletonSpec;
    // Performance options
    lazy?: boolean;
    priority?: 'high' | 'normal' | 'low';
}

export const DynamicSkeleton: React.FC<EnterpriseSkeletonProps> = ({
    componentName,
    renderSpec,
    fallbackSpec,
    mappingRules = [],
    animation = 'pulse',
    theme: propTheme,
    className = '',
    style = {},
    keepSpace = false,
    ariaLabel = 'Loading content...',
    lazy = false,
    priority = 'normal'
}) => {
    const contextTheme = useSkeletonTheme();

    // Determine which spec to use with priority order
    const activeSpec = useMemo((): SkeletonSpec | null => {
        // 1. Direct renderSpec override (highest priority)
        if (renderSpec) {
            if (validateSkeletonSpec(renderSpec)) {
                return renderSpec;
            } else {
                console.warn('Invalid renderSpec provided, falling back to componentName spec');
            }
        }

        // 2. Build-time generated spec by component name
        if (componentName) {
            const buildTimeSpec = getSkeletonSpec(componentName);
            if (buildTimeSpec && validateSkeletonSpec(buildTimeSpec)) {
                return buildTimeSpec;
            } else {
                console.warn(`No valid spec found for component '${componentName}', using fallback`);
            }
        }

        // 3. Fallback spec
        if (fallbackSpec && validateSkeletonSpec(fallbackSpec)) {
            return fallbackSpec;
        }

        // 4. Default fallback
        return {
            children: [
                {
                    key: 'default-line-1',
                    shape: 'line',
                    width: '80%',
                    height: '1.5rem',
                    style: { marginBottom: '8px' }
                },
                {
                    key: 'default-line-2',
                    shape: 'line',
                    width: '60%',
                    height: '1rem',
                    style: { marginBottom: '16px' }
                },
                {
                    key: 'default-button',
                    shape: 'rect',
                    width: '120px',
                    height: '40px',
                    style: { borderRadius: '6px' }
                }
            ],
            layout: 'stack'
        };
    }, [renderSpec, componentName, fallbackSpec]);

    // Performance optimization: lazy loading
    const [shouldRender, setShouldRender] = React.useState(!lazy);

    React.useEffect(() => {
        if (lazy && !shouldRender) {
            const timer = setTimeout(() => {
                setShouldRender(true);
            }, priority === 'high' ? 0 : priority === 'normal' ? 50 : 100);

            return () => clearTimeout(timer);
        }
    }, [lazy, shouldRender, priority]);

    // Render skeleton from specification
    const renderSkeletonFromSpec = (spec: SkeletonSpec) => {
        if (!spec.children || spec.children.length === 0) {
            return (
                <div style={{ padding: '1rem', color: '#9ca3af', fontStyle: 'italic' }}>
                    No skeleton elements to render
                </div>
            );
        }

        const containerStyle: React.CSSProperties = {
            display: spec.layout === 'row' ? 'flex' :
                spec.layout === 'grid' ? 'grid' : 'flex',
            flexDirection: spec.layout === 'row' ? 'row' : 'column',
            gap: spec.gap || '0.5rem',
            ...(spec.layout === 'grid' && {
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
            })
        };

        return (
            <div className={`skeleton-container skeleton-layout-${spec.layout || 'stack'}`} style={containerStyle}>
                {spec.children.map((primitive) => (
                    <SkeletonPrimitive
                        key={primitive.key}
                        shape={primitive.shape}
                        width={primitive.width}
                        height={primitive.height}
                        borderRadius={primitive.borderRadius}
                        lines={primitive.lines}
                        style={primitive.style}
                        className={primitive.className}
                        animation={animation}
                        theme={propTheme}
                    />
                ))}
            </div>
        );
    };

    // Performance: don't render until ready
    if (lazy && !shouldRender) {
        return (
            <div
                role="status"
                aria-busy="true"
                aria-live="polite"
                aria-label={ariaLabel}
                className={`dynamic-skeleton skeleton-loading ${className}`.trim()}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    minHeight: '2rem',
                    ...style
                }}
            >
                <span className="sr-only">{ariaLabel}</span>
            </div>
        );
    }

    // Error state
    if (!activeSpec) {
        return (
            <div
                role="status"
                aria-busy="true"
                aria-live="polite"
                aria-label={ariaLabel}
                className={`dynamic-skeleton skeleton-error ${className}`.trim()}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    padding: '1rem',
                    color: '#ef4444',
                    backgroundColor: '#fef2f2',
                    borderRadius: '4px',
                    border: '1px solid #fecaca',
                    ...style
                }}
            >
                <span className="sr-only">{ariaLabel}</span>
                <div>Failed to load skeleton specification</div>
            </div>
        );
    }

    // Main skeleton render
    return (
        <div
            role="status"
            aria-busy="true"
            aria-live="polite"
            aria-label={ariaLabel}
            className={`dynamic-skeleton skeleton-${priority} ${className}`.trim()}
            style={{
                pointerEvents: 'none',
                userSelect: 'none',
                outline: 'none',
                ...style
            }}
            data-component-name={componentName}
            data-skeleton-priority={priority}
        >
            <span className="sr-only">{ariaLabel}</span>
            {renderSkeletonFromSpec(activeSpec)}
        </div>
    );
};

// Enterprise-specific hooks and utilities
export const useSkeletonSpec = (componentName: string) => {
    return useMemo(() => {
        return getSkeletonSpec(componentName);
    }, [componentName]);
};

// Performance monitoring hook
export const useSkeletonPerformance = (componentName: string) => {
    const [metrics, setMetrics] = React.useState({
        renderTime: 0,
        specSize: 0,
        cacheHit: false
    });

    React.useEffect(() => {
        const startTime = performance.now();
        const spec = getSkeletonSpec(componentName);
        const endTime = performance.now();

        setMetrics({
            renderTime: endTime - startTime,
            specSize: JSON.stringify(spec).length,
            cacheHit: true // Assuming build-time specs are always cached
        });
    }, [componentName]);

    return metrics;
};

// HOC for automatic skeleton wrapping
export const withSkeleton = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    skeletonConfig: {
        componentName: string;
        fallbackSpec?: SkeletonSpec;
        loadingProp?: keyof P;
    }
) => {
    const WithSkeletonComponent = (props: P) => {
        const isLoading = skeletonConfig.loadingProp ?
            props[skeletonConfig.loadingProp] as boolean : false;

        if (isLoading) {
            return (
                <DynamicSkeleton
                    componentName={skeletonConfig.componentName}
                    fallbackSpec={skeletonConfig.fallbackSpec}
                    priority="high"
                />
            );
        }

        return <WrappedComponent {...props} />;
    };

    WithSkeletonComponent.displayName = `withSkeleton(${WrappedComponent.displayName || WrappedComponent.name})`;
    return WithSkeletonComponent;
};