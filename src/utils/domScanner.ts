// DOM scanner utilities for extracting element metadata and building skeleton specifications

import { ElementMetadata, DimensionInfo } from '../types';

/**
 * Safely extracts bounding rectangle information from an element
 * Includes error handling for SSR and edge cases
 */
export const getBoundingInfo = (element: HTMLElement): DimensionInfo => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // SSR fallback - return zero dimensions
      return { width: 0, height: 0, x: 0, y: 0 };
    }

    // Get bounding rectangle with error handling
    const rect = element.getBoundingClientRect();

    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      x: Math.round(rect.x),
      y: Math.round(rect.y)
    };
  } catch (error) {
    // Fallback for any getBoundingClientRect errors
    console.warn('Failed to get bounding info for element:', error);
    return { width: 0, height: 0, x: 0, y: 0 };
  }
};

/**
 * Safely extracts computed style properties with SSR fallbacks
 */
const getComputedStyleSafe = (element: HTMLElement) => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.getComputedStyle) {
      // SSR fallback - return default values
      return {
        display: 'block',
        position: 'static',
        fontSize: '16px'
      };
    }

    const computed = window.getComputedStyle(element);

    return {
      display: computed.display || 'block',
      position: computed.position || 'static',
      fontSize: computed.fontSize || '16px'
    };
  } catch (error) {
    // Fallback for any getComputedStyle errors
    console.warn('Failed to get computed style for element:', error);
    return {
      display: 'block',
      position: 'static',
      fontSize: '16px'
    };
  }
};

/**
 * Extracts all attributes from an element as a key-value record
 */
const extractAttributes = (element: HTMLElement): Record<string, string> => {
  const attributes: Record<string, string> = {};

  try {
    // Use attributes property to get all attributes
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributes[attr.name] = attr.value;
    }
  } catch (error) {
    console.warn('Failed to extract attributes from element:', error);
  }

  return attributes;
};

/**
 * Safely extracts text content from an element
 */
const extractTextContent = (element: HTMLElement): string => {
  try {
    // Use textContent for better performance and security
    return (element.textContent || '').trim();
  } catch (error) {
    console.warn('Failed to extract text content from element:', error);
    return '';
  }
};

/**
 * Extracts comprehensive metadata from a DOM element
 * Includes tagName, className, textContent, dimensions, computed styles, and attributes
 */
export const scanElement = (element: HTMLElement): ElementMetadata => {
  try {
    // Extract basic element properties
    const tagName = element.tagName.toLowerCase();
    const className = element.className || '';
    const textContent = extractTextContent(element);

    // Get dimensions and positioning
    const dimensions = getBoundingInfo(element);

    // Get computed styles with fallbacks
    const computedStyle = getComputedStyleSafe(element);

    // Extract all attributes
    const attributes = extractAttributes(element);

    return {
      tagName,
      className,
      textContent,
      dimensions,
      computedStyle,
      attributes,
      children: [] // Will be populated by tree traversal in task 2.2
    };
  } catch (error) {
    console.warn('Failed to scan element:', error);

    // Return minimal fallback metadata
    return {
      tagName: element.tagName?.toLowerCase() || 'div',
      className: '',
      textContent: '',
      dimensions: { width: 0, height: 0, x: 0, y: 0 },
      computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
      attributes: {},
      children: []
    };
  }
};

/**
 * Performance tracking for DOM traversal
 */
interface TraversalState {
  nodeCount: number;
  startTime: number;
  maxNodes: number;
  maxTime: number;
}

/**
 * Checks if an element should be skipped during traversal
 * Elements with zero dimensions are skipped for performance
 */
const shouldSkipElement = (element: HTMLElement): boolean => {
  try {
    const dimensions = getBoundingInfo(element);
    // Skip elements with zero width and height
    return dimensions.width === 0 && dimensions.height === 0;
  } catch (error) {
    // If we can't get dimensions, don't skip (safer approach)
    return false;
  }
};

/**
 * Recursively traverses DOM tree and builds element metadata array
 * Implements performance limits: 200 node limit and 50ms timeout
 */
const traverseElementTree = (
  element: HTMLElement,
  state: TraversalState,
  currentDepth: number = 0,
  maxDepth: number = 10
): ElementMetadata | null => {
  // Check performance limits
  const currentTime = Date.now();
  const elapsedTime = currentTime - state.startTime;

  // Stop if we've exceeded time limit (50ms)
  if (elapsedTime > state.maxTime) {
    console.warn(`DOM traversal stopped: exceeded ${state.maxTime}ms time limit`);
    return null;
  }

  // Stop if we've exceeded node count limit (200 nodes)
  if (state.nodeCount >= state.maxNodes) {
    console.warn(`DOM traversal stopped: exceeded ${state.maxNodes} node limit`);
    return null;
  }

  // Stop if we've exceeded depth limit
  if (currentDepth > maxDepth) {
    return null;
  }

  // Skip elements with zero dimensions
  if (shouldSkipElement(element)) {
    return null;
  }

  // Increment node count
  state.nodeCount++;

  // Scan current element
  const elementMetadata = scanElement(element);

  // Process children if we haven't hit limits
  const children: ElementMetadata[] = [];

  try {
    // Only process children if we have capacity
    if (state.nodeCount < state.maxNodes && (Date.now() - state.startTime) < state.maxTime) {
      const childElements = Array.from(element.children) as HTMLElement[];

      for (const child of childElements) {
        // Check limits before processing each child
        if (state.nodeCount >= state.maxNodes || (Date.now() - state.startTime) >= state.maxTime) {
          break;
        }

        const childMetadata = traverseElementTree(child, state, currentDepth + 1, maxDepth);
        if (childMetadata) {
          children.push(childMetadata);
        }
      }
    }
  } catch (error) {
    console.warn('Error processing child elements:', error);
  }

  // Update children in metadata
  elementMetadata.children = children;

  return elementMetadata;
};

/**
 * Builds element tree from root with performance limits
 * Implements 200 node limit and 50ms timeout mechanism
 * Skips elements with zero dimensions
 */
export const buildElementTree = (root: HTMLElement, maxDepth: number = 10): ElementMetadata[] => {
  try {
    // Initialize performance tracking state
    const state: TraversalState = {
      nodeCount: 0,
      startTime: Date.now(),
      maxNodes: 200,
      maxTime: 50 // 50ms timeout
    };

    // Start traversal from root
    const rootMetadata = traverseElementTree(root, state, 0, maxDepth);

    // Log performance metrics for debugging
    const elapsedTime = Date.now() - state.startTime;
    console.debug(`DOM traversal completed: ${state.nodeCount} nodes in ${elapsedTime}ms`);

    // Return array with root element (or empty array if root was skipped)
    return rootMetadata ? [rootMetadata] : [];

  } catch (error) {
    console.warn('Failed to build element tree:', error);
    return [];
  }
};