import React from 'react';
import { SkeletonPrimitive } from './SkeletonPrimitive';

export interface SkeletonLineProps {
  lines?: number;
  lineHeight?: string | number;
  spacing?: string | number;
  className?: string;
  style?: React.CSSProperties;
  animation?: 'pulse' | 'wave' | 'none';
  theme?: 'light' | 'dark' | { baseColor: string; highlight: string };
  width?: string | number;
  lastLineWidth?: string | number;
}

const normalizeSize = (size: string | number | undefined, defaultValue: string): string => {
  if (size === undefined) return defaultValue;
  if (typeof size === 'number') return `${size}px`;
  return size;
};

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  lines = 1,
  lineHeight = '1em',
  spacing = '0.5em',
  className = '',
  style = {},
  animation = 'pulse',
  theme = 'light',
  width = '100%',
  lastLineWidth = '75%',
  ...props
}) => {
  const normalizedLineHeight = normalizeSize(lineHeight, '1em');
  const normalizedSpacing = normalizeSize(spacing, '0.5em');
  const normalizedWidth = normalizeSize(width, '100%');
  const normalizedLastLineWidth = normalizeSize(lastLineWidth, '75%');

  // Single line case
  if (lines === 1) {
    return (
      <SkeletonPrimitive
        key="single-line"
        shape="line"
        width={normalizedWidth}
        height={normalizedLineHeight}
        className={`skeleton-line-single ${className}`.trim()}
        style={style}
        animation={animation}
        theme={theme}
        {...props}
      />
    );
  }

  // Multi-line case
  return (
    <div 
      className={`skeleton-lines ${className}`.trim()} 
      style={style}
      tabIndex={-1}
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: lines }, (_, index) => {
        const isLastLine = index === lines - 1;
        const lineWidth = isLastLine ? normalizedLastLineWidth : normalizedWidth;
        const marginBottom = isLastLine ? '0px' : normalizedSpacing;

        return (
          <SkeletonPrimitive
            key={`line-${index}`}
            shape="line"
            width={lineWidth}
            height={normalizedLineHeight}
            className="skeleton-line"
            style={{ marginBottom }}
            animation={animation}
            theme={theme}
          />
        );
      })}
    </div>
  );
};