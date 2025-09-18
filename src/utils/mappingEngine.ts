// Placeholder for mapping engine utilities
// Will be implemented in task 3.1 and 3.2

import { MappingRule, ElementMetadata, SkeletonPrimitiveSpec, SkeletonShape } from '../types';

/**
 * Calculate the number of lines for text content based on text length and container width
 */
export const calculateTextLines = (
  textContent: string,
  containerWidth: number,
  fontSize: string = '16px'
): number => {
  if (!textContent || textContent.trim().length === 0) {
    return 1;
  }

  // Parse font size to get approximate character width
  const fontSizeNum = parseInt(fontSize.replace('px', '')) || 16;
  const avgCharWidth = fontSizeNum * 0.6; // Approximate character width

  // Calculate characters per line based on container width
  const charsPerLine = Math.floor(containerWidth / avgCharWidth);

  if (charsPerLine <= 0) {
    return 1;
  }

  // Calculate number of lines needed
  const textLength = textContent.trim().length;
  const lines = Math.ceil(textLength / charsPerLine);

  // Cap at reasonable maximum
  return Math.min(lines, 10);
};

/**
 * Parse data-skeleton attribute to extract skeleton configuration
 */
export const parseDataSkeletonAttribute = (dataSkeletonValue: string): Partial<SkeletonPrimitiveSpec> | null => {
  if (!dataSkeletonValue || dataSkeletonValue.trim() === '') {
    return null;
  }

  // Handle skip directive
  if (dataSkeletonValue.trim() === 'skip') {
    return null;
  }

  try {
    // Try to parse as JSON for complex configurations
    if (dataSkeletonValue.startsWith('{')) {
      const parsed = JSON.parse(dataSkeletonValue);
      return {
        shape: parsed.shape || 'rect',
        width: parsed.width,
        height: parsed.height,
        borderRadius: parsed.borderRadius || parsed.radius,
        lines: parsed.lines,
        style: parsed.style,
        className: parsed.className
      };
    }

    // Handle simple shape specifications
    const trimmed = dataSkeletonValue.trim().toLowerCase();
    if (['rect', 'circle', 'line'].includes(trimmed)) {
      return { shape: trimmed as SkeletonShape };
    }

    // Handle shape with size (e.g., "circle:40px" or "rect:100x50")
    const [shape, sizeStr] = trimmed.split(':');
    if (['rect', 'circle', 'line'].includes(shape) && sizeStr) {
      const result: Partial<SkeletonPrimitiveSpec> = { shape: shape as SkeletonShape };

      if (shape === 'circle' && sizeStr) {
        result.width = sizeStr;
        result.height = sizeStr;
      } else if (/^\d+x\d+/.test(sizeStr)) {
        // Match format like "100x50" (numbers separated by x)
        const [width, height] = sizeStr.split('x');
        result.width = width;
        result.height = height;
      } else {
        result.width = sizeStr;
      }

      return result;
    }

    return null;
  } catch (error) {
    console.warn('Failed to parse data-skeleton attribute:', dataSkeletonValue, error);
    return null;
  }
};

/**
 * Check if an element matches a mapping rule
 */
export const doesElementMatchRule = (element: ElementMetadata, rule: MappingRule): boolean => {
  const { match } = rule;

  // Check tag match - add null/undefined checks
  if (match.tag && element.tagName && element.tagName.toLowerCase() !== match.tag.toLowerCase()) {
    return false;
  }

  // Check class contains match - add null/undefined checks
  if (match.classContains && element.className && !element.className.toLowerCase().includes(match.classContains.toLowerCase())) {
    return false;
  }

  // Check role match
  if (match.role && element.attributes && element.attributes.role !== match.role) {
    return false;
  }

  // Check attribute matches
  if (match.attr && element.attributes) {
    for (const [attrName, attrValue] of Object.entries(match.attr)) {
      if (element.attributes[attrName] !== attrValue) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Validate and merge custom rules with default rules
 */
export const validateAndMergeRules = (customRules: MappingRule[] = []): MappingRule[] => {
  const defaultRules = createDefaultRules();

  // Validate custom rules
  const validCustomRules = customRules.filter(rule => {
    // Basic validation
    if (!rule.match || !rule.to || typeof rule.priority !== 'number') {
      console.warn('Invalid mapping rule - missing required properties:', rule);
      return false;
    }

    // Validate shape
    if (!['rect', 'circle', 'line'].includes(rule.to.shape)) {
      console.warn('Invalid mapping rule - invalid shape:', rule.to.shape);
      return false;
    }

    return true;
  });

  // Merge and sort by priority (highest first)
  const allRules = [...validCustomRules, ...defaultRules];
  return allRules.sort((a, b) => b.priority - a.priority);
};

/**
 * Apply mapping rules to convert an element to a skeleton primitive
 */
export const applyMappingRules = (
  element: ElementMetadata,
  rules: MappingRule[] = []
): SkeletonPrimitiveSpec => {
  // Generate unique key for the element
  const key = `${element.tagName}-${element.className || 'no-class'}-${Math.random().toString(36).substr(2, 9)}`;

  // Check for data-skeleton attribute override first
  const dataSkeletonValue = element.attributes['data-skeleton'];
  if (dataSkeletonValue) {
    if (dataSkeletonValue.trim() === 'skip') {
      // Return a special marker that can be filtered out later
      return {
        key,
        shape: 'rect',
        width: 0,
        height: 0,
        className: '__skeleton-skip__'
      };
    }

    const override = parseDataSkeletonAttribute(dataSkeletonValue);
    if (override) {
      return {
        key,
        shape: override.shape || 'rect',
        width: override.width || element.dimensions.width || 'auto',
        height: override.height || element.dimensions.height || 'auto',
        borderRadius: override.borderRadius,
        lines: override.lines,
        style: override.style,
        className: override.className
      };
    }
  }

  // Merge custom rules with defaults and sort by priority
  const sortedRules = validateAndMergeRules(rules);

  // Find the first matching rule
  const matchingRule = sortedRules.find(rule => doesElementMatchRule(element, rule));

  if (matchingRule) {
    const { to } = matchingRule;
    const result: SkeletonPrimitiveSpec = {
      key,
      shape: to.shape,
      width: to.size?.w || element.dimensions.width || 'auto',
      height: to.size?.h || element.dimensions.height || 'auto'
    };

    // Add optional properties
    if (to.radius) {
      result.borderRadius = to.radius;
    }

    if (to.lines) {
      result.lines = to.lines;
    } else if (to.shape === 'line' && element.tagName === 'p') {
      // Calculate lines for paragraph elements
      result.lines = calculateTextLines(
        element.textContent,
        element.dimensions.width,
        element.computedStyle.fontSize
      );
    }

    return result;
  }

  // Fallback to generic rectangle if no rules match
  return {
    key,
    shape: 'rect',
    width: element.dimensions.width || 'auto',
    height: element.dimensions.height || 'auto'
  };
};

export const createDefaultRules = (): MappingRule[] => {
  return [
    // img.avatar → circle (highest priority for specific case)
    {
      match: {
        tag: 'img',
        classContains: 'avatar'
      },
      to: {
        shape: 'circle',
        size: { w: '40px', h: '40px' }
      },
      priority: 100
    },

    // Button elements → rounded rectangle
    {
      match: {
        tag: 'button'
      },
      to: {
        shape: 'rect',
        radius: '6px'
      },
      priority: 80
    },

    // Elements with btn class → rounded rectangle
    {
      match: {
        classContains: 'btn'
      },
      to: {
        shape: 'rect',
        radius: '6px'
      },
      priority: 75
    },

    // Heading elements (h1-h6) → single line
    {
      match: {
        tag: 'h1'
      },
      to: {
        shape: 'line',
        lines: 1,
        size: { h: '2rem' }
      },
      priority: 70
    },
    {
      match: {
        tag: 'h2'
      },
      to: {
        shape: 'line',
        lines: 1,
        size: { h: '1.5rem' }
      },
      priority: 70
    },
    {
      match: {
        tag: 'h3'
      },
      to: {
        shape: 'line',
        lines: 1,
        size: { h: '1.25rem' }
      },
      priority: 70
    },
    {
      match: {
        tag: 'h4'
      },
      to: {
        shape: 'line',
        lines: 1,
        size: { h: '1.125rem' }
      },
      priority: 70
    },
    {
      match: {
        tag: 'h5'
      },
      to: {
        shape: 'line',
        lines: 1,
        size: { h: '1rem' }
      },
      priority: 70
    },
    {
      match: {
        tag: 'h6'
      },
      to: {
        shape: 'line',
        lines: 1,
        size: { h: '0.875rem' }
      },
      priority: 70
    },

    // Paragraph elements → multi-line (calculated based on text length)
    {
      match: {
        tag: 'p'
      },
      to: {
        shape: 'line',
        lines: 3, // Default, will be calculated based on text length
        size: { h: '1rem' }
      },
      priority: 60
    },

    // SVG elements → rectangle
    {
      match: {
        tag: 'svg'
      },
      to: {
        shape: 'rect'
      },
      priority: 50
    },

    // Media elements → rectangle
    {
      match: {
        tag: 'img'
      },
      to: {
        shape: 'rect'
      },
      priority: 40
    },
    {
      match: {
        tag: 'video'
      },
      to: {
        shape: 'rect'
      },
      priority: 40
    },
    {
      match: {
        tag: 'audio'
      },
      to: {
        shape: 'rect',
        size: { h: '40px' }
      },
      priority: 40
    },

    // Small inline elements with tag/badge classes → small rectangle
    {
      match: {
        classContains: 'tag'
      },
      to: {
        shape: 'rect',
        size: { h: '24px' },
        radius: '12px'
      },
      priority: 65
    },
    {
      match: {
        classContains: 'badge'
      },
      to: {
        shape: 'rect',
        size: { h: '20px' },
        radius: '10px'
      },
      priority: 65
    }
  ];
};