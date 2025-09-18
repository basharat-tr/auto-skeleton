# Requirements Document

## Introduction

The Dynamic Skeleton Loader is a React utility that automatically inspects a component tree or DOM structure and generates an appropriate skeleton UI. It maps elements to generic skeleton primitives (rectangles, circles, lines) with proper sizing, spacing, and animation while maintaining accessibility standards. The system provides both runtime DOM inspection and build-time static spec generation for optimal performance.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to automatically generate skeleton loaders from existing components, so that I don't have to manually create and maintain skeleton UIs for each component.

#### Acceptance Criteria

1. WHEN a React component reference is provided THEN the system SHALL scan the DOM tree and generate a matching skeleton specification
2. WHEN the DOM tree contains up to 200 nodes THEN the system SHALL process all nodes within 50ms for performance
3. WHEN scanning is complete THEN the system SHALL return a SkeletonSpec with appropriate primitives for each element
4. IF an element has zero width and height THEN the system SHALL skip it in the skeleton generation

### Requirement 2

**User Story:** As a developer, I want to use heuristic mapping rules to convert DOM elements to skeleton shapes, so that the generated skeletons accurately represent the original content structure.

#### Acceptance Criteria

1. WHEN an img element with "avatar" class is found THEN the system SHALL map it to a circle primitive
2. WHEN button elements or elements with "btn" class are found THEN the system SHALL map them to rounded rectangle primitives
3. WHEN heading elements (h1-h6) are found THEN the system SHALL map them to line primitives with appropriate width
4. WHEN paragraph elements are found THEN the system SHALL calculate line count based on text length and container width
5. WHEN svg elements or media containers are found THEN the system SHALL map them to rectangles with preserved aspect ratio
6. WHEN small inline elements with "tag" or "badge" classes are found THEN the system SHALL map them to small rectangle primitives

### Requirement 3

**User Story:** As a developer, I want to customize mapping rules and provide overrides, so that I can control how specific elements are converted to skeleton primitives.

#### Acceptance Criteria

1. WHEN custom mapping rules are provided THEN the system SHALL apply them with priority over default heuristics
2. WHEN an element has a "data-skeleton" attribute THEN the system SHALL use the specified skeleton type and properties
3. WHEN "data-skeleton='skip'" is set THEN the system SHALL exclude that element from skeleton generation
4. WHEN multiple rules match an element THEN the system SHALL apply the rule with highest priority value

### Requirement 4

**User Story:** As a developer, I want the skeleton loader to be accessible, so that users with assistive technologies can understand the loading state.

#### Acceptance Criteria

1. WHEN a skeleton is rendered THEN it SHALL include role="status" attribute
2. WHEN a skeleton is rendered THEN it SHALL include aria-busy="true" attribute
3. WHEN a skeleton is rendered THEN it SHALL include aria-live="polite" attribute
4. WHEN a skeleton is rendered THEN it SHALL include screen reader only text indicating loading state
5. WHEN a skeleton is active THEN it SHALL disable pointer events and tab stops

### Requirement 5

**User Story:** As a developer, I want to customize skeleton appearance and animations, so that skeletons match my application's design system.

#### Acceptance Criteria

1. WHEN animation type is specified THEN the system SHALL support "pulse", "wave", and "none" options
2. WHEN theme is specified THEN the system SHALL support "light", "dark", and custom color themes
3. WHEN CSS variables are used THEN the system SHALL allow customization of base color, highlight color, and animation duration
4. WHEN Tailwind CSS is used THEN the system SHALL provide compatible class mappings
5. WHEN custom styles are provided THEN the system SHALL merge them with default skeleton styles

### Requirement 6

**User Story:** As a developer, I want to use precomputed skeleton specifications, so that I can avoid runtime DOM inspection overhead in production.

#### Acceptance Criteria

1. WHEN a renderSpec is provided THEN the system SHALL use it instead of DOM inspection
2. WHEN build-time generation is used THEN the system SHALL support shallow rendering with react-test-renderer
3. WHEN static specs are generated THEN they SHALL be serializable as JSON
4. WHEN server-side rendering is used THEN the system SHALL work without DOM APIs

### Requirement 7

**User Story:** As a developer, I want to integrate skeleton loaders with Storybook, so that I can document and test skeleton states alongside my components.

#### Acceptance Criteria

1. WHEN Storybook stories are created THEN they SHALL show original component and skeleton side by side
2. WHEN Storybook controls are used THEN they SHALL allow toggling animation types and themes
3. WHEN Storybook is used THEN it SHALL support manual renderSpec overrides for testing
4. WHEN documentation is generated THEN it SHALL include mapping rule examples and usage patterns

### Requirement 8

**User Story:** As a developer, I want comprehensive testing capabilities, so that I can ensure skeleton generation works correctly across different scenarios.

#### Acceptance Criteria

1. WHEN unit tests run THEN they SHALL validate mapping rules produce expected skeleton shapes
2. WHEN snapshot tests run THEN they SHALL verify consistent skeleton markup generation
3. WHEN accessibility tests run THEN they SHALL confirm proper ARIA attributes and screen reader support
4. WHEN performance tests run THEN they SHALL ensure spec generation completes within acceptable time limits
5. WHEN integration tests run THEN they SHALL verify skeleton rendering matches component structure

### Requirement 9

**User Story:** As a developer, I want to prevent layout shifts during loading, so that the user experience remains smooth when content loads.

#### Acceptance Criteria

1. WHEN keepSpace option is enabled THEN the skeleton SHALL maintain original component dimensions
2. WHEN skeleton is replaced with real content THEN there SHALL be no visible layout reflow
3. WHEN container sizes are preserved THEN the system SHALL use CSS placeholder techniques
4. IF original dimensions are unknown THEN the system SHALL provide reasonable fallback sizes