// Build-time spec generation utilities
// Implements React component shallow rendering with react-test-renderer
// and spec generation from rendered component tree

import React from 'react';
import TestRenderer from 'react-test-renderer';
import { SkeletonSpec, SkeletonPrimitiveSpec, MappingRule, ElementMetadata } from '../types';
import { applyMappingRules, createDefaultRules } from './mappingEngine';

/**
 * Convert ReactTestInstance to ElementMetadata
 */
const convertTestInstanceToElementMetadata = (
  instance: TestRenderer.ReactTestInstance,
  index: number = 0
): ElementMetadata => {
  const tagName = instance.type as string;
  const props = instance.props || {};

  // Extract className from props
  const className = props.className || props.class || '';

  // Extract text content from children
  let textContent = '';
  if (instance.children) {
    textContent = instance.children
      .filter(child => typeof child === 'string')
      .join(' ');
  }

  // Create mock dimensions since we don't have real DOM
  const dimensions = {
    width: 100, // Default width
    height: 20,  // Default height
    x: 0,
    y: index * 25 // Stack elements vertically
  };

  // Adjust dimensions based on element type
  if (tagName === 'img') {
    dimensions.width = 200;
    dimensions.height = 150;
  } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
    dimensions.height = tagName === 'h1' ? 32 : tagName === 'h2' ? 24 : 20;
    dimensions.width = Math.max(100, textContent.length * 8);
  } else if (tagName === 'p') {
    dimensions.height = Math.max(20, Math.ceil(textContent.length / 50) * 20);
    dimensions.width = Math.min(400, Math.max(200, textContent.length * 6));
  } else if (tagName === 'button') {
    dimensions.width = Math.max(80, textContent.length * 8 + 32);
    dimensions.height = 36;
  }

  // Create computed style mock
  const computedStyle = {
    display: tagName === 'span' ? 'inline' : 'block',
    position: 'static',
    fontSize: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)
      ? `${tagName === 'h1' ? 32 : tagName === 'h2' ? 24 : 16}px`
      : '16px'
  };

  // Extract attributes from props
  const attributes: Record<string, string> = {};
  Object.keys(props).forEach(key => {
    if (typeof props[key] === 'string') {
      attributes[key] = props[key];
    }
  });

  return {
    tagName,
    className,
    textContent: textContent.trim(),
    dimensions,
    computedStyle,
    attributes,
    children: [] // Flat structure for simplicity
  };
};

/**
 * Collect all DOM elements from renderer root
 */
const collectAllElements = (root: TestRenderer.ReactTestInstance): ElementMetadata[] => {
  const elements: ElementMetadata[] = [];

  // Find all HTML elements (not React components)
  const htmlTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'button', 'a', 'ul', 'li', 'nav', 'header', 'main', 'article', 'section', 'aside', 'footer'];

  htmlTags.forEach(tag => {
    try {
      const instances = root.findAllByType(tag);
      instances.forEach((instance, index) => {
        const metadata = convertTestInstanceToElementMetadata(instance, elements.length);
        elements.push(metadata);
      });
    } catch (error) {
      // Tag not found, continue
    }
  });

  return elements;
};

/**
 * Generate static skeleton specification from React component
 * Uses react-test-renderer for shallow rendering without DOM
 */
export const generateStaticSpec = async (
  component: React.ComponentType<any>,
  props: any = {},
  mappingRules: MappingRule[] = []
): Promise<SkeletonSpec> => {
  try {
    // Create test renderer instance
    const renderer = TestRenderer.create(React.createElement(component, props));

    // Get the root instance
    const root = renderer.root;

    // Collect all elements from the rendered tree
    const elements = collectAllElements(root);

    // Convert elements to skeleton primitives
    const allRules = mappingRules.length > 0 ? mappingRules : createDefaultRules();
    const children: SkeletonPrimitiveSpec[] = [];

    elements.forEach(element => {
      const primitive = applyMappingRules(element, allRules);

      // Filter out skipped elements
      if (primitive.className !== '__skeleton-skip__') {
        children.push(primitive);
      }
    });

    // Clean up renderer
    renderer.unmount();

    return {
      rootKey: `root-${elements[0]?.tagName || 'component'}`,
      children,
      layout: 'stack',
      gap: '8px'
    };
  } catch (error) {
    throw new Error(`Failed to generate static spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Validate skeleton specification structure
 */
export const validateSkeletonSpec = (spec: SkeletonSpec): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    // Check required properties
    if (!spec || typeof spec !== 'object') {
      errors.push('Skeleton specification is required');
      return { isValid: false, errors };
    }

    if (!Array.isArray(spec.children)) {
      errors.push('Skeleton specification must have a children array');
      return { isValid: false, errors };
    }

    // Empty children array is valid
    if (spec.children.length === 0) {
      return { isValid: true, errors: [] };
    }

    // Track keys to detect duplicates
    const keys = new Set<string>();

    // Validate each child primitive
    for (let i = 0; i < spec.children.length; i++) {
      const child = spec.children[i];

      if (!child.key) {
        errors.push(`Child at index ${i} is missing required 'key' property`);
        continue;
      }

      if (keys.has(child.key)) {
        errors.push(`Duplicate keys found: ${child.key}`);
      } else {
        keys.add(child.key);
      }

      if (!child.shape) {
        errors.push(`Child at index ${i} is missing required 'shape' property`);
        continue;
      }

      if (!['rect', 'circle', 'line'].includes(child.shape)) {
        errors.push(`Child at index ${i} has invalid shape: ${child.shape}`);
      }

      // Validate line-specific properties
      if (child.shape === 'line' && child.lines !== undefined) {
        if (typeof child.lines !== 'number' || child.lines < 1) {
          errors.push(`Child at index ${i} has invalid lines value: ${child.lines}`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { isValid: false, errors };
  }
};

/**
 * Serialize skeleton specification to JSON string
 */
export const serializeSkeletonSpec = (spec: SkeletonSpec): string => {
  try {
    return JSON.stringify(spec, null, 2);
  } catch (error) {
    throw new Error(`Failed to serialize skeleton spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Deserialize skeleton specification from JSON string
 */
export const deserializeSkeletonSpec = (jsonString: string): SkeletonSpec => {
  try {
    const spec = JSON.parse(jsonString);

    const validation = validateSkeletonSpec(spec);
    if (!validation.isValid) {
      throw new Error(`Invalid skeleton specification structure: ${validation.errors.join(', ')}`);
    }

    return spec;
  } catch (error) {
    throw new Error(`Failed to deserialize skeleton spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate multiple specs for different component states/props
 */
export const generateMultipleSpecs = async (
  component: React.ComponentType<any>,
  propVariations: any[],
  mappingRules: MappingRule[] = []
): Promise<SkeletonSpec[]> => {
  const specs: SkeletonSpec[] = [];

  for (const props of propVariations) {
    try {
      const spec = await generateStaticSpec(component, props, mappingRules);
      specs.push(spec);
    } catch (error) {
      console.warn(`Failed to generate spec for props:`, props, error);
    }
  }

  return specs;
};

// SSR Compatibility Layer

/**
 * Detect if we're running in a server-side environment
 */
export const isServerSide = (): boolean => {
  return typeof window === 'undefined' || typeof document === 'undefined';
};

/**
 * Detect if we're running in a browser environment
 */
export const isClientSide = (): boolean => {
  return !isServerSide();
};

/**
 * Server-safe spec generation that falls back to basic specs when DOM APIs are unavailable
 */
export const generateServerSafeSpec = async (
  component: React.ComponentType<any>,
  props: any = {},
  mappingRules: MappingRule[] = [],
  fallbackSpec?: SkeletonSpec
): Promise<SkeletonSpec> => {
  // If we're on the server and have a fallback spec, use it
  if (isServerSide() && fallbackSpec) {
    return fallbackSpec;
  }

  try {
    // Try to generate spec normally
    return await generateStaticSpec(component, props, mappingRules);
  } catch (error) {
    // If generation fails and we have a fallback, use it
    if (fallbackSpec) {
      return fallbackSpec;
    }

    // Otherwise, create a minimal fallback spec
    return {
      rootKey: 'root-fallback',
      children: [
        {
          key: 'fallback-rect',
          shape: 'rect',
          width: '100%',
          height: '20px'
        }
      ],
      layout: 'stack',
      gap: '8px'
    };
  }
};

/**
 * Load static spec from JSON string with validation
 */
export const loadStaticSpec = (specJson: string): SkeletonSpec => {
  try {
    const spec = deserializeSkeletonSpec(specJson);
    return spec;
  } catch (error) {
    throw new Error(`Failed to load static spec: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Hydrate a static spec on the client side
 * This can be used to enhance server-rendered specs with client-side features
 */
export const hydrateStaticSpec = (
  serverSpec: SkeletonSpec,
  enhancements?: Partial<SkeletonSpec>
): SkeletonSpec => {
  return {
    ...serverSpec,
    ...enhancements,
    children: serverSpec.children.map(child => ({
      ...child,
      // Add any client-side enhancements to individual primitives
      ...(enhancements?.children?.find(enhanced => enhanced.key === child.key) || {})
    }))
  };
};

/**
 * Create a spec cache for server-side rendering
 */
export class SpecCache {
  private cache = new Map<string, SkeletonSpec>();

  /**
   * Generate a cache key from component and props
   */
  private generateCacheKey(
    component: React.ComponentType<any>,
    props: any = {}
  ): string {
    const componentName = component.displayName || component.name || 'Anonymous';
    const propsHash = JSON.stringify(props);
    return `${componentName}:${propsHash}`;
  }

  /**
   * Set spec in cache
   */
  set(component: React.ComponentType<any>, props: any = {}, spec: SkeletonSpec): void {
    const key = this.generateCacheKey(component, props);
    this.cache.set(key, spec);
  }

  /**
   * Get spec from cache
   */
  get(component: React.ComponentType<any>, props: any = {}): SkeletonSpec | undefined {
    const key = this.generateCacheKey(component, props);
    return this.cache.get(key);
  }

  /**
   * Check if spec exists in cache
   */
  has(component: React.ComponentType<any>, props: any = {}): boolean {
    const key = this.generateCacheKey(component, props);
    return this.cache.has(key);
  }

  /**
   * Get spec from cache or generate and cache it
   */
  async getOrGenerate(
    component: React.ComponentType<any>,
    props: any = {},
    mappingRules: MappingRule[] = []
  ): Promise<SkeletonSpec> {
    const key = this.generateCacheKey(component, props);

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    try {
      const spec = await generateStaticSpec(component, props, mappingRules);
      this.cache.set(key, spec);
      return spec;
    } catch (error) {
      // Don't cache failed generations
      throw error;
    }
  }

  /**
   * Preload specs for known component/props combinations
   */
  async preload(
    entries: Array<{
      component: React.ComponentType<any>;
      props?: any;
      mappingRules?: MappingRule[];
    }>
  ): Promise<void> {
    const promises = entries.map(({ component, props, mappingRules }) =>
      this.getOrGenerate(component, props, mappingRules).catch(error => {
        console.warn(`Failed to preload spec for ${component.name}:`, error);
      })
    );

    await Promise.all(promises);
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Export cache as JSON for serialization
   */
  export(): string {
    const entries = Array.from(this.cache.entries()).map(([key, spec]) => ({
      key,
      spec
    }));
    return JSON.stringify(entries);
  }

  /**
   * Import cache from JSON
   */
  import(json: string): void {
    try {
      const entries = JSON.parse(json);
      this.cache.clear();

      entries.forEach(({ key, spec }: { key: string; spec: SkeletonSpec }) => {
        const validation = validateSkeletonSpec(spec);
        if (validation.isValid) {
          this.cache.set(key, spec);
        }
      });
    } catch (error) {
      throw new Error(`Failed to import cache: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Global spec cache instance
 */
export const globalSpecCache = new SpecCache();

/**
 * SSR-safe spec generation with caching
 */
export const generateSSRSpec = async (
  component: React.ComponentType<any>,
  props: any = {},
  mappingRules: MappingRule[] = [],
  options: {
    useCache?: boolean;
    fallbackSpec?: SkeletonSpec;
  } = {}
): Promise<SkeletonSpec> => {
  const { useCache = true, fallbackSpec } = options;

  if (useCache) {
    try {
      return await globalSpecCache.getOrGenerate(component, props, mappingRules);
    } catch (error) {
      // Fall back to server-safe generation
      return generateServerSafeSpec(component, props, mappingRules, fallbackSpec);
    }
  }

  return generateServerSafeSpec(component, props, mappingRules, fallbackSpec);
};