// Dynamic Skeleton Loader - Main Export

// Core components
// Export both versions for different use cases
export { DynamicSkeleton } from './components/DynamicSkeletonEnterprise';
export { DynamicSkeleton as DynamicSkeletonRuntime } from './components/DynamicSkeletonWorking';
export { SkeletonPrimitive } from './components/SkeletonPrimitive';
export { SkeletonLine } from './components/SkeletonLine';
export {
    SkeletonThemeProvider,
    useSkeletonTheme,
    LIGHT_THEME,
    DARK_THEME,
    createSkeletonTheme,
    validateSkeletonTheme
} from './components/SkeletonThemeProvider';

// Core utilities
export { scanElement, buildElementTree, getBoundingInfo } from './utils/domScanner';
export {
    applyMappingRules,
    createDefaultRules,
    calculateTextLines,
    parseDataSkeletonAttribute,
    doesElementMatchRule,
    validateAndMergeRules
} from './utils/mappingEngine';

// Layout utilities
export {
    extractActualDimensions,
    getFallbackDimensions,
    calculateContentBasedDimensions,
    createPlaceholderStyles,
    analyzeContainerLayout,
    generateOptimalSkeletonDimensions,
    FALLBACK_DIMENSIONS
} from './utils/layoutPreservation';

// Build-time utilities
export {
    generateStaticSpec,
    validateSkeletonSpec,
    serializeSkeletonSpec,
    deserializeSkeletonSpec,
    generateMultipleSpecs,
    isServerSide,
    isClientSide,
    generateServerSafeSpec,
    loadStaticSpec,
    hydrateStaticSpec,
    SpecCache,
    globalSpecCache,
    generateSSRSpec
} from './utils/buildTimeGenerator';

// Enterprise skeleton utilities
export {
    skeletonRegistry,
    SKELETON_SPECS,
    createSkeletonSpec,
    getSkeletonSpec,
    generateComponentSpec,
    validateSkeletonSpec
} from './utils/enterpriseSkeletonGenerator';

// Enterprise component utilities
export {
    useSkeletonSpec,
    useSkeletonPerformance,
    withSkeleton
} from './components/DynamicSkeletonEnterprise';

// Export all types
export * from './types';

// Default export
export { DynamicSkeleton as default } from './components/DynamicSkeletonEnterprise';