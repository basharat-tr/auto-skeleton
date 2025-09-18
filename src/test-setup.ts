// Basic test setup for Node environment
// Skip DOM-related imports and mocks for now

// Polyfill for Node.js environment
Object.assign(globalThis, {
    globalThis: globalThis,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
});

// Only add DOM mocks if we're in a DOM environment
if (typeof window !== 'undefined') {
    // Mock DOM APIs that might not be available
    Object.defineProperty(window, 'getComputedStyle', {
        value: () => ({
            getPropertyValue: () => '',
            display: 'block',
            position: 'static',
            fontSize: '16px',
        }),
    });

    // Mock ResizeObserver
    (globalThis as any).ResizeObserver = class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    };

    // Mock IntersectionObserver
    (globalThis as any).IntersectionObserver = class IntersectionObserver {
        constructor() { }
        observe() { }
        unobserve() { }
        disconnect() { }
    };
}