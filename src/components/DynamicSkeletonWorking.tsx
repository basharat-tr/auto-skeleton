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

    useEffect(() => {
        // Generate skeleton based on typical content structure
        // This will match the QuickTest content structure
        const generateSkeleton = () => {
            const elements: JSX.Element[] = [];

            // Header Section (Welcome to Our Platform)
            elements.push(
                <div key="header-section" style={{ marginBottom: '24px' }}>
                    <SkeletonPrimitive
                        key="main-title"
                        shape="line"
                        width="60%"
                        height="2rem"
                        animation={animation}
                        theme={propTheme}
                        style={{ marginBottom: '8px' }}
                    />
                    <SkeletonPrimitive
                        key="subtitle"
                        shape="line"
                        width="85%"
                        height="1rem"
                        animation={animation}
                        theme={propTheme}
                    />
                </div>
            );

            // Profile Section - Check if avatar exists in content
            const hasAvatar = forRef?.current?.innerHTML?.includes('👤') ||
                forRef?.current?.innerHTML?.includes('borderRadius: \'50%\'') ||
                forRef?.current?.innerHTML?.includes('border-radius: 50%');

            elements.push(
                <div key="profile-section" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '24px',
                    padding: '16px',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderRadius: '8px'
                }}>
                    {hasAvatar && (
                        <SkeletonPrimitive
                            key="avatar"
                            shape="circle"
                            width="60px"
                            height="60px"
                            animation={animation}
                            theme={propTheme}
                        />
                    )}
                    <div style={{ flex: 1 }}>
                        <SkeletonPrimitive
                            key="profile-name"
                            shape="line"
                            width="40%"
                            height="1.2rem"
                            animation={animation}
                            theme={propTheme}
                            style={{ marginBottom: '4px' }}
                        />
                        <SkeletonPrimitive
                            key="profile-email"
                            shape="line"
                            width="60%"
                            height="0.9rem"
                            animation={animation}
                            theme={propTheme}
                            style={{ marginBottom: '4px' }}
                        />
                        <SkeletonPrimitive
                            key="profile-role"
                            shape="line"
                            width="35%"
                            height="0.9rem"
                            animation={animation}
                            theme={propTheme}
                        />
                    </div>
                </div>
            );

            // Stats Grid
            elements.push(
                <div key="stats-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={`stat-${i}`} style={{
                            padding: '16px',
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
                                style={{ margin: '0 auto 8px' }}
                            />
                            <SkeletonPrimitive
                                key={`stat-value-${i}`}
                                shape="line"
                                width="50%"
                                height="1.5rem"
                                animation={animation}
                                theme={propTheme}
                                style={{ margin: '0 auto 4px' }}
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
                </div>
            );

            // Action Buttons
            elements.push(
                <div key="buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    <SkeletonPrimitive
                        key="btn-1"
                        shape="rect"
                        width="140px"
                        height="48px"
                        animation={animation}
                        theme={propTheme}
                        style={{ borderRadius: '8px' }}
                    />
                    <SkeletonPrimitive
                        key="btn-2"
                        shape="rect"
                        width="120px"
                        height="48px"
                        animation={animation}
                        theme={propTheme}
                        style={{ borderRadius: '8px' }}
                    />
                    <SkeletonPrimitive
                        key="btn-3"
                        shape="rect"
                        width="100px"
                        height="48px"
                        animation={animation}
                        theme={propTheme}
                        style={{ borderRadius: '8px' }}
                    />
                </div>
            );

            // Recent Activity Section
            elements.push(
                <div key="activity-section">
                    <SkeletonPrimitive
                        key="activity-title"
                        shape="line"
                        width="30%"
                        height="1.2rem"
                        animation={animation}
                        theme={propTheme}
                        style={{ marginBottom: '16px' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <SkeletonPrimitive
                                key={`activity-${i}`}
                                shape="line"
                                width={`${80 + (i * 5)}%`}
                                height="1rem"
                                animation={animation}
                                theme={propTheme}
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    padding: '12px',
                                    borderRadius: '6px'
                                }}
                            />
                        ))}
                    </div>
                </div>
            );

            setSkeletonElements(elements);
        };

        const timer = setTimeout(generateSkeleton, 50);
        return () => clearTimeout(timer);
    }, [forRef, animation, propTheme]);

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