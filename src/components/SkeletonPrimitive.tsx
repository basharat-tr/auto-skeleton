import React from 'react';
import { SkeletonPrimitiveSpec, SkeletonShape, AnimationType, ThemeConfig, TailwindColorPreset, AnimationDuration, ThemePreset, CustomTheme } from '../types';
import { useSkeletonTheme } from './SkeletonThemeProvider';
import './SkeletonPrimitive.css';

export interface SkeletonPrimitiveProps extends SkeletonPrimitiveSpec {
  animation?: AnimationType;
  theme?: ThemePreset | CustomTheme;
  tailwindColor?: TailwindColorPreset;
  animationDuration?: AnimationDuration;
}

const defaultStyles: React.CSSProperties = {
  display: 'block',
  position: 'relative',
};

const getShapeStyles = (shape: SkeletonShape, width?: number | string, height?: number | string, borderRadius?: string): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    width: width || 'auto',
    height: height || 'auto',
  };

  switch (shape) {
    case 'circle':
      return {
        ...baseStyles,
        width: width || height || '40px',
        height: height || width || '40px',
        borderRadius: '50%',
      };
    case 'line':
      return {
        ...baseStyles,
        width: width || '100%',
        height: height || '1em',
        borderRadius: borderRadius || '2px',
      };
    case 'rect':
    default:
      return {
        ...baseStyles,
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius || 'var(--skeleton-border-radius, 4px)',
      };
  }
};

const normalizeSize = (size: number | string | undefined): string | undefined => {
  if (size === undefined) return undefined;
  if (typeof size === 'number') return `${size}px`;
  return size;
};

export const SkeletonPrimitive: React.FC<SkeletonPrimitiveProps> = ({
  shape = 'rect',
  width,
  height,
  borderRadius,
  lines,
  style = {},
  className = '',
  animation = 'pulse',
  theme: propTheme,
  tailwindColor,
  animationDuration = 'normal',
  ...props
}) => {
  const contextTheme = useSkeletonTheme();
  const normalizedWidth = normalizeSize(width);
  const normalizedHeight = normalizeSize(height);
  
  const shapeStyles = getShapeStyles(shape, normalizedWidth, normalizedHeight, borderRadius);
  
  // Build CSS custom properties for theming
  const themeStyles: Record<string, string> = {};
  
  // Use prop theme if provided, otherwise use context theme
  const activeTheme = propTheme || contextTheme.themePreset;
  
  if (typeof activeTheme === 'object') {
    themeStyles['--skeleton-base-color'] = activeTheme.baseColor;
    themeStyles['--skeleton-highlight-color'] = activeTheme.highlight;
    if (activeTheme.animationDuration) {
      themeStyles['--skeleton-animation-duration'] = activeTheme.animationDuration;
    }
    if (activeTheme.borderRadius) {
      themeStyles['--skeleton-border-radius'] = activeTheme.borderRadius;
    }
  } else if (!propTheme) {
    // Use context theme values when no prop theme is provided
    themeStyles['--skeleton-base-color'] = contextTheme.theme.baseColor;
    themeStyles['--skeleton-highlight-color'] = contextTheme.theme.highlightColor;
    themeStyles['--skeleton-animation-duration'] = contextTheme.theme.animationDuration;
    themeStyles['--skeleton-border-radius'] = contextTheme.theme.borderRadius.medium;
  }

  // Handle animation duration
  if (typeof animationDuration === 'string' && !['slow', 'normal', 'fast'].includes(animationDuration)) {
    themeStyles['--skeleton-animation-duration'] = animationDuration;
  }

  const combinedStyles: React.CSSProperties = {
    ...defaultStyles,
    ...shapeStyles,
    ...themeStyles,
    ...style,
  } as React.CSSProperties;

  // Build class names
  const classNames = ['skeleton-primitive', `skeleton-${shape}`];
  
  // Add animation class
  if (animation !== 'none') {
    classNames.push(`skeleton-animation-${animation}`);
  }
  
  // Add theme class
  if (typeof activeTheme === 'string') {
    classNames.push(`theme-${activeTheme}`);
  } else if (!propTheme) {
    // Use context theme class when no prop theme is provided
    classNames.push(`theme-${contextTheme.themePreset}`);
  }
  
  // Add Tailwind color class
  if (tailwindColor) {
    classNames.push(`skeleton-${tailwindColor}`);
  }
  
  // Add animation duration class
  if (typeof animationDuration === 'string' && ['slow', 'normal', 'fast'].includes(animationDuration)) {
    classNames.push(`skeleton-duration-${animationDuration}`);
  }
  
  // Add custom className
  if (className) {
    classNames.push(className);
  }

  const combinedClassName = classNames.join(' ');

  // Handle multi-line rendering for line shape
  if (shape === 'line' && lines && lines > 1) {
    const lineClassNames = ['skeleton-primitive', 'skeleton-line'];
    if (animation !== 'none') {
      lineClassNames.push(`skeleton-animation-${animation}`);
    }
    if (typeof activeTheme === 'string') {
      lineClassNames.push(`theme-${activeTheme}`);
    } else if (!propTheme) {
      // Use context theme class when no prop theme is provided
      lineClassNames.push(`theme-${contextTheme.themePreset}`);
    }
    if (tailwindColor) {
      lineClassNames.push(`skeleton-${tailwindColor}`);
    }
    if (typeof animationDuration === 'string' && ['slow', 'normal', 'fast'].includes(animationDuration)) {
      lineClassNames.push(`skeleton-duration-${animationDuration}`);
    }

    return (
      <div 
        className={`skeleton-lines ${className}`.trim()} 
        style={combinedStyles}
        tabIndex={-1}
        aria-hidden="true"
        role="presentation"
      >
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={lineClassNames.join(' ')}
            style={{
              ...shapeStyles,
              marginBottom: index < lines - 1 ? '0.5em' : 0,
              width: index === lines - 1 ? '75%' : '100%', // Last line is shorter
            }}
            tabIndex={-1}
            aria-hidden="true"
            role="presentation"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={combinedClassName}
      style={combinedStyles}
      tabIndex={-1}
      aria-hidden="true"
      role="presentation"
      {...props}
    />
  );
};