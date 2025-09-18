// Core type definitions for Dynamic Skeleton Loader

import React from 'react';

// Core primitive shapes
export type SkeletonShape = 'rect' | 'circle' | 'line';

// Individual skeleton element specification
export interface SkeletonPrimitiveSpec {
  key: string;
  shape: SkeletonShape;
  width?: number | string;
  height?: number | string;
  borderRadius?: string;
  lines?: number; // for line shape only
  style?: React.CSSProperties;
  className?: string;
}

// Complete skeleton specification
export interface SkeletonSpec {
  rootKey?: string;
  children: SkeletonPrimitiveSpec[];
  layout?: 'stack' | 'grid' | 'row';
  gap?: number | string;
}

// Mapping rule for element conversion
export interface MappingRule {
  match: {
    tag?: string;
    classContains?: string;
    role?: string;
    attr?: Record<string, string>;
  };
  to: {
    shape: SkeletonShape;
    size?: { w?: string; h?: string };
    lines?: number;
    radius?: string;
  };
  priority: number;
}

// Main component props
export interface DynamicSkeletonProps {
  forRef?: React.RefObject<HTMLElement>;
  renderSpec?: SkeletonSpec;
  mappingRules?: MappingRule[];
  animation?: 'pulse' | 'wave' | 'none';
  theme?: ThemePreset | CustomTheme;
  className?: string;
  style?: React.CSSProperties;
  keepSpace?: boolean;
  ariaLabel?: string;
}

// Supporting interfaces for DOM scanning
export interface ElementMetadata {
  tagName: string;
  className: string;
  textContent: string;
  dimensions: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  computedStyle: {
    display: string;
    position: string;
    fontSize: string;
  };
  attributes: Record<string, string>;
  children: ElementMetadata[];
}

export interface DimensionInfo {
  width: number;
  height: number;
  x: number;
  y: number;
}

// Theme configuration
export interface SkeletonTheme {
  baseColor: string;
  highlightColor: string;
  animationDuration: string;
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    circle: string;
  };
}

// Animation types
export type AnimationType = 'pulse' | 'wave' | 'shimmer' | 'none';

// Animation duration presets
export type AnimationDuration = 'slow' | 'normal' | 'fast' | string;

// Theme presets
export type ThemePreset = 'light' | 'dark';

export interface CustomTheme {
  baseColor: string;
  highlight: string;
  animationDuration?: string;
  borderRadius?: string;
}

export type ThemeConfig = ThemePreset | CustomTheme;

// Tailwind color presets for skeleton theming
export type TailwindColorPreset =
  | 'gray-200' | 'gray-300' | 'gray-700' | 'gray-800'
  | 'slate-200' | 'slate-300' | 'slate-700'
  | 'zinc-200' | 'zinc-700'
  | 'neutral-200';

// Enhanced theme configuration with Tailwind support
export interface EnhancedThemeConfig {
  preset?: ThemePreset;
  tailwindColor?: TailwindColorPreset;
  custom?: CustomTheme;
  animationDuration?: AnimationDuration;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
}