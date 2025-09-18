import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createDefaultRules,
    calculateTextLines,
    parseDataSkeletonAttribute,
    doesElementMatchRule,
    validateAndMergeRules,
    applyMappingRules
} from '../mappingEngine';
import { MappingRule, ElementMetadata } from '../../types';

describe('mappingEngine', () => {
    describe('createDefaultRules', () => {
        let defaultRules: MappingRule[];

        beforeEach(() => {
            defaultRules = createDefaultRules();
        });

        it('should return an array of mapping rules', () => {
            expect(Array.isArray(defaultRules)).toBe(true);
            expect(defaultRules.length).toBeGreaterThan(0);
        });

        it('should have img.avatar → circle rule with highest priority', () => {
            const avatarRule = defaultRules.find(rule =>
                rule.match.tag === 'img' && rule.match.classContains === 'avatar'
            );

            expect(avatarRule).toBeDefined();
            expect(avatarRule?.to.shape).toBe('circle');
            expect(avatarRule?.to.size?.w).toBe('40px');
            expect(avatarRule?.to.size?.h).toBe('40px');
            expect(avatarRule?.priority).toBe(100);
        });

        it('should have button → rounded rect rule', () => {
            const buttonRule = defaultRules.find(rule =>
                rule.match.tag === 'button'
            );

            expect(buttonRule).toBeDefined();
            expect(buttonRule?.to.shape).toBe('rect');
            expect(buttonRule?.to.radius).toBe('6px');
            expect(buttonRule?.priority).toBe(80);
        });

        it('should have btn class → rounded rect rule', () => {
            const btnClassRule = defaultRules.find(rule =>
                rule.match.classContains === 'btn' && !rule.match.tag
            );

            expect(btnClassRule).toBeDefined();
            expect(btnClassRule?.to.shape).toBe('rect');
            expect(btnClassRule?.to.radius).toBe('6px');
            expect(btnClassRule?.priority).toBe(75);
        });

        it('should have heading rules for h1-h6 → line primitives', () => {
            const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            const expectedSizes = ['2rem', '1.5rem', '1.25rem', '1.125rem', '1rem', '0.875rem'];

            headingTags.forEach((tag, index) => {
                const headingRule = defaultRules.find(rule => rule.match.tag === tag);

                expect(headingRule).toBeDefined();
                expect(headingRule?.to.shape).toBe('line');
                expect(headingRule?.to.lines).toBe(1);
                expect(headingRule?.to.size?.h).toBe(expectedSizes[index]);
                expect(headingRule?.priority).toBe(70);
            });
        });

        it('should have paragraph → multi-line rule', () => {
            const paragraphRule = defaultRules.find(rule =>
                rule.match.tag === 'p'
            );

            expect(paragraphRule).toBeDefined();
            expect(paragraphRule?.to.shape).toBe('line');
            expect(paragraphRule?.to.lines).toBe(3);
            expect(paragraphRule?.to.size?.h).toBe('1rem');
            expect(paragraphRule?.priority).toBe(60);
        });

        it('should have SVG → rectangle rule', () => {
            const svgRule = defaultRules.find(rule =>
                rule.match.tag === 'svg'
            );

            expect(svgRule).toBeDefined();
            expect(svgRule?.to.shape).toBe('rect');
            expect(svgRule?.priority).toBe(50);
        });

        it('should have media elements → rectangle rules', () => {
            const mediaElements = [
                { tag: 'img', priority: 40 },
                { tag: 'video', priority: 40 },
                { tag: 'audio', priority: 40, height: '40px' }
            ];

            mediaElements.forEach(({ tag, priority, height }) => {
                const mediaRule = defaultRules.find(rule =>
                    rule.match.tag === tag && !rule.match.classContains
                );

                expect(mediaRule).toBeDefined();
                expect(mediaRule?.to.shape).toBe('rect');
                expect(mediaRule?.priority).toBe(priority);

                if (height) {
                    expect(mediaRule?.to.size?.h).toBe(height);
                }
            });
        });

        it('should have tag/badge class → small rectangle rules', () => {
            const tagRule = defaultRules.find(rule =>
                rule.match.classContains === 'tag'
            );

            expect(tagRule).toBeDefined();
            expect(tagRule?.to.shape).toBe('rect');
            expect(tagRule?.to.size?.h).toBe('24px');
            expect(tagRule?.to.radius).toBe('12px');
            expect(tagRule?.priority).toBe(65);

            const badgeRule = defaultRules.find(rule =>
                rule.match.classContains === 'badge'
            );

            expect(badgeRule).toBeDefined();
            expect(badgeRule?.to.shape).toBe('rect');
            expect(badgeRule?.to.size?.h).toBe('20px');
            expect(badgeRule?.to.radius).toBe('10px');
            expect(badgeRule?.priority).toBe(65);
        });

        it('should have rules sorted by priority in descending order when needed', () => {
            // Check that avatar rule has higher priority than generic img rule
            const avatarRule = defaultRules.find(rule =>
                rule.match.tag === 'img' && rule.match.classContains === 'avatar'
            );
            const imgRule = defaultRules.find(rule =>
                rule.match.tag === 'img' && !rule.match.classContains
            );

            expect(avatarRule?.priority).toBeGreaterThan(imgRule?.priority || 0);
        });
    });

    describe('calculateTextLines', () => {
        it('should return 1 for empty or whitespace-only text', () => {
            expect(calculateTextLines('', 300)).toBe(1);
            expect(calculateTextLines('   ', 300)).toBe(1);
            expect(calculateTextLines('\n\t', 300)).toBe(1);
        });

        it('should calculate lines based on text length and container width', () => {
            const containerWidth = 300;
            const fontSize = '16px';

            // Short text should be 1 line
            const shortText = 'Hello world';
            expect(calculateTextLines(shortText, containerWidth, fontSize)).toBe(1);

            // Long text should be multiple lines
            const longText = 'This is a very long text that should definitely span multiple lines when rendered in a container with limited width. It contains many words and characters.';
            const lines = calculateTextLines(longText, containerWidth, fontSize);
            expect(lines).toBeGreaterThan(1);
            expect(lines).toBeLessThanOrEqual(10); // Should be capped at 10
        });

        it('should handle different font sizes', () => {
            const text = 'This is some sample text for testing';
            const containerWidth = 200;

            const smallFontLines = calculateTextLines(text, containerWidth, '12px');
            const largeFontLines = calculateTextLines(text, containerWidth, '24px');

            // Larger font should result in more lines for same text and container
            expect(largeFontLines).toBeGreaterThanOrEqual(smallFontLines);
        });

        it('should return 1 for zero or negative container width', () => {
            expect(calculateTextLines('Some text', 0)).toBe(1);
            expect(calculateTextLines('Some text', -100)).toBe(1);
        });

        it('should cap lines at maximum of 10', () => {
            const veryLongText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50);
            const lines = calculateTextLines(veryLongText, 100, '16px');
            expect(lines).toBe(10);
        });

        it('should use default font size when not provided', () => {
            const text = 'Sample text';
            const containerWidth = 200;

            const withDefaultFont = calculateTextLines(text, containerWidth);
            const withExplicitFont = calculateTextLines(text, containerWidth, '16px');

            expect(withDefaultFont).toBe(withExplicitFont);
        });

        it('should handle invalid font size gracefully', () => {
            const text = 'Sample text';
            const containerWidth = 200;

            expect(() => calculateTextLines(text, containerWidth, 'invalid')).not.toThrow();
            const lines = calculateTextLines(text, containerWidth, 'invalid');
            expect(typeof lines).toBe('number');
            expect(lines).toBeGreaterThan(0);
        });
    });

    describe('parseDataSkeletonAttribute', () => {
        it('should return null for empty or invalid values', () => {
            expect(parseDataSkeletonAttribute('')).toBeNull();
            expect(parseDataSkeletonAttribute('   ')).toBeNull();
            expect(parseDataSkeletonAttribute('invalid')).toBeNull();
        });

        it('should return null for skip directive', () => {
            expect(parseDataSkeletonAttribute('skip')).toBeNull();
            expect(parseDataSkeletonAttribute('  skip  ')).toBeNull();
        });

        it('should parse simple shape specifications', () => {
            expect(parseDataSkeletonAttribute('rect')).toEqual({ shape: 'rect' });
            expect(parseDataSkeletonAttribute('circle')).toEqual({ shape: 'circle' });
            expect(parseDataSkeletonAttribute('line')).toEqual({ shape: 'line' });
            expect(parseDataSkeletonAttribute('  RECT  ')).toEqual({ shape: 'rect' });
        });

        it('should parse shape with size specifications', () => {
            expect(parseDataSkeletonAttribute('circle:40px')).toEqual({
                shape: 'circle',
                width: '40px',
                height: '40px'
            });

            expect(parseDataSkeletonAttribute('rect:100x50')).toEqual({
                shape: 'rect',
                width: '100',
                height: '50'
            });

            expect(parseDataSkeletonAttribute('rect:200px')).toEqual({
                shape: 'rect',
                width: '200px'
            });
        });

        it('should parse JSON configurations', () => {
            const jsonConfig = '{"shape": "circle", "width": "50px", "radius": "25px"}';
            expect(parseDataSkeletonAttribute(jsonConfig)).toEqual({
                shape: 'circle',
                width: '50px',
                borderRadius: '25px'
            });
        });

        it('should handle malformed JSON gracefully', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            expect(parseDataSkeletonAttribute('{"invalid": json}')).toBeNull();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('doesElementMatchRule', () => {
        const createMockElement = (overrides: Partial<ElementMetadata> = {}): ElementMetadata => ({
            tagName: 'div',
            className: 'test-class',
            textContent: 'Test content',
            dimensions: { width: 100, height: 50, x: 0, y: 0 },
            computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
            attributes: {},
            children: [],
            ...overrides
        });

        it('should match elements by tag name', () => {
            const element = createMockElement({ tagName: 'button' });
            const rule: MappingRule = {
                match: { tag: 'button' },
                to: { shape: 'rect' },
                priority: 50
            };

            expect(doesElementMatchRule(element, rule)).toBe(true);
        });

        it('should match elements by class contains', () => {
            const element = createMockElement({ className: 'btn btn-primary' });
            const rule: MappingRule = {
                match: { classContains: 'btn' },
                to: { shape: 'rect' },
                priority: 50
            };

            expect(doesElementMatchRule(element, rule)).toBe(true);
        });

        it('should match elements by role attribute', () => {
            const element = createMockElement({ attributes: { role: 'button' } });
            const rule: MappingRule = {
                match: { role: 'button' },
                to: { shape: 'rect' },
                priority: 50
            };

            expect(doesElementMatchRule(element, rule)).toBe(true);
        });

        it('should match elements by custom attributes', () => {
            const element = createMockElement({
                attributes: { 'data-type': 'avatar', 'aria-label': 'User avatar' }
            });
            const rule: MappingRule = {
                match: { attr: { 'data-type': 'avatar' } },
                to: { shape: 'circle' },
                priority: 50
            };

            expect(doesElementMatchRule(element, rule)).toBe(true);
        });

        it('should match elements with multiple criteria', () => {
            const element = createMockElement({
                tagName: 'img',
                className: 'avatar user-photo',
                attributes: { 'data-type': 'profile' }
            });
            const rule: MappingRule = {
                match: {
                    tag: 'img',
                    classContains: 'avatar',
                    attr: { 'data-type': 'profile' }
                },
                to: { shape: 'circle' },
                priority: 50
            };

            expect(doesElementMatchRule(element, rule)).toBe(true);
        });

        it('should not match when criteria do not match', () => {
            const element = createMockElement({ tagName: 'div' });
            const rule: MappingRule = {
                match: { tag: 'button' },
                to: { shape: 'rect' },
                priority: 50
            };

            expect(doesElementMatchRule(element, rule)).toBe(false);
        });

        it('should be case insensitive for tag and class matching', () => {
            const element = createMockElement({
                tagName: 'BUTTON',
                className: 'BTN-PRIMARY'
            });
            const rule: MappingRule = {
                match: {
                    tag: 'button',
                    classContains: 'btn'
                },
                to: { shape: 'rect' },
                priority: 50
            };

            expect(doesElementMatchRule(element, rule)).toBe(true);
        });
    });

    describe('validateAndMergeRules', () => {
        it('should merge custom rules with default rules', () => {
            const customRules: MappingRule[] = [
                {
                    match: { classContains: 'custom' },
                    to: { shape: 'circle' },
                    priority: 90
                }
            ];

            const merged = validateAndMergeRules(customRules);

            expect(merged.length).toBeGreaterThan(1);
            expect(merged.some(rule => rule.match.classContains === 'custom')).toBe(true);
            expect(merged.some(rule => rule.match.tag === 'button')).toBe(true);
        });

        it('should sort rules by priority in descending order', () => {
            const customRules: MappingRule[] = [
                {
                    match: { classContains: 'low' },
                    to: { shape: 'rect' },
                    priority: 10
                },
                {
                    match: { classContains: 'high' },
                    to: { shape: 'circle' },
                    priority: 200
                }
            ];

            const merged = validateAndMergeRules(customRules);

            // Should be sorted by priority descending
            for (let i = 0; i < merged.length - 1; i++) {
                expect(merged[i].priority).toBeGreaterThanOrEqual(merged[i + 1].priority);
            }
        });

        it('should filter out invalid rules', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const invalidRules: any[] = [
                { match: { tag: 'div' } }, // missing 'to' and 'priority'
                { to: { shape: 'rect' }, priority: 50 }, // missing 'match'
                { match: { tag: 'div' }, to: { shape: 'invalid' }, priority: 50 }, // invalid shape
                { match: { tag: 'div' }, to: { shape: 'rect' }, priority: 'invalid' }, // invalid priority
                { match: { tag: 'div' }, to: { shape: 'rect' }, priority: 50 } // valid rule
            ];

            const merged = validateAndMergeRules(invalidRules);

            // Should only include the valid rule plus default rules
            const customRulesCount = merged.filter(rule =>
                rule.match.tag === 'div' && rule.to.shape === 'rect'
            ).length;
            expect(customRulesCount).toBe(1);

            expect(consoleSpy).toHaveBeenCalledTimes(4); // 4 invalid rules
            consoleSpy.mockRestore();
        });

        it('should handle empty custom rules array', () => {
            const merged = validateAndMergeRules([]);
            const defaultRules = createDefaultRules();

            expect(merged.length).toBe(defaultRules.length);
        });

        it('should handle undefined custom rules', () => {
            const merged = validateAndMergeRules();
            const defaultRules = createDefaultRules();

            expect(merged.length).toBe(defaultRules.length);
        });
    });

    describe('applyMappingRules', () => {
        const createMockElement = (overrides: Partial<ElementMetadata> = {}): ElementMetadata => ({
            tagName: 'div',
            className: 'test-class',
            textContent: 'Test content',
            dimensions: { width: 100, height: 50, x: 0, y: 0 },
            computedStyle: { display: 'block', position: 'static', fontSize: '16px' },
            attributes: {},
            children: [],
            ...overrides
        });

        it('should handle data-skeleton skip directive', () => {
            const element = createMockElement({
                attributes: { 'data-skeleton': 'skip' }
            });

            const result = applyMappingRules(element, []);

            expect(result.className).toBe('__skeleton-skip__');
            expect(result.width).toBe(0);
            expect(result.height).toBe(0);
        });

        it('should apply data-skeleton attribute overrides', () => {
            const element = createMockElement({
                attributes: { 'data-skeleton': 'circle:40px' }
            });

            const result = applyMappingRules(element, []);

            expect(result.shape).toBe('circle');
            expect(result.width).toBe('40px');
            expect(result.height).toBe('40px');
        });

        it('should apply matching custom rules with priority', () => {
            const element = createMockElement({
                tagName: 'button',
                className: 'custom-btn'
            });

            const customRules: MappingRule[] = [
                {
                    match: { classContains: 'custom' },
                    to: { shape: 'circle', radius: '20px' },
                    priority: 200
                }
            ];

            const result = applyMappingRules(element, customRules);

            expect(result.shape).toBe('circle');
            expect(result.borderRadius).toBe('20px');
        });

        it('should apply default rules when no custom rules match', () => {
            const element = createMockElement({
                tagName: 'button'
            });

            const result = applyMappingRules(element, []);

            expect(result.shape).toBe('rect');
            expect(result.borderRadius).toBe('6px');
        });

        it('should calculate lines for paragraph elements', () => {
            const element = createMockElement({
                tagName: 'p',
                textContent: 'This is a long paragraph with lots of text that should span multiple lines when rendered.',
                dimensions: { width: 200, height: 60, x: 0, y: 0 }
            });

            const result = applyMappingRules(element, []);

            expect(result.shape).toBe('line');
            expect(result.lines).toBeGreaterThan(1);
        });

        it('should fall back to generic rectangle for unmatched elements', () => {
            const element = createMockElement({
                tagName: 'custom-element',
                className: 'unknown-class'
            });

            const result = applyMappingRules(element, []);

            expect(result.shape).toBe('rect');
            expect(result.width).toBe(100);
            expect(result.height).toBe(50);
        });

        it('should generate unique keys for elements', () => {
            const element = createMockElement();

            const result1 = applyMappingRules(element, []);
            const result2 = applyMappingRules(element, []);

            expect(result1.key).not.toBe(result2.key);
            expect(result1.key).toMatch(/^div-test-class-[a-z0-9]+$/);
        });

        it('should handle elements with no dimensions gracefully', () => {
            const element = createMockElement({
                dimensions: { width: 0, height: 0, x: 0, y: 0 }
            });

            const result = applyMappingRules(element, []);

            expect(result.width).toBe('auto');
            expect(result.height).toBe('auto');
        });

        it('should prioritize higher priority rules', () => {
            const element = createMockElement({
                tagName: 'img',
                className: 'avatar test-img'
            });

            const customRules: MappingRule[] = [
                {
                    match: { tag: 'img' },
                    to: { shape: 'rect' },
                    priority: 30 // Lower than avatar rule priority (100)
                }
            ];

            const result = applyMappingRules(element, customRules);

            // Should match the higher priority avatar rule (circle) not the custom img rule (rect)
            expect(result.shape).toBe('circle');
        });
    });
});