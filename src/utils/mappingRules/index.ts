/**
 * Tree-shakeable mapping rules for Dynamic Skeleton Loader
 * Import only the rules you need to reduce bundle size
 */

export * from './avatar';
// export * from './button';
export * from './heading';
export * from './paragraph';
// export * from './media';
export * from './badge';

// Re-export for backward compatibility
export { createDefaultRules } from '../mappingEngine';