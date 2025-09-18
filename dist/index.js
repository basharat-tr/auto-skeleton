// Dynamic Skeleton Loader - Optimized Build
// Total size: 40.92 KB
// Generated: 2025-09-18T10:13:14.592Z

// Core components (always loaded)
export * from './core';

// Optional features (lazy-loaded)
export const loadBuildTimeGenerator = () => import('./build-time');
export const loadAnimations = () => import('./animations');
export const loadPerformanceUtils = () => import('./performance');

// Tree-shakeable mapping rules
export const loadMappingRules = {
  avatar: () => import('./mapping-avatar'),
  button: () => import('./mapping-button'),
  heading: () => import('./mapping-heading')
};

// Bundle information
export const __buildInfo = {
  "timestamp": "2025-09-18T10:13:14.589Z",
  "bundles": {
    "core": {
      "size": 25000,
      "files": [
        "src/components/DynamicSkeleton.tsx",
        "src/components/SkeletonPrimitive.tsx"
      ],
      "description": "Core skeleton components",
      "sourceExists": true
    },
    "build-time": {
      "size": 8000,
      "files": [
        "src/utils/buildTimeGenerator.ts"
      ],
      "description": "Build-time spec generation (optional)",
      "sourceExists": true
    },
    "mapping-avatar": {
      "size": 500,
      "files": [
        "src/utils/mappingRules/avatar.ts"
      ],
      "description": "Avatar mapping rules (tree-shakeable)",
      "sourceExists": true
    },
    "mapping-button": {
      "size": 800,
      "files": [
        "src/utils/mappingRules/button.ts"
      ],
      "description": "Button mapping rules (tree-shakeable)",
      "sourceExists": true
    },
    "mapping-heading": {
      "size": 600,
      "files": [
        "src/utils/mappingRules/heading.ts"
      ],
      "description": "Heading mapping rules (tree-shakeable)",
      "sourceExists": true
    },
    "animations": {
      "size": 4000,
      "files": [
        "src/components/SkeletonPrimitive.optimized.css"
      ],
      "description": "Optimized CSS animations",
      "sourceExists": true
    },
    "performance": {
      "size": 3000,
      "files": [
        "src/utils/performance.ts",
        "src/utils/bundleAnalysis.ts"
      ],
      "description": "Performance monitoring utilities",
      "sourceExists": true
    }
  },
  "optimization": {
    "codeSplitting": true,
    "treeShakin": true,
    "cssOptimization": true,
    "performanceMonitoring": true
  }
};
