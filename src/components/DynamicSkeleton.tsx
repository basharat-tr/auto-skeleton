import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { DynamicSkeletonProps, SkeletonSpec, ElementMetadata, SkeletonPrimitiveSpec, MappingRule } from '../types';
import { buildElementTree } from '../utils/domScanner';
import { applyMappingRules, validateAndMergeRules } from '../utils/mappingEngine';
import { generateOptimalSkeletonDimensions, createPlaceholderStyles, analyzeContainerLayout } from '../utils/layoutPreservation';
import { SkeletonPrimitive } from './SkeletonPrimitive';
import { useSkeletonTheme } from './SkeletonThemeProvider';

/**
 * Error boundary component for handling DOM scanning errors
 */
class SkeletonErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('DynamicSkeleton error boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div
          role="status"
          aria-busy="true"
          aria-live="polite"
          aria-label="Loading content..."
          tabIndex={-1}
          style={{
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            color: '#6b7280',
            pointerEvents: 'none',
            userSelect: 'none',
            outline: 'none'
          }}
          onFocus={(e: React.FocusEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.currentTarget.blur();
          }}
        >
          <span className="sr-only" aria-hidden="true">Loading content...</span>
          <div>Loading...</div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Validate a skeleton specification
 */
const validateSkeletonSpec = (spec: SkeletonSpec): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!spec) {
    errors.push('Skeleton specification is required');
    return { isValid: false, errors };
  }

  if (!Array.isArray(spec.children)) {
    errors.push('Skeleton specification must have a children array');
    return { isValid: false, errors };
  }

  // Validate each child primitive
  spec.children.forEach((child, index) => {
    if (!child.key) {
      errors.push(`Child at index ${index} is missing required 'key' property`);
    }

    if (!child.shape || !['rect', 'circle', 'line'].includes(child.shape)) {
      errors.push(`Child at index ${index} has invalid shape: ${child.shape}`);
    }

    // Validate lines property for line shapes
    if (child.shape === 'line' && child.lines !== undefined) {
      if (typeof child.lines !== 'number' || child.lines < 1) {
        errors.push(`Child at index ${index} has invalid lines value: ${child.lines}`);
      }
    }
  });

  // Check for duplicate keys
  const keys = spec.children.map(child => child.key);
  const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (duplicateKeys.length > 0) {
    errors.push(`Duplicate keys found: ${duplicateKeys.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Convert element metadata tree to skeleton specification with layout preservation
 */
const convertElementTreeToSpec = (
  elements: ElementMetadata[],
  mappingRules: MappingRule[] = [],
  options: {
    keepSpace?: boolean;
    rootElement?: HTMLElement;
  } = {}
): SkeletonSpec => {
  const { keepSpace = false, rootElement } = options;

  const processElement = (element: ElementMetadata, domElement?: HTMLElement): SkeletonPrimitiveSpec[] => {
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

    // Apply layout preservation if keepSpace is enabled
    if (keepSpace && domElement) {
      const optimalDimensions = generateOptimalSkeletonDimensions(element, domElement, { keepSpace });
      const placeholderStyles = createPlaceholderStyles(optimalDimensions, {
        preserveAspectRatio: primitive.shape === 'circle' || element.tagName === 'img',
        flexibleWidth: optimalDimensions.strategy === 'flexible',
        flexibleHeight: optimalDimensions.strategy === 'flexible'
      });

      // Merge layout preservation styles with existing styles
      primitive.style = {
        ...placeholderStyles,
        ...primitive.style
      };

      // Update dimensions if they weren't explicitly set
      if (!primitive.width && optimalDimensions.width) {
        primitive.width = optimalDimensions.width;
      }
      if (!primitive.height && optimalDimensions.height) {
        primitive.height = optimalDimensions.height;
      }
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
    allPrimitives.push(...processElement(element, rootElement));
  }

  return {
    children: allPrimitives,
    layout: 'stack' // Default layout
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
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC
  const contextTheme = useSkeletonTheme();
  const [generatedSpec, setGeneratedSpec] = useState<SkeletonSpec | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // Memoize validated mapping rules
  const validatedRules = useMemo(() => {
    return validateAndMergeRules(mappingRules);
  }, [mappingRules]);

  /**
   * Scan DOM and generate skeleton specification
   */
  const scanAndGenerateSpec = useCallback(async () => {
    if (!forRef?.current) {
      setScanError('No element reference provided');
      return;
    }

    setIsScanning(true);
    setScanError(null);

    try {
      // Use setTimeout to make scanning async and allow UI updates
      await new Promise(resolve => setTimeout(resolve, 10));

      // Scan DOM tree
      const elementTree = buildElementTree(forRef.current);

      if (elementTree.length === 0) {
        setScanError('No elements found to scan');
        setIsScanning(false);
        return;
      }

      // Convert to skeleton specification with layout preservation options
      const spec = convertElementTreeToSpec(elementTree, validatedRules, {
        keepSpace,
        rootElement: forRef.current
      });

      setGeneratedSpec(spec);
      setScanError(null);
    } catch (error) {
      console.warn('Error during DOM scanning:', error);
      setScanError(error instanceof Error ? error.message : 'Unknown scanning error');
    } finally {
      setIsScanning(false);
    }
  }, [forRef, validatedRules, keepSpace]);

  /**
   * Effect to trigger DOM scanning when ref or rules change
   */
  useEffect(() => {
    // Only scan if we don't have a renderSpec override
    if (!renderSpec) {
      if (forRef?.current) {
        scanAndGenerateSpec();
      } else if (forRef) {
        // forRef is provided but current is null - set error
        setScanError('No element reference provided');
      }
    }
  }, [forRef, renderSpec, scanAndGenerateSpec]);

  /**
   * Determine which spec to use with validation
   */
  const activeSpec = useMemo(() => {
    // Use renderSpec override if provided
    if (renderSpec) {
      const validation = validateSkeletonSpec(renderSpec);
      if (!validation.isValid) {
        console.warn('Invalid renderSpec provided:', validation.errors);
        setScanError(`Invalid skeleton specification: ${validation.errors.join(', ')}`);
        return null;
      }
      return renderSpec;
    }

    // Use generated spec from DOM scanning
    return generatedSpec;
  }, [renderSpec, generatedSpec]);

  /**
   * Render skeleton primitives from specification
   */
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

  /**
   * Render loading state while scanning
   */
  if (isScanning) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`dynamic-skeleton ${className}`.trim()}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          outline: 'none',
          ...style
        }}
        onFocus={(e: React.FocusEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.currentTarget.blur();
        }}
      >
        <span className="sr-only" aria-hidden="true">{ariaLabel}</span>
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

  /**
   * Render error state
   */
  if (scanError) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`dynamic-skeleton dynamic-skeleton-error ${className}`.trim()}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          outline: 'none',
          ...style
        }}
        onFocus={(e: React.FocusEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.currentTarget.blur();
        }}
      >
        <span className="sr-only" aria-hidden="true">{ariaLabel}</span>
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

  /**
   * Calculate container styles with layout preservation
   */
  const containerStyles: React.CSSProperties = useMemo(() => {
    const baseStyles = { ...style };

    if (keepSpace && forRef?.current) {
      try {
        const element = forRef.current;
        const layoutAnalysis = analyzeContainerLayout(element);

        // Apply different strategies based on layout analysis
        if (layoutAnalysis.recommendedStrategy === 'preserve') {
          // Preserve exact dimensions
          baseStyles.width = element.offsetWidth || 'auto';
          baseStyles.height = element.offsetHeight || 'auto';
          baseStyles.minHeight = element.offsetHeight || 'auto';
        } else if (layoutAnalysis.recommendedStrategy === 'flexible') {
          // Use flexible dimensions but maintain minimum height
          baseStyles.width = '100%';
          baseStyles.minHeight = element.offsetHeight || 'auto';
        } else {
          // Minimal preservation - just prevent collapse
          baseStyles.minHeight = element.offsetHeight || '2rem';
        }

        // Always prevent layout shifts
        baseStyles.boxSizing = 'border-box';

        // Add transition for smooth loading
        baseStyles.transition = 'all 0.2s ease-in-out';

      } catch (error) {
        console.warn('Failed to calculate container styles:', error);
        // Fallback to basic preservation
        baseStyles.minHeight = '2rem';
      }
    }

    return baseStyles;
  }, [style, keepSpace, forRef]);

  return (
    <SkeletonErrorBoundary>
      <div
        role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`dynamic-skeleton ${className}`.trim()}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          outline: 'none',
          ...containerStyles
        }}
        onFocus={(e: React.FocusEvent<HTMLDivElement>) => {
          // Prevent focus on skeleton elements
          e.preventDefault();
          e.currentTarget.blur();
        }}
      >
        <span className="sr-only" aria-hidden="true">{ariaLabel}</span>
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
    </SkeletonErrorBoundary>
  );
};