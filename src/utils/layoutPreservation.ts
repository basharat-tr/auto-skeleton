// Layout preservation utilities for preventing layout shifts during skeleton loading

import { ElementMetadata, DimensionInfo } from '../types';

/**
 * Fallback dimensions for common element types when actual dimensions are unknown
 */
export const FALLBACK_DIMENSIONS = {
    // Text elements
    h1: { width: '80%', height: '2rem' },
    h2: { width: '70%', height: '1.75rem' },
    h3: { width: '60%', height: '1.5rem' },
    h4: { width: '50%', height: '1.25rem' },
    h5: { width: '45%', height: '1.125rem' },
    h6: { width: '40%', height: '1rem' },
    p: { width: '100%', height: '1.25rem' },
    span: { width: '4rem', height: '1rem' },

    // Interactive elements
    button: { width: '6rem', height: '2.5rem' },
    input: { width: '12rem', height: '2.5rem' },
    select: { width: '10rem', height: '2.5rem' },
    textarea: { width: '100%', height: '6rem' },

    // Media elements
    img: { width: '8rem', height: '6rem' },
    video: { width: '16rem', height: '9rem' },
    canvas: { width: '12rem', height: '8rem' },
    svg: { width: '2rem', height: '2rem' },

    // Layout elements
    div: { width: '100%', height: '2rem' },
    section: { width: '100%', height: '4rem' },
    article: { width: '100%', height: '8rem' },
    aside: { width: '16rem', height: '12rem' },
    nav: { width: '100%', height: '3rem' },
    header: { width: '100%', height: '4rem' },
    footer: { width: '100%', height: '3rem' },

    // List elements
    ul: { width: '100%', height: '6rem' },
    ol: { width: '100%', height: '6rem' },
    li: { width: '100%', height: '1.5rem' },

    // Table elements
    table: { width: '100%', height: '8rem' },
    tr: { width: '100%', height: '2rem' },
    td: { width: '6rem', height: '2rem' },
    th: { width: '6rem', height: '2.5rem' },

    // Default fallback
    default: { width: '8rem', height: '2rem' }
} as const;

/**
 * Interface for preserved layout dimensions
 */
export interface PreservedDimensions {
    width: string | number;
    height: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
}

/**
 * Extract actual dimensions from a DOM element with fallbacks
 */
export const extractActualDimensions = (element: HTMLElement): PreservedDimensions => {
    try {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);

        // Get actual dimensions
        const width = rect.width > 0 ? rect.width : undefined;
        const height = rect.height > 0 ? rect.height : undefined;

        // Get CSS dimensions as fallbacks
        const cssWidth = computedStyle.width !== 'auto' ? computedStyle.width : undefined;
        const cssHeight = computedStyle.height !== 'auto' ? computedStyle.height : undefined;

        // Get min/max constraints
        const minWidth = computedStyle.minWidth !== '0px' ? computedStyle.minWidth : undefined;
        const minHeight = computedStyle.minHeight !== '0px' ? computedStyle.minHeight : undefined;
        const maxWidth = computedStyle.maxWidth !== 'none' ? computedStyle.maxWidth : undefined;
        const maxHeight = computedStyle.maxHeight !== 'none' ? computedStyle.maxHeight : undefined;

        return {
            width: width || cssWidth || getFallbackDimensions(element.tagName.toLowerCase()).width,
            height: height || cssHeight || getFallbackDimensions(element.tagName.toLowerCase()).height,
            ...(minWidth && { minWidth }),
            ...(minHeight && { minHeight }),
            ...(maxWidth && { maxWidth }),
            ...(maxHeight && { maxHeight })
        };
    } catch (error) {
        console.warn('Failed to extract actual dimensions:', error);
        return getFallbackDimensions(element.tagName.toLowerCase());
    }
};

/**
 * Get fallback dimensions for an element type
 */
export const getFallbackDimensions = (tagName: string): PreservedDimensions => {
    const fallback = FALLBACK_DIMENSIONS[tagName as keyof typeof FALLBACK_DIMENSIONS] || FALLBACK_DIMENSIONS.default;
    return {
        width: fallback.width,
        height: fallback.height
    };
};

/**
 * Calculate dimensions based on content and context
 */
export const calculateContentBasedDimensions = (metadata: ElementMetadata): PreservedDimensions => {
    const { tagName, textContent, dimensions, computedStyle } = metadata;

    // Use actual dimensions if available and non-zero
    if (dimensions.width > 0 && dimensions.height > 0) {
        return {
            width: dimensions.width,
            height: dimensions.height
        };
    }

    // Calculate based on text content for text elements
    if (['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        const textLength = textContent.length;
        const fontSize = parseFloat(computedStyle.fontSize) || 16;

        if (textLength > 0) {
            // Estimate width based on character count (rough approximation)
            const estimatedWidth = Math.min(textLength * fontSize * 0.6, 600); // Cap at 600px
            const estimatedHeight = fontSize * 1.4; // Line height approximation

            return {
                width: estimatedWidth,
                height: estimatedHeight
            };
        }
    }

    // Use fallback dimensions
    return getFallbackDimensions(tagName);
};

/**
 * Create CSS placeholder styles to maintain layout space
 */
export const createPlaceholderStyles = (
    dimensions: PreservedDimensions,
    options: {
        preserveAspectRatio?: boolean;
        useMinDimensions?: boolean;
        flexibleWidth?: boolean;
        flexibleHeight?: boolean;
    } = {}
): React.CSSProperties => {
    const {
        preserveAspectRatio = false,
        useMinDimensions = true,
        flexibleWidth = false,
        flexibleHeight = false
    } = options;

    const styles: React.CSSProperties = {
        // Prevent layout shifts
        boxSizing: 'border-box',

        // Set dimensions
        width: flexibleWidth ? '100%' : dimensions.width,
        height: flexibleHeight ? 'auto' : dimensions.height,
    };

    // Add min dimensions if requested
    if (useMinDimensions) {
        if (dimensions.minWidth) styles.minWidth = dimensions.minWidth;
        if (dimensions.minHeight) styles.minHeight = dimensions.minHeight;
        if (dimensions.maxWidth) styles.maxWidth = dimensions.maxWidth;
        if (dimensions.maxHeight) styles.maxHeight = dimensions.maxHeight;
    }

    // Preserve aspect ratio if requested
    if (preserveAspectRatio && typeof dimensions.width === 'number' && typeof dimensions.height === 'number') {
        const aspectRatio = dimensions.width / dimensions.height;
        styles.aspectRatio = aspectRatio.toString();
    }

    return styles;
};

/**
 * Analyze container layout to determine optimal skeleton sizing strategy
 */
export interface LayoutAnalysis {
    containerType: 'flex' | 'grid' | 'block' | 'inline' | 'absolute' | 'unknown';
    isFlexible: boolean;
    hasFixedDimensions: boolean;
    recommendedStrategy: 'preserve' | 'flexible' | 'minimal';
}

export const analyzeContainerLayout = (element: HTMLElement): LayoutAnalysis => {
    try {
        const computedStyle = window.getComputedStyle(element);
        const parent = element.parentElement;
        const parentStyle = parent ? window.getComputedStyle(parent) : null;

        // Determine container type
        let containerType: LayoutAnalysis['containerType'] = 'unknown';
        if (parentStyle) {
            if (parentStyle.display === 'flex') containerType = 'flex';
            else if (parentStyle.display === 'grid') containerType = 'grid';
            else if (computedStyle.position === 'absolute' || computedStyle.position === 'fixed') containerType = 'absolute';
            else if (computedStyle.display === 'inline' || computedStyle.display === 'inline-block') containerType = 'inline';
            else containerType = 'block';
        }

        // Check if element has flexible sizing
        const isFlexible = (
            computedStyle.width === 'auto' ||
            (computedStyle.width && computedStyle.width.includes('%')) ||
            computedStyle.flexGrow !== '0' ||
            (parentStyle?.display === 'grid' && computedStyle.gridColumn && computedStyle.gridColumn.includes('fr'))
        );

        // Check if element has fixed dimensions
        const hasFixedDimensions = (
            computedStyle.width !== 'auto' && computedStyle.width && !computedStyle.width.includes('%') &&
            computedStyle.height !== 'auto' && computedStyle.height && !computedStyle.height.includes('%')
        );

        // Recommend strategy based on analysis
        let recommendedStrategy: LayoutAnalysis['recommendedStrategy'] = 'preserve';
        if (containerType === 'flex' && isFlexible) {
            recommendedStrategy = 'flexible';
        } else if (containerType === 'absolute' || hasFixedDimensions) {
            recommendedStrategy = 'preserve';
        } else if (containerType === 'inline') {
            recommendedStrategy = 'minimal';
        }

        return {
            containerType,
            isFlexible,
            hasFixedDimensions,
            recommendedStrategy
        };
    } catch (error) {
        console.warn('Failed to analyze container layout:', error);
        return {
            containerType: 'unknown',
            isFlexible: false,
            hasFixedDimensions: false,
            recommendedStrategy: 'preserve'
        };
    }
};

/**
 * Generate optimal skeleton dimensions based on element metadata and layout analysis
 */
export const generateOptimalSkeletonDimensions = (
    metadata: ElementMetadata,
    element?: HTMLElement,
    options: {
        keepSpace?: boolean;
        strategy?: 'preserve' | 'flexible' | 'minimal' | 'auto';
    } = {}
): PreservedDimensions & { strategy: string } => {
    const { keepSpace = false, strategy = 'auto' } = options;

    // If keepSpace is false, use content-based dimensions
    if (!keepSpace) {
        return {
            ...calculateContentBasedDimensions(metadata),
            strategy: 'content-based'
        };
    }

    // If element is provided, extract actual dimensions
    if (element) {
        const actualDimensions = extractActualDimensions(element);

        // Auto-determine strategy if not specified
        let finalStrategy = strategy;
        if (strategy === 'auto') {
            const layoutAnalysis = analyzeContainerLayout(element);
            finalStrategy = layoutAnalysis.recommendedStrategy;
        }

        // Apply strategy-specific adjustments
        switch (finalStrategy) {
            case 'flexible':
                return {
                    ...actualDimensions,
                    width: '100%', // Use full width for flexible layouts
                    strategy: 'flexible'
                };

            case 'minimal':
                return {
                    width: 'auto',
                    height: actualDimensions.height,
                    minWidth: typeof actualDimensions.width === 'number' ? `${actualDimensions.width}px` : actualDimensions.width,
                    strategy: 'minimal'
                };

            case 'preserve':
            default:
                return {
                    ...actualDimensions,
                    strategy: 'preserve'
                };
        }
    }

    // Fallback to content-based dimensions
    return {
        ...calculateContentBasedDimensions(metadata),
        strategy: 'fallback'
    };
};