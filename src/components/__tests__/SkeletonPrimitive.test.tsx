import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SkeletonPrimitive } from '../SkeletonPrimitive';

describe('SkeletonPrimitive', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Shape rendering', () => {
    it('renders rect shape by default', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-rect');
    });

    it('renders circle shape with correct styles', () => {
      render(<SkeletonPrimitive key="test" shape="circle" width={50} height={50} />);
      const element = document.querySelector('.skeleton-primitive.skeleton-circle');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-circle');
      expect(element).toHaveStyle({
        width: '50px',
        height: '50px',
        borderRadius: '50%',
      });
    });

    it('renders line shape with correct dimensions', () => {
      render(<SkeletonPrimitive key="test" shape="line" width="200px" height="16px" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-line');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-line');
      expect(element).toHaveStyle({
        width: '200px',
        height: '16px',
      });
    });
  });

  describe('Multi-line rendering', () => {
    it('renders multiple lines for line shape with lines prop', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={3} />);
      const container = document.querySelector('.skeleton-lines');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('skeleton-lines');
      
      const lines = container!.querySelectorAll('.skeleton-line');
      expect(lines).toHaveLength(3);
    });

    it('makes last line shorter in multi-line rendering', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={2} />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ width: '100%' });
      expect(lines[1]).toHaveStyle({ width: '75%' });
    });

    it('adds margin between lines except the last one', () => {
      render(<SkeletonPrimitive key="test" shape="line" lines={3} />);
      const container = document.querySelector('.skeleton-lines');
      const lines = container!.querySelectorAll('.skeleton-line');
      
      expect(lines[0]).toHaveStyle({ marginBottom: '0.5em' });
      expect(lines[1]).toHaveStyle({ marginBottom: '0.5em' });
      expect(lines[2]).toHaveStyle({ marginBottom: '0px' });
    });
  });

  describe('Responsive sizing', () => {
    it('handles pixel values', () => {
      render(<SkeletonPrimitive key="test" shape="rect" width={100} height={50} />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        width: '100px',
        height: '50px',
      });
    });

    it('handles string values with units', () => {
      render(<SkeletonPrimitive key="test" shape="rect" width="50%" height="2rem" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        width: '50%',
        height: '2rem',
      });
    });

    it('uses default dimensions when not specified', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        width: '100%',
        height: '20px',
      });
    });

    it('handles circle shape with single dimension', () => {
      render(<SkeletonPrimitive key="test" shape="circle" width={60} />);
      const element = document.querySelector('.skeleton-primitive.skeleton-circle');
      expect(element).toHaveStyle({
        width: '60px',
        height: '60px',
      });
    });
  });

  describe('Style and className merging', () => {
    it('merges custom styles with default styles', () => {
      const customStyle = { margin: '10px', color: 'red' };
      render(<SkeletonPrimitive key="test" shape="rect" style={customStyle} />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        margin: '10px',
        color: 'rgb(255, 0, 0)', // Browser converts 'red' to rgb
      });
      // Check that default styles are still applied
      expect(element).toHaveStyle({
        display: 'block',
        position: 'relative',
      });
    });

    it('applies custom className', () => {
      render(<SkeletonPrimitive key="test" shape="rect" className="custom-class" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect.custom-class');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('skeleton-primitive', 'skeleton-rect', 'custom-class');
    });

    it('handles custom borderRadius', () => {
      render(<SkeletonPrimitive key="test" shape="rect" borderRadius="8px" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({ borderRadius: '8px' });
    });
  });

  describe('Animation support', () => {
    it('applies pulse animation by default', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
      });
    });

    it('applies wave animation', () => {
      render(<SkeletonPrimitive key="test" shape="rect" animation="wave" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        animation: 'skeleton-wave 1.5s linear infinite',
      });
    });

    it('applies no animation when set to none', () => {
      render(<SkeletonPrimitive key="test" shape="rect" animation="none" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      const style = window.getComputedStyle(element!);
      expect(style.animation).not.toMatch(/skeleton/);
    });
  });

  describe('Theme support', () => {
    it('applies light theme by default', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        '--skeleton-base-color': '#e2e8f0',
        '--skeleton-highlight-color': '#f1f5f9',
      });
    });

    it('applies dark theme', () => {
      render(<SkeletonPrimitive key="test" shape="rect" theme="dark" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        '--skeleton-base-color': '#374151',
        '--skeleton-highlight-color': '#4b5563',
      });
    });

    it('applies custom theme colors', () => {
      const customTheme = { baseColor: '#ff0000', highlight: '#ff6666' };
      render(<SkeletonPrimitive key="test" shape="rect" theme={customTheme} />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({
        '--skeleton-base-color': '#ff0000',
        '--skeleton-highlight-color': '#ff6666',
      });
    });
  });

  describe('Accessibility', () => {
    it('has pointer-events disabled', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({ pointerEvents: 'none' });
    });

    it('has user-select disabled', () => {
      render(<SkeletonPrimitive key="test" shape="rect" />);
      const element = document.querySelector('.skeleton-primitive.skeleton-rect');
      expect(element).toHaveStyle({ userSelect: 'none' });
    });
  });
});