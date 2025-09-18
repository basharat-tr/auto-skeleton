import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SkeletonLine } from '../SkeletonLine';

describe('SkeletonLine', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Single line rendering', () => {
    it('renders single line by default', () => {
      render(<SkeletonLine />);
      const element = document.querySelector('.skeleton-line-single');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-line', 'skeleton-line-single');
    });

    it('renders single line when lines=1', () => {
      render(<SkeletonLine lines={1} />);
      const element = document.querySelector('.skeleton-line-single');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-line-single');
    });

    it('applies custom width to single line', () => {
      render(<SkeletonLine lines={1} width="200px" />);
      const element = document.querySelector('.skeleton-line-single');
      expect(element).toHaveStyle({ width: '200px' });
    });

    it('applies custom line height to single line', () => {
      render(<SkeletonLine lines={1} lineHeight="24px" />);
      const element = document.querySelector('.skeleton-line-single');
      expect(element).toHaveStyle({ height: '24px' });
    });
  });

  describe('Multi-line rendering', () => {
    it('renders multiple lines when lines > 1', () => {
      render(<SkeletonLine lines={3} />);
      const container = document.querySelector('.skeleton-lines');
      expect(container).toBeInTheDocument();
      
      const lines = container!.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(3);
    });

    it('makes last line shorter by default', () => {
      render(<SkeletonLine lines={2} />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '100%' });
      expect(lines[1]).toHaveStyle({ width: '75%' });
    });

    it('applies custom last line width', () => {
      render(<SkeletonLine lines={2} lastLineWidth="60%" />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '100%' });
      expect(lines[1]).toHaveStyle({ width: '60%' });
    });

    it('applies spacing between lines except the last', () => {
      render(<SkeletonLine lines={3} spacing="8px" />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ marginBottom: '8px' });
      expect(lines[1]).toHaveStyle({ marginBottom: '8px' });
      expect(lines[2]).toHaveStyle({ marginBottom: '0px' });
    });

    it('applies custom line height to all lines', () => {
      render(<SkeletonLine lines={2} lineHeight="20px" />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      lines.forEach(line => {
        expect(line).toHaveStyle({ height: '20px' });
      });
    });
  });

  describe('Size normalization', () => {
    it('converts number values to pixels', () => {
      render(<SkeletonLine lines={1} lineHeight={24} width={300} />);
      const element = document.querySelector('.skeleton-line-single');
      expect(element).toHaveStyle({
        height: '24px',
        width: '300px',
      });
    });

    it('preserves string values with units', () => {
      render(<SkeletonLine lines={1} lineHeight="1.5em" width="50%" />);
      const element = document.querySelector('.skeleton-line-single');
      expect(element).toHaveStyle({
        height: '1.5em',
        width: '50%',
      });
    });

    it('handles spacing as number', () => {
      render(<SkeletonLine lines={2} spacing={12} />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ marginBottom: '12px' });
    });
  });

  describe('Animation and theme support', () => {
    it('passes animation prop to skeleton primitives', () => {
      render(<SkeletonLine lines={2} animation="wave" />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      lines.forEach(line => {
        expect(line).toHaveStyle({
          animation: 'skeleton-wave 1.5s linear infinite',
        });
      });
    });

    it('passes theme prop to skeleton primitives', () => {
      render(<SkeletonLine lines={2} theme="dark" />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      lines.forEach(line => {
        expect(line).toHaveStyle({
          '--skeleton-base-color': '#374151',
          '--skeleton-highlight-color': '#4b5563',
        });
      });
    });

    it('passes custom theme to skeleton primitives', () => {
      const customTheme = { baseColor: '#ff0000', highlight: '#ff6666' };
      render(<SkeletonLine lines={2} theme={customTheme} />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      lines.forEach(line => {
        expect(line).toHaveStyle({
          '--skeleton-base-color': '#ff0000',
          '--skeleton-highlight-color': '#ff6666',
        });
      });
    });
  });

  describe('Style and className handling', () => {
    it('applies custom className to single line', () => {
      render(<SkeletonLine lines={1} className="custom-class" />);
      const element = document.querySelector('.skeleton-line-single.custom-class');
      expect(element).toBeInTheDocument();
    });

    it('applies custom className to multi-line container', () => {
      render(<SkeletonLine lines={2} className="custom-class" />);
      const container = document.querySelector('.skeleton-lines.custom-class');
      expect(container).toBeInTheDocument();
    });

    it('applies custom styles to single line', () => {
      const customStyle = { margin: '10px', padding: '5px' };
      render(<SkeletonLine lines={1} style={customStyle} />);
      const element = document.querySelector('.skeleton-line-single');
      expect(element).toHaveStyle({
        margin: '10px',
        padding: '5px',
      });
    });

    it('applies custom styles to multi-line container', () => {
      const customStyle = { margin: '10px', padding: '5px' };
      render(<SkeletonLine lines={2} style={customStyle} />);
      const container = document.querySelector('.skeleton-lines');
      expect(container).toHaveStyle({
        margin: '10px',
        padding: '5px',
      });
    });
  });

  describe('Line count accuracy', () => {
    it('renders exact number of lines specified', () => {
      const testCases = [2, 3, 5, 10];
      
      testCases.forEach(lineCount => {
        document.body.innerHTML = '';
        render(<SkeletonLine lines={lineCount} />);
        const container = document.querySelector('.skeleton-lines');
        const lines = container!.querySelectorAll('.skeleton-line');
        expect(lines).toHaveLength(lineCount);
      });
    });

    it('handles edge case of 0 lines', () => {
      render(<SkeletonLine lines={0} />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(0);
    });
  });

  describe('Line width variations', () => {
    it('applies consistent width to all lines except last', () => {
      render(<SkeletonLine lines={4} width="80%" />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      // First 3 lines should have full width
      for (let i = 0; i < 3; i++) {
        expect(lines[i]).toHaveStyle({ width: '80%' });
      }
      
      // Last line should be shorter
      expect(lines[3]).toHaveStyle({ width: '75%' });
    });

    it('handles numeric width values', () => {
      render(<SkeletonLine lines={2} width={400} lastLineWidth={300} />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '400px' });
      expect(lines[1]).toHaveStyle({ width: '300px' });
    });
  });
});