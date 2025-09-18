// Utilities barrel export

// DOM scanning utilities
export { scanElement, buildElementTree, getBoundingInfo } from './domScanner';

// Mapping engine utilities
export {
    applyMappingRules,
    createDefaultRules,
    calculateTextLines,
    parseDataSkeletonAttribute,
    doesElementMatchRule,
    validateAndMergeRules
} from './mappingEngine';

// Layout preservation utilities
export {
    extractActualDimensions,
    getFallbackDimensions,
    calculateContentBasedDimensions,
    createPlaceholderStyles,
    analyzeContainerLayout,
    generateOptimalSkeletonDimensions,
    FALLBACK_DIMENSIONS
} from './layoutPreservation';

// Build-time generation utilities
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
} from './buildTimeGenerator';