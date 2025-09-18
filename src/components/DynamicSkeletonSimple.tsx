import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { DynamicSkeletonProps, SkeletonSpec, ElementMetadata, SkeletonPrimitiveSpec, MappingRule } from '../types';
import { buildElementTree } from '../utils/domScanner';
import { applyMappingRules, validateAndMergeRules } from '../utils/mappingEngine';
import { SkeletonPrimitive } from './SkeletonPrimitive';
import { useSkeletonTheme } from './SkeletonThemeProvider';

/**
 * Convert element metadata tree to skeleton specification
 */
const convertElementTreeToSpec = (
    elements: ElementMetadata[],
    mappingRules: MappingRule[] = []
): SkeletonSpec => {
    const processElement = (element: ElementMetadata): SkeletonPrimitiveSpec[] => {
        // Apply mapping rules to current element
        const primitive = applyMappingRules(element, mappingRules);

        // Skip elements marked for skipping
        if (primitive.className === '__skeleton-skip__') {
            // Process children but skip this element
            const childPrimitives: SkeletonPrimitiveSpec[] = [];
            for (const child of element.children) {
                childPrimitives.push(...processElement(child));
            }
            return childPrimitives;
        }

        // Process children
        const childPrimitives: SkeletonPrimitiveSpec[] = [];
        for (const child of element.children) {
            childPrimitives.push(...processElement(child));
        }

        // Return current primitive and all child primitives flattened
        return [primitive, ...childPrimitives];
    };

    const allPrimitives: SkeletonPrimitiveSpec[] = [];
    for (const element of elements) {
        allPrimitives.push(...processElement(element));
    }

    return {
        children: allPrimitives,
        layout: 'stack'
    };
};

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
    // ALL HOOKS MUST BE CALLED FIRST - NO CONDITIONAL LOGIC BEFORE HOOKS
    const contextTheme = useSkeletonTheme();
    const [generatedSpec, setGeneratedSpec] = useState<SkeletonSpec | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);

    // Memoize validated mapping rules
    const validatedRules = useMemo(() => {
        return validateAndMergeRules(mappingRules);
    }, [mappingRules]);

    // Scan DOM and generate skeleton specification
    const scanAndGenerateSpec = useCallback(async () => {
        if (!forRef?.current) {
            setScanError('No element reference provided');
            return;
        }

        setIsScanning(true);
        setScanError(null);

        try {
            // Use setTimeout to make scanning async
            await new Promise(resolve => setTimeout(resolve, 10));

            // Scan DOM tree
            const elementTree = buildElementTree(forRef.current);

            if (elementTree.length === 0) {
                setScanError('No elements found to scan');
                setIsScanning(false);
                return;
            }

            // Convert to skeleton specification
            const spec = convertElementTreeToSpec(elementTree, validatedRules);

            setGeneratedSpec(spec);
            setScanError(null);
        } catch (error) {
            console.warn('Error during DOM scanning:', error);
            setScanError(error instanceof Error ? error.message : 'Unknown scanning error');
        } finally {
            setIsScanning(false);
        }
    }, [forRef, validatedRules]);

    // Effect to trigger DOM scanning when ref or rules change
    useEffect(() => {
        if (!renderSpec) {
            if (forRef?.current) {
                scanAndGenerateSpec();
            } else if (forRef) {
                setScanError('No element reference provided');
            }
        }
    }, [forRef, renderSpec, scanAndGenerateSpec]);

    // Determine which spec to use
    const activeSpec = useMemo(() => {
        if (renderSpec) {
            return renderSpec;
        }
        return generatedSpec;
    }, [renderSpec, generatedSpec]);

    // Calculate container styles
    const containerStyles = useMemo(() => {
        const baseStyles = { ...style };

        if (keepSpace && forRef?.current) {
            try {
                const element = forRef.current;
                baseStyles.minHeight = element.offsetHeight || '2rem';
                baseStyles.boxSizing = 'border-box';
            } catch (error) {
                console.warn('Failed to calculate container styles:', error);
                baseStyles.minHeight = '2rem';
            }
        }

        return baseStyles;
    }, [style, keepSpace, forRef]);

    // NOW WE CAN HAVE CONDITIONAL RENDERING - ALL HOOKS ARE CALLED ABOVE

    // Render loading state while scanning
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
                    ...containerStyles
                }}
            >
                <span className="sr-only">{ariaLabel}</span>
                <div style={{
                    padding: '1rem',
                    color: '#9ca3af',
                    fontStyle: 'italic'
                }}>
                    Analyzing component structure...
                </div>
            </div>
        );
    }

    // Render error state
    if (scanError) {
        return (
            <div
                role="status"
                aria-busy="true"
                aria-live="polite"
                aria-label={ariaLabel}
                className={`dynamic-skeleton dynamic-skeleton-error ${className}`.trim()}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    ...containerStyles
                }}
            >
                <span className="sr-only">{ariaLabel}</span>
                <div style={{
                    padding: '1rem',
                    color: '#ef4444',
                    backgroundColor: '#fef2f2',
                    borderRadius: '4px',
                    border: '1px solid #fecaca'
                }}>
                    Failed to generate skeleton: {scanError}
                </div>
            </div>
        );
    }

    // Render skeleton from spec
    const renderSkeletonFromSpec = (spec: SkeletonSpec) => {
        if (!spec.children || spec.children.length === 0) {
            return (
                <div style={{ padding: '1rem', color: '#9ca3af' }}>
                    No skeleton elements to render
                </div>
            );
        }

        return (
            <div
                className={`dynamic-skeleton-container ${spec.layout || 'stack'}`}
                style={{
                    display: 'flex',
                    flexDirection: spec.layout === 'row' ? 'row' : 'column',
                    gap: spec.gap || '0.5rem',
                }}
            >
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
                ...containerStyles
            }}
        >
            <span className="sr-only">{ariaLabel}</span>
            {activeSpec ? (
                renderSkeletonFromSpec(activeSpec)
            ) : (
                <div style={{
                    padding: '1rem',
                    color: '#9ca3af',
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px'
                }}>
                    No skeleton specification available
                </div>
            )}
        </div>
    );
};