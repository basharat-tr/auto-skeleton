// Tests for layout preservation utilities

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    extractActualDimensions,
    getFallbackDimensions,
    calculateContentBasedDimensions,
    createPlaceholderStyles,
    analyzeContainerLayout,
    generateOptimalSkeletonDimensions,
    FALLBACK_DIMENSIONS
} from '../layoutPreservation';
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

// Setup global mocks
beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
        value: mockGetComputedStyle,
        writable: true
    });

    // Default mock implementations
    mockGetBoundingClientRect.mockReturnValue({
        width: 100,
        height: 50,
        x: 0,
        y: 0
    });

    mockGetComputedStyle.mockReturnValue({
        width: '100px',
        height: '50px',
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

describe('FALLBACK_DIMENSIONS', () => {
    it('should provide fallback dimensions for common elements', () => {
        expect(FALLBACK_DIMENSIONS.h1).toEqual({ width: '80%', height: '2rem' });
        expect(FALLBACK_DIMENSIONS.button).toEqual({ width: '6rem', height: '2.5rem' });
        expect(FALLBACK_DIMENSIONS.img).toEqual({ width: '8rem', height: '6rem' });
        expect(FALLBACK_DIMENSIONS.default).toEqual({ width: '8rem', height: '2rem' });
    });
});

describe('extractActualDimensions', () => {
    it('should extract dimensions from element with valid rect', () => {
        const element = new MockHTMLElement('div', 200, 100) as unknown as HTMLElement;

        mockGetBoundingClientRect.mockReturnValue({
            width: 200,
            height: 100,
            x: 10,
            y: 20
        });

        mockGetComputedStyle.mockReturnValue({
            width: '200px',
            height: '100px',
            minWidth: '50px',
            minHeight: '25px',
            maxWidth: '400px',
            maxHeight: '200px'
        });

        const result = extractActualDimensions(element);

        expect(result).toEqual({
            width: 200,
            height: 100,
            minWidth: '50px',
            minHeight: '25px',
            maxWidth: '400px',
            maxHeight: '200px'
        });
    });

    it('should use CSS dimensions when rect is zero', () => {
        const element = new MockHTMLElement('div') as unknown as HTMLElement;

        mockGetBoundingClientRect.mockReturnValue({
            width: 0,
            height: 0,
            x: 0,
            y: 0
        });

        mockGetComputedStyle.mockReturnValue({
            width: '150px',
            height: '75px',
            minWidth: '0px',
            minHeight: '0px',
            maxWidth: 'none',
            maxHeight: 'none'
        });

        const result = extractActualDimensions(element);

        expect(result).toEqual({
            width: '150px',
            height: '75px'
        });
    });

    it('should use fallback dimensions when both rect and CSS fail', () => {
        const element = new MockHTMLElement('button') as unknown as HTMLElement;

        mockGetBoundingClientRect.mockReturnValue({
            width: 0,
            height: 0,
            x: 0,
            y: 0
        });

        mockGetComputedStyle.mockReturnValue({
            width: 'auto',
            height: 'auto',
            minWidth: '0px',
            minHeight: '0px',
            maxWidth: 'none',
            maxHeight: 'none'
        });

        const result = extractActualDimensions(element);

        expect(result).toEqual({
            width: '6rem',
            height: '2.5rem'
        });
    });

    it('should handle errors gracefully', () => {
        const element = new MockHTMLElement('div') as unknown as HTMLElement;

        mockGetBoundingClientRect.mockImplementation(() => {
            throw new Error('getBoundingClientRect failed');
        });

        const result = extractActualDimensions(element);

        expect(result).toEqual({
            width: '100%',
            height: '2rem'
        });
    });
});

describe('getFallbackDimensions', () => {
    it('should return specific dimensions for known elements', () => {
        expect(getFallbackDimensions('h1')).toEqual({ width: '80%', height: '2rem' });
        expect(getFallbackDimensions('button')).toEqual({ width: '6rem', height: '2.5rem' });
        expect(getFallbackDimensions('img')).toEqual({ width: '8rem', height: '6rem' });
    });

    it('should return default dimensions for unknown elements', () => {
        expect(getFallbackDimensions('custom-element')).toEqual({ width: '8rem', height: '2rem' });
        expect(getFallbackDimensions('')).toEqual({ width: '8rem', height: '2rem' });
    });
});

describe('calculateContentBasedDimensions', () => {
    const createMockMetadata = (overrides: Partial<ElementMetadata> = {}): ElementMetadata => ({
        tagName: 'div',
        className: '',
        textContent: '',
        dimensions: { width: 0, height: 0, x: 0, y: 0 },
        computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
        attributes: {},
        children: [],
        ...overrides
    });

    it('should use actual dimensions when available', () => {
        const metadata = createMockMetadata({
            dimensions: { width: 300, height: 150, x: 0, y: 0 }
        });

        const result = calculateContentBasedDimensions(metadata);

        expect(result).toEqual({
            width: 300,
            height: 150
        });
    });

    it('should calculate dimensions based on text content for text elements', () => {
        const metadata = createMockMetadata({
            tagName: 'p',
            textContent: 'Hello world this is a test',
            computedStyle: { display: 'block', position: 'static', fontSize: '18px' }
        });

        const result = calculateContentBasedDimensions(metadata);

        // Should calculate based on text length and font size
        expect(result.width).toBeGreaterThan(0);
        expect(result.height).toBe(18 * 1.4); // fontSize * line height
    });

    it('should cap text width at maximum', () => {
        const metadata = createMockMetadata({
            tagName: 'p',
            textContent: 'A'.repeat(200), // Very long text
            computedStyle: { display: 'block', position: 'static', fontSize: '16px' }
        });

        const result = calculateContentBasedDimensions(metadata);

        expect(result.width).toBe(600); // Should be capped at 600px
    });

    it('should use fallback dimensions for non-text elements', () => {
        const metadata = createMockMetadata({
            tagName: 'button'
        });

        const result = calculateContentBasedDimensions(metadata);

        expect(result).toEqual({
            width: '6rem',
            height: '2.5rem'
        });
    });
});

describe('createPlaceholderStyles', () => {
    it('should create basic placeholder styles', () => {
        const dimensions = { width: 200, height: 100 };

        const result = createPlaceholderStyles(dimensions);

        expect(result).toEqual({
            boxSizing: 'border-box',
            width: 200,
            height: 100
        });
    });

    it('should add min dimensions when requested', () => {
        const dimensions = {
            width: 200,
            height: 100,
            minWidth: '150px',
            minHeight: '75px',
            maxWidth: '300px',
            maxHeight: '150px'
        };

        const result = createPlaceholderStyles(dimensions, { useMinDimensions: true });

        expect(result).toEqual({
            boxSizing: 'border-box',
            width: 200,
            height: 100,
            minWidth: '150px',
            minHeight: '75px',
            maxWidth: '300px',
            maxHeight: '150px'
        });
    });

    it('should handle flexible width and height', () => {
        const dimensions = { width: 200, height: 100 };

        const result = createPlaceholderStyles(dimensions, {
            flexibleWidth: true,
            flexibleHeight: true
        });

        expect(result).toEqual({
            boxSizing: 'border-box',
            width: '100%',
            height: 'auto'
        });
    });

    it('should preserve aspect ratio when requested', () => {
        const dimensions = { width: 200, height: 100 };

        const result = createPlaceholderStyles(dimensions, { preserveAspectRatio: true });

        expect(result).toEqual({
            boxSizing: 'border-box',
            width: 200,
            height: 100,
            aspectRatio: '2'
        });
    });
});

describe('analyzeContainerLayout', () => {
    it('should detect flex container', () => {
        const element = new MockHTMLElement('div') as unknown as HTMLElement;
        const parent = new MockHTMLElement('div') as unknown as HTMLElement;
        element.parentElement = parent;

        mockGetComputedStyle
            .mockReturnValueOnce({
                display: 'block',
                position: 'static',
                width: 'auto',
                height: 'auto',
                flexGrow: '1'
            })
            .mockReturnValueOnce({
                display: 'flex'
            });

        const result = analyzeContainerLayout(element);

        expect(result.containerType).toBe('flex');
        expect(result.isFlexible).toBe(true);
        expect(result.recommendedStrategy).toBe('flexible');
    });

    it('should detect grid container', () => {
        const element = new MockHTMLElement('div') as unknown as HTMLElement;
        const parent = new MockHTMLElement('div') as unknown as HTMLElement;
        element.parentElement = parent;

        mockGetComputedStyle
            .mockReturnValueOnce({
                display: 'block',
                position: 'static',
                width: '200px',
                height: '100px',
                flexGrow: '0',
                gridColumn: '1fr'
            })
            .mockReturnValueOnce({
                display: 'grid'
            });

        const result = analyzeContainerLayout(element);

        expect(result.containerType).toBe('grid');
        expect(result.isFlexible).toBe(true);
    });

    it('should detect absolute positioning', () => {
        const element = new MockHTMLElement('div') as unknown as HTMLElement;
        const parent = new MockHTMLElement('div') as unknown as HTMLElement;
        element.parentElement = parent;

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

        const result = analyzeContainerLayout(element);

        expect(result.containerType).toBe('absolute');
        expect(result.hasFixedDimensions).toBe(true);
        expect(result.recommendedStrategy).toBe('preserve');
    });

    it('should handle errors gracefully', () => {
        const element = new MockHTMLElement('div') as unknown as HTMLElement;

        mockGetComputedStyle.mockImplementation(() => {
            throw new Error('getComputedStyle failed');
        });

        const result = analyzeContainerLayout(element);

        expect(result).toEqual({
            containerType: 'unknown',
            isFlexible: false,
            hasFixedDimensions: false,
            recommendedStrategy: 'preserve'
        });
    });
});

describe('generateOptimalSkeletonDimensions', () => {
    const createMockMetadata = (overrides: Partial<ElementMetadata> = {}): ElementMetadata => ({
        tagName: 'div',
        className: '',
        textContent: '',
        dimensions: { width: 200, height: 100, x: 0, y: 0 },
        computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
        attributes: {},
        children: [],
        ...overrides
    });

    it('should use content-based dimensions when keepSpace is false', () => {
        const metadata = createMockMetadata();

        const result = generateOptimalSkeletonDimensions(metadata, undefined, { keepSpace: false });

        expect(result.strategy).toBe('content-based');
        expect(result.width).toBe(200);
        expect(result.height).toBe(100);
    });

    it('should extract actual dimensions when element is provided', () => {
        const metadata = createMockMetadata();
        const element = new MockHTMLElement('div', 300, 150) as unknown as HTMLElement;

        mockGetBoundingClientRect.mockReturnValue({
            width: 300,
            height: 150,
            x: 0,
            y: 0
        });

        mockGetComputedStyle.mockReturnValue({
            width: '300px',
            height: '150px',
            minWidth: '0px',
            minHeight: '0px',
            maxWidth: 'none',
            maxHeight: 'none',
            display: 'block',
            position: 'static',
            flexGrow: '0'
        });

        const result = generateOptimalSkeletonDimensions(metadata, element, { keepSpace: true });

        expect(result.width).toBe(300);
        expect(result.height).toBe(150);
        expect(result.strategy).toBe('preserve');
    });

    it('should apply flexible strategy for flex containers', () => {
        const metadata = createMockMetadata();
        const element = new MockHTMLElement('div') as unknown as HTMLElement;
        const parent = new MockHTMLElement('div') as unknown as HTMLElement;
        element.parentElement = parent;

        mockGetBoundingClientRect.mockReturnValue({
            width: 200,
            height: 100,
            x: 0,
            y: 0
        });

        mockGetComputedStyle
            .mockReturnValueOnce({
                width: '200px',
                height: '100px',
                minWidth: '0px',
                minHeight: '0px',
                maxWidth: 'none',
                maxHeight: 'none'
            })
            .mockReturnValueOnce({
                display: 'block',
                position: 'static',
                width: 'auto',
                height: 'auto',
                flexGrow: '1'
            })
            .mockReturnValueOnce({
                display: 'flex'
            });

        const result = generateOptimalSkeletonDimensions(metadata, element, {
            keepSpace: true,
            strategy: 'auto'
        });

        expect(result.width).toBe('100%');
        expect(result.strategy).toBe('flexible');
    });

    it('should apply minimal strategy when specified', () => {
        const metadata = createMockMetadata();
        const element = new MockHTMLElement('div', 200, 100) as unknown as HTMLElement;

        mockGetBoundingClientRect.mockReturnValue({
            width: 200,
            height: 100,
            x: 0,
            y: 0
        });

        mockGetComputedStyle.mockReturnValue({
            width: '200px',
            height: '100px',
            minWidth: '0px',
            minHeight: '0px',
            maxWidth: 'none',
            maxHeight: 'none'
        });

        const result = generateOptimalSkeletonDimensions(metadata, element, {
            keepSpace: true,
            strategy: 'minimal'
        });

        expect(result.width).toBe('auto');
        expect(result.height).toBe(100);
        expect(result.minWidth).toBe('200px');
        expect(result.strategy).toBe('minimal');
    });

    it('should fallback to content-based when no element provided', () => {
        const metadata = createMockMetadata();

        const result = generateOptimalSkeletonDimensions(metadata, undefined, { keepSpace: true });

        expect(result.strategy).toBe('fallback');
        expect(result.width).toBe(200);
        expect(result.height).toBe(100);
    });
});