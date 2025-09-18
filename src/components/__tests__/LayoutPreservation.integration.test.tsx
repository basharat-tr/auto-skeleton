// Integration tests for layout preservation functionality

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  generateOptimalSkeletonDimensions, 
  createPlaceholderStyles,
  analyzeContainerLayout,
  extractActualDimensions
} from '../../utils/layoutPreservation';
import { ElementMetadata } from '../../types';

// Mock DOM APIs
const mockGetBoundingClientRect = vi.fn();
const mockGetComputedStyle = vi.fn();

// Mock HTMLElement
class MockHTMLElement {
  tagName: string;
  offsetWidth: number;
  offsetHeight: number;
  parentElement: MockHTMLElement | null;
  
  constructor(tagName: string, width = 100, height = 50) {
    this.tagName = tagName.toUpperCase();
    this.offsetWidth = width;
    this.offsetHeight = height;
    this.parentElement = null;
  }
  
  getBoundingClientRect = mockGetBoundingClientRect;
}

beforeEach(() => {
  vi.clearAllMocks();
  
  // Mock window.getComputedStyle
  Object.defineProperty(window, 'getComputedStyle', {
    value: mockGetComputedStyle,
    writable: true
  });
  
  // Default mock implementations
  mockGetBoundingClientRect.mockReturnValue({
    width: 300,
    height: 200,
    x: 0,
    y: 0
  });
  
  mockGetComputedStyle.mockReturnValue({
    width: '300px',
    height: '200px',
    minWidth: '0px',
    minHeight: '0px',
    maxWidth: 'none',
    maxHeight: 'none',
    display: 'block',
    position: 'static',
    fontSize: '16px',
    flexGrow: '0',
    gridColumn: 'auto'
  });
});

describe('Layout Preservation Integration', () => {
  const createMockMetadata = (overrides: Partial<ElementMetadata> = {}): ElementMetadata => ({
    tagName: 'div',
    className: '',
    textContent: '',
    dimensions: { width: 300, height: 200, x: 0, y: 0 },
    computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
    attributes: {},
    children: [],
    ...overrides
  });

  describe('Complete Layout Preservation Workflow', () => {
    it('should preserve layout for a typical component structure', () => {
      // Simulate a card component with header, content, and button
      const cardElement = new MockHTMLElement('div', 400, 300) as unknown as HTMLElement;
      const cardMetadata = createMockMetadata({
        tagName: 'div',
        className: 'card',
        dimensions: { width: 400, height: 300, x: 0, y: 0 }
      });

      mockGetBoundingClientRect.mockReturnValue({
        width: 400,
        height: 300,
        x: 0,
        y: 0
      });

      mockGetComputedStyle.mockReturnValue({
        width: '400px',
        height: '300px',
        minWidth: '0px',
        minHeight: '0px',
        maxWidth: 'none',
        maxHeight: 'none',
        display: 'block',
        position: 'static',
        fontSize: '16px',
        flexGrow: '0',
        gridColumn: 'auto'
      });

      // Generate optimal dimensions with keepSpace enabled
      const dimensions = generateOptimalSkeletonDimensions(cardMetadata, cardElement, {
        keepSpace: true,
        strategy: 'auto'
      });

      // Should preserve the original dimensions
      expect(dimensions.width).toBe(400);
      expect(dimensions.height).toBe(300);
      expect(dimensions.strategy).toBe('preserve');

      // Create placeholder styles
      const styles = createPlaceholderStyles(dimensions, {
        preserveAspectRatio: false,
        useMinDimensions: true
      });

      // Should have layout preservation styles
      expect(styles.boxSizing).toBe('border-box');
      expect(styles.width).toBe(400);
      expect(styles.height).toBe(300);
    });

    it('should handle flexible layouts correctly', () => {
      const flexItemElement = new MockHTMLElement('div', 300, 100) as unknown as HTMLElement;
      const parentElement = new MockHTMLElement('div') as unknown as HTMLElement;
      flexItemElement.parentElement = parentElement;

      const flexItemMetadata = createMockMetadata({
        tagName: 'div',
        className: 'flex-item',
        dimensions: { width: 300, height: 100, x: 0, y: 0 }
      });

      // Mock flex container styles
      mockGetBoundingClientRect.mockReturnValue({
        width: 300,
        height: 100,
        x: 0,
        y: 0
      });

      mockGetComputedStyle
        .mockReturnValueOnce({
          width: '300px',
          height: '100px',
          minWidth: '0px',
          minHeight: '0px',
          maxWidth: 'none',
          maxHeight: 'none',
          display: 'block',
          position: 'static',
          fontSize: '16px',
          flexGrow: '1',
          gridColumn: 'auto'
        })
        .mockReturnValueOnce({
          display: 'flex'
        });

      // Generate dimensions for flex item
      const dimensions = generateOptimalSkeletonDimensions(flexItemMetadata, flexItemElement, {
        keepSpace: true,
        strategy: 'flexible'  // Explicitly set strategy
      });

      // Should use flexible strategy
      expect(dimensions.width).toBe('100%');
      expect(dimensions.height).toBe(100);
      expect(dimensions.strategy).toBe('flexible');

      // Create styles for flexible layout
      const styles = createPlaceholderStyles(dimensions, {
        flexibleWidth: true,
        flexibleHeight: true,
        useMinDimensions: true
      });

      expect(styles.width).toBe('100%');
      expect(styles.height).toBe('auto');
      expect(styles.boxSizing).toBe('border-box');
    });

    it('should handle absolute positioning correctly', () => {
      const absoluteElement = new MockHTMLElement('div', 200, 150) as unknown as HTMLElement;
      const parentElement = new MockHTMLElement('div') as unknown as HTMLElement;
      absoluteElement.parentElement = parentElement;

      const absoluteMetadata = createMockMetadata({
        tagName: 'div',
        className: 'absolute-positioned',
        dimensions: { width: 200, height: 150, x: 50, y: 100 }
      });

      // Mock absolute positioning styles
      mockGetBoundingClientRect.mockReturnValue({
        width: 200,
        height: 150,
        x: 50,
        y: 100
      });

      mockGetComputedStyle
        .mockReturnValueOnce({
          width: '200px',
          height: '150px',
          minWidth: '0px',
          minHeight: '0px',
          maxWidth: 'none',
          maxHeight: 'none',
          display: 'block',
          position: 'absolute',
          fontSize: '16px',
          flexGrow: '0',
          gridColumn: 'auto'
        })
        .mockReturnValueOnce({
          display: 'block'
        });

      // Generate dimensions for absolute element
      const dimensions = generateOptimalSkeletonDimensions(absoluteMetadata, absoluteElement, {
        keepSpace: true,
        strategy: 'preserve'  // Explicitly set strategy
      });

      // Should preserve exact dimensions
      expect(dimensions.width).toBe(200);
      expect(dimensions.height).toBe(150);
      expect(dimensions.strategy).toBe('preserve');

      // Create styles that preserve positioning
      const styles = createPlaceholderStyles(dimensions);

      expect(styles.width).toBe(200);
      expect(styles.height).toBe(150);
      expect(styles.boxSizing).toBe('border-box');
    });

    it('should provide fallbacks when dimensions are unknown', () => {
      const unknownElement = new MockHTMLElement('button', 0, 0) as unknown as HTMLElement;
      const buttonMetadata = createMockMetadata({
        tagName: 'button',
        dimensions: { width: 0, height: 0, x: 0, y: 0 }
      });

      // Mock zero dimensions
      mockGetBoundingClientRect.mockReturnValueOnce({
        width: 0,
        height: 0,
        x: 0,
        y: 0
      });

      mockGetComputedStyle.mockReturnValueOnce({
        width: 'auto',
        height: 'auto',
        minWidth: '0px',
        minHeight: '0px',
        maxWidth: 'none',
        maxHeight: 'none',
        display: 'block',
        position: 'static',
        fontSize: '16px',
        flexGrow: '0',
        gridColumn: 'auto'
      });

      // Generate dimensions with fallbacks
      const dimensions = generateOptimalSkeletonDimensions(buttonMetadata, unknownElement, {
        keepSpace: true
      });

      // Should use fallback dimensions for button when no actual dimensions available
      expect(dimensions.width).toBe('6rem'); // Fallback for button
      expect(dimensions.height).toBe('2.5rem'); // Fallback for button
      expect(dimensions.strategy).toBe('preserve');

      // Create styles with fallbacks
      const styles = createPlaceholderStyles(dimensions);

      expect(styles.width).toBe('6rem');
      expect(styles.height).toBe('2.5rem');
    });

    it('should handle text content sizing correctly', () => {
      const textElement = new MockHTMLElement('p', 0, 0) as unknown as HTMLElement;
      const textMetadata = createMockMetadata({
        tagName: 'p',
        textContent: 'This is a sample paragraph with some text content',
        computedStyle: { display: 'block', position: 'static', fontSize: '18px' },
        dimensions: { width: 0, height: 0, x: 0, y: 0 }
      });

      // Mock zero dimensions to trigger content-based calculation
      mockGetBoundingClientRect.mockReturnValue({
        width: 0,
        height: 0,
        x: 0,
        y: 0
      });

      // Generate dimensions based on text content
      const dimensions = generateOptimalSkeletonDimensions(textMetadata, textElement, {
        keepSpace: false // Use content-based sizing
      });

      // Should calculate dimensions based on text length and font size
      expect(typeof dimensions.width).toBe('number');
      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBe(18 * 1.4); // fontSize * line height
      expect(dimensions.strategy).toBe('content-based');
    });

    it('should analyze container layout correctly', () => {
      const element = new MockHTMLElement('div') as unknown as HTMLElement;
      const parent = new MockHTMLElement('div') as unknown as HTMLElement;
      element.parentElement = parent;

      // Test flex container
      mockGetComputedStyle
        .mockReturnValueOnce({
          display: 'block',
          position: 'static',
          width: 'auto',
          height: 'auto',
          flexGrow: '1',
          gridColumn: 'auto'
        })
        .mockReturnValueOnce({
          display: 'flex'
        });

      const flexAnalysis = analyzeContainerLayout(element);
      expect(flexAnalysis.containerType).toBe('flex');
      expect(flexAnalysis.isFlexible).toBe(true);
      expect(flexAnalysis.recommendedStrategy).toBe('flexible');

      // Test absolute positioning
      mockGetComputedStyle
        .mockReturnValueOnce({
          display: 'block',
          position: 'absolute',
          width: '200px',
          height: '100px',
          flexGrow: '0',
          gridColumn: 'auto'
        })
        .mockReturnValueOnce({
          display: 'block'
        });

      const absoluteAnalysis = analyzeContainerLayout(element);
      expect(absoluteAnalysis.containerType).toBe('absolute');
      expect(absoluteAnalysis.hasFixedDimensions).toBe(true);
      expect(absoluteAnalysis.recommendedStrategy).toBe('preserve');
    });

    it('should handle error conditions gracefully', () => {
      const element = new MockHTMLElement('div') as unknown as HTMLElement;
      const metadata = createMockMetadata();

      // Test with failing getBoundingClientRect
      mockGetBoundingClientRect.mockImplementation(() => {
        throw new Error('getBoundingClientRect failed');
      });

      const dimensions = extractActualDimensions(element);

      // Should fallback to default dimensions
      expect(dimensions.width).toBe('100%');
      expect(dimensions.height).toBe('2rem');

      // Test with failing getComputedStyle
      mockGetComputedStyle.mockImplementation(() => {
        throw new Error('getComputedStyle failed');
      });

      const analysis = analyzeContainerLayout(element);

      // Should return safe defaults
      expect(analysis.containerType).toBe('unknown');
      expect(analysis.isFlexible).toBe(false);
      expect(analysis.hasFixedDimensions).toBe(false);
      expect(analysis.recommendedStrategy).toBe('preserve');
    });
  });

  describe('Layout Shift Prevention', () => {
    it('should create styles that prevent layout shifts', () => {
      const dimensions = {
        width: 400,
        height: 300,
        minWidth: '200px',
        minHeight: '150px'
      };

      const styles = createPlaceholderStyles(dimensions, {
        useMinDimensions: true,
        preserveAspectRatio: true
      });

      // Should have all necessary properties to prevent layout shifts
      expect(styles.boxSizing).toBe('border-box');
      expect(styles.width).toBe(400);
      expect(styles.height).toBe(300);
      expect(styles.minWidth).toBe('200px');
      expect(styles.minHeight).toBe('150px');
      expect(styles.aspectRatio).toBe('1.3333333333333333'); // 400/300
    });

    it('should handle responsive scenarios', () => {
      const dimensions = {
        width: '100%',
        height: 200,
        minHeight: '150px'
      };

      const styles = createPlaceholderStyles(dimensions, {
        flexibleWidth: true,
        flexibleHeight: true,
        useMinDimensions: true
      });

      // Should create responsive-friendly styles
      expect(styles.width).toBe('100%');
      expect(styles.height).toBe('auto');
      expect(styles.minHeight).toBe('150px');
      expect(styles.boxSizing).toBe('border-box');
    });
  });
});