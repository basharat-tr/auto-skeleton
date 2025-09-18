import React, { useEffect, useState } from 'react';
import { DynamicSkeletonProps } from '../types';
import { SkeletonPrimitive } from './SkeletonPrimitive';
import { useSkeletonTheme } from './SkeletonThemeProvider';

export const DynamicSkeleton: React.FC<DynamicSkeletonProps> = ({
    forRef,
    renderSpec,
    mappingRules = [],
    animation = 'pulse',
    theme: propTheme,
    className = '',
    style = {},
    keepSpace = false,
    ariaLabel = 'Loading content...',
}) => {
    const contextTheme = useSkeletonTheme();
    const [skeletonElements, setSkeletonElements] = useState<JSX.Element[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Simple timeout to simulate scanning
        const timer = setTimeout(() => {
            if (forRef?.current) {
                // Generate simple skeleton based on common patterns
                const elements = generateSimpleSkeleton();
                setSkeletonElements(elements);
            }
            setIsReady(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [forRef]);

    const generateSimpleSkeleton = (): JSX.Element[] => {
        // Generate a simple skeleton pattern that works for most content
        return [
            // Header/Title
            <SkeletonPrimitive
                key="title"
                shape="line"
                width="60%"
                height="2rem"
                animation={animation}
                theme={propTheme}
                style={{ marginBottom: '1rem' }}
            />,

            // Subtitle/Description
            <SkeletonPrimitive
                key="subtitle"
                shape="line"
                width="90%"
                height="1rem"
                animation={animation}
                theme={propTheme}
                style={{ marginBottom: '0.5rem' }}
            />,

            <SkeletonPrimitive
                key="description"
                shape="line"
                width="75%"
                height="1rem"
                animation={animation}
                theme={propTheme}
                style={{ marginBottom: '1.5rem' }}
            />,

            // Profile/Avatar section
            <div key="profile-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <SkeletonPrimitive
                    key="avatar"
                    shape="circle"
                    width="60px"
                    height="60px"
                    animation={animation}
                    theme={propTheme}
                />
                <div style={{ flex: 1 }}>
                    <SkeletonPrimitive
                        key="profile-name"
                        shape="line"
                        width="40%"
                        height="1.2rem"
                        animation={animation}
                        theme={propTheme}
                        style={{ marginBottom: '0.5rem' }}
                    />
                    <SkeletonPrimitive
                        key="profile-email"
                        shape="line"
                        width="60%"
                        height="0.9rem"
                        animation={animation}
                        theme={propTheme}
                    />
                </div>
            </div>,

            // Stats grid
            <div key="stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={`stat-${i}`} style={{
                        padding: '1rem',
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <SkeletonPrimitive
                            key={`stat-icon-${i}`}
                            shape="rect"
                            width="24px"
                            height="24px"
                            animation={animation}
                            theme={propTheme}
                            style={{ margin: '0 auto 0.5rem' }}
                        />
                        <SkeletonPrimitive
                            key={`stat-value-${i}`}
                            shape="line"
                            width="50%"
                            height="1.5rem"
                            animation={animation}
                            theme={propTheme}
                            style={{ margin: '0 auto 0.5rem' }}
                        />
                        <SkeletonPrimitive
                            key={`stat-label-${i}`}
                            shape="line"
                            width="70%"
                            height="0.9rem"
                            animation={animation}
                            theme={propTheme}
                            style={{ margin: '0 auto' }}
                        />
                    </div>
                ))}
            </div>,

            // Action buttons
            <div key="buttons" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <SkeletonPrimitive
                    key="btn-1"
                    shape="rect"
                    width="120px"
                    height="40px"
                    animation={animation}
                    theme={propTheme}
                    style={{ borderRadius: '8px' }}
                />
                <SkeletonPrimitive
                    key="btn-2"
                    shape="rect"
                    width="100px"
                    height="40px"
                    animation={animation}
                    theme={propTheme}
                    style={{ borderRadius: '8px' }}
                />
                <SkeletonPrimitive
                    key="btn-3"
                    shape="rect"
                    width="90px"
                    height="40px"
                    animation={animation}
                    theme={propTheme}
                    style={{ borderRadius: '8px' }}
                />
            </div>,

            // Activity list
            <div key="activity-section">
                <SkeletonPrimitive
                    key="activity-title"
                    shape="line"
                    width="30%"
                    height="1.2rem"
                    animation={animation}
                    theme={propTheme}
                    style={{ marginBottom: '1rem' }}
                />
                {[1, 2, 3, 4].map(i => (
                    <SkeletonPrimitive
                        key={`activity-${i}`}
                        shape="line"
                        width={`${85 + (i * 3)}%`}
                        height="1rem"
                        animation={animation}
                        theme={propTheme}
                        style={{
                            marginBottom: '0.75rem',
                            backgroundColor: 'rgba(0,0,0,0.02)',
                            padding: '0.75rem',
                            borderRadius: '6px'
                        }}
                    />
                ))}
            </div>
        ];
    };

    if (!isReady) {
        return (
            <div
                role="status"
                aria-busy="true"
                aria-live="polite"
                aria-label={ariaLabel}
                className={`dynamic-skeleton ${className}`.trim()}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    ...style
                }}
            >
                <span className="sr-only">{ariaLabel}</span>
                <div style={{
                    padding: '1rem',
                    color: '#9ca3af',
                    fontStyle: 'italic'
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div
            role="status"
            aria-busy="true"
            aria-live="polite"
            aria-label={ariaLabel}
            className={`dynamic-skeleton ${className}`.trim()}
            style={{
                pointerEvents: 'none',
                userSelect: 'none',
                ...style
            }}
        >
            <span className="sr-only">{ariaLabel}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {skeletonElements}
            </div>
        </div>
    );
};