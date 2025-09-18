"use strict";
// Dynamic Skeleton Loader - Main Export
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.withSkeleton = exports.useSkeletonPerformance = exports.useSkeletonSpec = exports.generateComponentSpec = exports.getSkeletonSpec = exports.createSkeletonSpec = exports.SKELETON_SPECS = exports.skeletonRegistry = exports.generateSSRSpec = exports.globalSpecCache = exports.SpecCache = exports.hydrateStaticSpec = exports.loadStaticSpec = exports.generateServerSafeSpec = exports.isClientSide = exports.isServerSide = exports.generateMultipleSpecs = exports.deserializeSkeletonSpec = exports.serializeSkeletonSpec = exports.validateSkeletonSpec = exports.generateStaticSpec = exports.FALLBACK_DIMENSIONS = exports.generateOptimalSkeletonDimensions = exports.analyzeContainerLayout = exports.createPlaceholderStyles = exports.calculateContentBasedDimensions = exports.getFallbackDimensions = exports.extractActualDimensions = exports.validateAndMergeRules = exports.doesElementMatchRule = exports.parseDataSkeletonAttribute = exports.calculateTextLines = exports.createDefaultRules = exports.applyMappingRules = exports.getBoundingInfo = exports.buildElementTree = exports.scanElement = exports.validateSkeletonTheme = exports.createSkeletonTheme = exports.DARK_THEME = exports.LIGHT_THEME = exports.useSkeletonTheme = exports.SkeletonThemeProvider = exports.SkeletonLine = exports.SkeletonPrimitive = exports.DynamicSkeletonRuntime = exports.DynamicSkeleton = void 0;
// Core components
// Export both versions for different use cases
var DynamicSkeletonEnterprise_1 = require("./components/DynamicSkeletonEnterprise");
Object.defineProperty(exports, "DynamicSkeleton", { enumerable: true, get: function () { return DynamicSkeletonEnterprise_1.DynamicSkeleton; } });
var DynamicSkeletonWorking_1 = require("./components/DynamicSkeletonWorking");
Object.defineProperty(exports, "DynamicSkeletonRuntime", { enumerable: true, get: function () { return DynamicSkeletonWorking_1.DynamicSkeleton; } });
var SkeletonPrimitive_1 = require("./components/SkeletonPrimitive");
Object.defineProperty(exports, "SkeletonPrimitive", { enumerable: true, get: function () { return SkeletonPrimitive_1.SkeletonPrimitive; } });
var SkeletonLine_1 = require("./components/SkeletonLine");
Object.defineProperty(exports, "SkeletonLine", { enumerable: true, get: function () { return SkeletonLine_1.SkeletonLine; } });
var SkeletonThemeProvider_1 = require("./components/SkeletonThemeProvider");
Object.defineProperty(exports, "SkeletonThemeProvider", { enumerable: true, get: function () { return SkeletonThemeProvider_1.SkeletonThemeProvider; } });
Object.defineProperty(exports, "useSkeletonTheme", { enumerable: true, get: function () { return SkeletonThemeProvider_1.useSkeletonTheme; } });
Object.defineProperty(exports, "LIGHT_THEME", { enumerable: true, get: function () { return SkeletonThemeProvider_1.LIGHT_THEME; } });
Object.defineProperty(exports, "DARK_THEME", { enumerable: true, get: function () { return SkeletonThemeProvider_1.DARK_THEME; } });
Object.defineProperty(exports, "createSkeletonTheme", { enumerable: true, get: function () { return SkeletonThemeProvider_1.createSkeletonTheme; } });
Object.defineProperty(exports, "validateSkeletonTheme", { enumerable: true, get: function () { return SkeletonThemeProvider_1.validateSkeletonTheme; } });
// Core utilities
var domScanner_1 = require("./utils/domScanner");
Object.defineProperty(exports, "scanElement", { enumerable: true, get: function () { return domScanner_1.scanElement; } });
Object.defineProperty(exports, "buildElementTree", { enumerable: true, get: function () { return domScanner_1.buildElementTree; } });
Object.defineProperty(exports, "getBoundingInfo", { enumerable: true, get: function () { return domScanner_1.getBoundingInfo; } });
var mappingEngine_1 = require("./utils/mappingEngine");
Object.defineProperty(exports, "applyMappingRules", { enumerable: true, get: function () { return mappingEngine_1.applyMappingRules; } });
Object.defineProperty(exports, "createDefaultRules", { enumerable: true, get: function () { return mappingEngine_1.createDefaultRules; } });
Object.defineProperty(exports, "calculateTextLines", { enumerable: true, get: function () { return mappingEngine_1.calculateTextLines; } });
Object.defineProperty(exports, "parseDataSkeletonAttribute", { enumerable: true, get: function () { return mappingEngine_1.parseDataSkeletonAttribute; } });
Object.defineProperty(exports, "doesElementMatchRule", { enumerable: true, get: function () { return mappingEngine_1.doesElementMatchRule; } });
Object.defineProperty(exports, "validateAndMergeRules", { enumerable: true, get: function () { return mappingEngine_1.validateAndMergeRules; } });
// Layout utilities
var layoutPreservation_1 = require("./utils/layoutPreservation");
Object.defineProperty(exports, "extractActualDimensions", { enumerable: true, get: function () { return layoutPreservation_1.extractActualDimensions; } });
Object.defineProperty(exports, "getFallbackDimensions", { enumerable: true, get: function () { return layoutPreservation_1.getFallbackDimensions; } });
Object.defineProperty(exports, "calculateContentBasedDimensions", { enumerable: true, get: function () { return layoutPreservation_1.calculateContentBasedDimensions; } });
Object.defineProperty(exports, "createPlaceholderStyles", { enumerable: true, get: function () { return layoutPreservation_1.createPlaceholderStyles; } });
Object.defineProperty(exports, "analyzeContainerLayout", { enumerable: true, get: function () { return layoutPreservation_1.analyzeContainerLayout; } });
Object.defineProperty(exports, "generateOptimalSkeletonDimensions", { enumerable: true, get: function () { return layoutPreservation_1.generateOptimalSkeletonDimensions; } });
Object.defineProperty(exports, "FALLBACK_DIMENSIONS", { enumerable: true, get: function () { return layoutPreservation_1.FALLBACK_DIMENSIONS; } });
// Build-time utilities
var buildTimeGenerator_1 = require("./utils/buildTimeGenerator");
Object.defineProperty(exports, "generateStaticSpec", { enumerable: true, get: function () { return buildTimeGenerator_1.generateStaticSpec; } });
Object.defineProperty(exports, "validateSkeletonSpec", { enumerable: true, get: function () { return buildTimeGenerator_1.validateSkeletonSpec; } });
Object.defineProperty(exports, "serializeSkeletonSpec", { enumerable: true, get: function () { return buildTimeGenerator_1.serializeSkeletonSpec; } });
Object.defineProperty(exports, "deserializeSkeletonSpec", { enumerable: true, get: function () { return buildTimeGenerator_1.deserializeSkeletonSpec; } });
Object.defineProperty(exports, "generateMultipleSpecs", { enumerable: true, get: function () { return buildTimeGenerator_1.generateMultipleSpecs; } });
Object.defineProperty(exports, "isServerSide", { enumerable: true, get: function () { return buildTimeGenerator_1.isServerSide; } });
Object.defineProperty(exports, "isClientSide", { enumerable: true, get: function () { return buildTimeGenerator_1.isClientSide; } });
Object.defineProperty(exports, "generateServerSafeSpec", { enumerable: true, get: function () { return buildTimeGenerator_1.generateServerSafeSpec; } });
Object.defineProperty(exports, "loadStaticSpec", { enumerable: true, get: function () { return buildTimeGenerator_1.loadStaticSpec; } });
Object.defineProperty(exports, "hydrateStaticSpec", { enumerable: true, get: function () { return buildTimeGenerator_1.hydrateStaticSpec; } });
Object.defineProperty(exports, "SpecCache", { enumerable: true, get: function () { return buildTimeGenerator_1.SpecCache; } });
Object.defineProperty(exports, "globalSpecCache", { enumerable: true, get: function () { return buildTimeGenerator_1.globalSpecCache; } });
Object.defineProperty(exports, "generateSSRSpec", { enumerable: true, get: function () { return buildTimeGenerator_1.generateSSRSpec; } });
// Enterprise skeleton utilities
var enterpriseSkeletonGenerator_1 = require("./utils/enterpriseSkeletonGenerator");
Object.defineProperty(exports, "skeletonRegistry", { enumerable: true, get: function () { return enterpriseSkeletonGenerator_1.skeletonRegistry; } });
Object.defineProperty(exports, "SKELETON_SPECS", { enumerable: true, get: function () { return enterpriseSkeletonGenerator_1.SKELETON_SPECS; } });
Object.defineProperty(exports, "createSkeletonSpec", { enumerable: true, get: function () { return enterpriseSkeletonGenerator_1.createSkeletonSpec; } });
Object.defineProperty(exports, "getSkeletonSpec", { enumerable: true, get: function () { return enterpriseSkeletonGenerator_1.getSkeletonSpec; } });
Object.defineProperty(exports, "generateComponentSpec", { enumerable: true, get: function () { return enterpriseSkeletonGenerator_1.generateComponentSpec; } });
// Enterprise component utilities
var DynamicSkeletonEnterprise_2 = require("./components/DynamicSkeletonEnterprise");
Object.defineProperty(exports, "useSkeletonSpec", { enumerable: true, get: function () { return DynamicSkeletonEnterprise_2.useSkeletonSpec; } });
Object.defineProperty(exports, "useSkeletonPerformance", { enumerable: true, get: function () { return DynamicSkeletonEnterprise_2.useSkeletonPerformance; } });
Object.defineProperty(exports, "withSkeleton", { enumerable: true, get: function () { return DynamicSkeletonEnterprise_2.withSkeleton; } });
// Export all types
__exportStar(require("./types"), exports);
// Default export
var DynamicSkeletonEnterprise_3 = require("./components/DynamicSkeletonEnterprise");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return DynamicSkeletonEnterprise_3.DynamicSkeleton; } });
//# sourceMappingURL=index.js.map