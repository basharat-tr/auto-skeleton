import React, { useEffect, useState, useCallback } from 'react';
import { DynamicSkeletonProps } from '../types';
import { SkeletonPrimitive } from './SkeletonPrimitive';
import { useSkeletonTheme } from './SkeletonThemeProvider';

interface SimpleElement {
    tag: string;
    width: number;
    height: number;
    isVisible: boolean;
    hasText: boolean;
    isButton: boolean;
    isImage: boolean;
    isCircular: boolean;
}

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
    const [isScanning, setIsScanning] = useState(true);

    // Simple DOM scanner that actually looks at your content
    const scanContent = useCallback(() => {
        if (!forRef?.current) {
            setSkeletonElements([]);
            setIsScanning(false);
            return;
        }

        try {
            const elements: SimpleElement[] = [];
            const scanElement = (el: Element, depth = 0) => {
                if (depth > 5) return; // Prevent infinite recursion

                const rect = el.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(el);
                const isVisible = computedStyle.display !== 'none' &&
                    computedStyle.visibility !== 'hidden' &&
                    rect.width > 0 && rect.height > 0;

                if (isVisible) {
                    const tagName = el.tagName.toLowerCase();
                    const hasText = el.textContent && el.textContent.trim().length > 0;
                    const isButton = tagName === 'button' || el.classList.contains('btn');
                    const isImage = tagName === 'img';
                    const isCircular = computedStyle.borderRadius === '50%' ||
                        computedStyle.borderRadius.includes('50%');

                    elements.push({
                        tag: tagName,
                        width: rect.width,
                        height: rect.height,
                        isVisible,
                        hasText: !!hasText,
                        isButton,
                        isImage,
                        isCircular
                    });
                }

                // Scan children
                Array.from(el.children).forEach(child => {
                    scanElement(child, depth + 1);
                });
            };

            scanElement(forRef.current);
            generateSkeletonFromElements(elements);
        } catch (error) {
            console.warn('Error scanning content:', error);
            setSkeletonElements([]);
        }

        setIsScanning(false);
    }, [forRef, animation, propTheme]);

    // Generate skeleton elements based on scanned content
    const generateSkeletonFromElements = (elements: SimpleElement[]) => {
        const skeletons: JSX.Element[] = [];
        let keyCounter = 0;

        elements.forEach((el, index) => {
            const key = `skeleton-${keyCounter++}`;

            // Skip very small elements
            if (el.width < 10 || el.height < 10) return;

            let skeletonElement: JSX.Element;

            if (el.isButton) {
                // Button skeleton
                skeletonElement = (
                    <SkeletonPrimitive
                        key={key}
                        shape="rect"
                        width={`${Math.min(el.width, 200)}px`}
                        height={`${Math.min(el.height, 50)}px`}
                        animation={animation}
                        theme={propTheme}
                        style={{
                            borderRadius: '8px',
                            marginBottom: '0.5rem'
                        }}
                    />
                );
            } else if (el.isImage || el.isCircular) {
                // Image or circular element skeleton
                skeletonElement = (
                    <SkeletonPrimitive
                        key={key}
                        shape={el.isCircular ? "circle" : "rect"}
                        width={`${Math.min(el.width, 100)}px`}
                        height={`${Math.min(el.height, 100)}px`}
                        animation={animation}
                        theme={propTheme}
                        style={{ marginBottom: '0.5rem' }}
                    />
                );
            } else if (el.tag.match(/^h[1-6]$/)) {
                // Heading skeleton
                skeletonElement = (
                    <SkeletonPrimitive
                        key={key}
                        shape="line"
                        width={`${Math.min(el.width * 0.7, 300)}px`}
                        height={`${el.height}px`}
                        animation={animation}
                        theme={propTheme}
                        style={{ marginBottom: '0.5rem' }}
                    />
                );
            } else if (el.tag === 'p' || el.hasText) {
                // Text/paragraph skeleton
                const lines = Math.max(1, Math.floor(el.height / 20));
                skeletonElement = (
                    <div key={key} style={{ marginBottom: '0.5rem' }}>
                        {Array.from({ length: Math.min(lines, 3) }, (_, i) => (
                            <SkeletonPrimitive
                                key={`${key}-line-${i}`}
                                shape="line"
                                width={i === lines - 1 ? `${el.width * 0.6}px` : `${el.width * 0.9}px`}
                                height="1rem"
                                animation={animation}
                                theme={propTheme}
                                style={{ marginBottom: '0.25rem' }}
                            />
                        ))}
                    </div>
                );
            } else {
                // Generic rectangle skeleton
                skeletonElement = (
                    <SkeletonPrimitive
                        key={key}
                        shape="rect"
                        width={`${Math.min(el.width, 400)}px`}
                        height={`${Math.min(el.height, 200)}px`}
                        animation={animation}
                        theme={propTheme}
                        style={{ marginBottom: '0.5rem' }}
                    />
                );
            }

            skeletons.push(skeletonElement);
        });

        setSkeletonElements(skeletons);
    };

    // Scan content when component mounts or ref changes
    useEffect(() => {
        const timer = setTimeout(() => {
            scanContent();
        }, 100); // Small delay to ensure content is rendered

        return () => clearTimeout(timer);
    }, [scanContent]);

    if (isScanning) {
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
                    Scanning content...
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
                {skeletonElements.length > 0 ? skeletonElements : (
                    <div style={{ padding: '1rem', color: '#9ca3af' }}>
                        No content found to generate skeleton
                    </div>
                )}
            </div>
        </div>
    );
};