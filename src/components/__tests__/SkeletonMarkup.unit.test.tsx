import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SkeletonPrimitive } from '../SkeletonPrimitive';
import { SkeletonLine } from '../SkeletonLine';
import { DynamicSkeleton } from '../DynamicSkeleton';
import { SkeletonSpec } from '../../types';

describe('Skeleton Markup Unit Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('SkeletonPrimitive Markup Snapshots', () => {
    it('should render consistent rect primitive markup', () => {
      const { container } = render(
        <SkeletonPrimitive key="test-rect" shape="rect" width={100} height={50} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent circle primitive markup', () => {
      const { container } = render(
        <SkeletonPrimitive key="test-circle" shape="circle" width={40} height={40} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent line primitive markup', () => {
      const { container } = render(
        <SkeletonPrimitive key="test-line" shape="line" width="200px" height="16px" />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent multi-line primitive markup', () => {
      const { container } = render(
        <SkeletonPrimitive key="test-multiline" shape="line" lines={3} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render rect with custom border radius', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-rounded" 
          shape="rect" 
          width={100} 
          height={50} 
          borderRadius="8px" 
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with custom className and styles', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-custom" 
          shape="rect" 
          width={100} 
          height={50}
          className="custom-skeleton"
          style={{ margin: '10px', padding: '5px' }}
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with light theme', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-light" 
          shape="rect" 
          width={100} 
          height={50}
          theme="light"
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with dark theme', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-dark" 
          shape="rect" 
          width={100} 
          height={50}
          theme="dark"
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with custom theme', () => {
      const customTheme = { baseColor: '#ff0000', highlight: '#ff6666' };
      const { container } = render(
        <SkeletonPrimitive 
          key="test-custom-theme" 
          shape="rect" 
          width={100} 
          height={50}
          theme={customTheme}
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with pulse animation', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-pulse" 
          shape="rect" 
          width={100} 
          height={50}
          animation="pulse"
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with wave animation', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-wave" 
          shape="rect" 
          width={100} 
          height={50}
          animation="wave"
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with no animation', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-no-animation" 
          shape="rect" 
          width={100} 
          height={50}
          animation="none"
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('SkeletonLine Markup Snapshots', () => {
    it('should render consistent single line markup', () => {
      const { container } = render(
        <SkeletonLine />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent multi-line markup', () => {
      const { container } = render(
        <SkeletonLine lines={3} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with custom spacing', () => {
      const { container } = render(
        <SkeletonLine 
          lines={2} 
          spacing="1rem" 
          lineHeight="1.5rem"
          width="80%"
          lastLineWidth="60%"
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with theme and animation', () => {
      const { container } = render(
        <SkeletonLine 
          lines={2} 
          theme="dark"
          animation="wave"
          className="custom-line"
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('DynamicSkeleton Markup Snapshots', () => {
    it('should render consistent skeleton from renderSpec', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'avatar-1',
            shape: 'circle',
            width: 40,
            height: 40
          },
          {
            key: 'title-1',
            shape: 'line',
            width: '200px',
            height: '24px',
            lines: 1
          },
          {
            key: 'content-1',
            shape: 'line',
            width: '100%',
            height: '16px',
            lines: 3
          }
        ],
        layout: 'stack',
        gap: '0.5rem'
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={mockSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent skeleton with custom theme', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'rect-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton 
          renderSpec={mockSpec} 
          theme="dark"
          animation="wave"
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent skeleton with custom aria label', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton 
          renderSpec={mockSpec} 
          ariaLabel="Loading custom content..."
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent skeleton with custom className and styles', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'test-1',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton 
          renderSpec={mockSpec} 
          className="custom-dynamic-skeleton"
          style={{ padding: '1rem', border: '1px solid #ccc' }}
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render error state consistently', () => {
      const invalidSpec = {
        children: [
          {
            // Missing required 'key' property
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      } as SkeletonSpec;

      const { container } = render(
        <DynamicSkeleton renderSpec={invalidSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Complex Skeleton Compositions', () => {
    it('should render consistent card-like skeleton', () => {
      const cardSpec: SkeletonSpec = {
        children: [
          {
            key: 'card-avatar',
            shape: 'circle',
            width: 48,
            height: 48,
            className: 'card-avatar'
          },
          {
            key: 'card-title',
            shape: 'line',
            width: '70%',
            height: '20px',
            lines: 1,
            className: 'card-title'
          },
          {
            key: 'card-subtitle',
            shape: 'line',
            width: '50%',
            height: '16px',
            lines: 1,
            className: 'card-subtitle'
          },
          {
            key: 'card-content',
            shape: 'line',
            width: '100%',
            height: '14px',
            lines: 3,
            className: 'card-content'
          },
          {
            key: 'card-button',
            shape: 'rect',
            width: 80,
            height: 32,
            borderRadius: '4px',
            className: 'card-button'
          }
        ],
        layout: 'stack',
        gap: '0.75rem'
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={cardSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent profile skeleton', () => {
      const profileSpec: SkeletonSpec = {
        children: [
          {
            key: 'profile-header',
            shape: 'rect',
            width: '100%',
            height: 120,
            className: 'profile-header'
          },
          {
            key: 'profile-avatar',
            shape: 'circle',
            width: 80,
            height: 80,
            className: 'profile-avatar'
          },
          {
            key: 'profile-name',
            shape: 'line',
            width: '60%',
            height: '24px',
            lines: 1,
            className: 'profile-name'
          },
          {
            key: 'profile-bio',
            shape: 'line',
            width: '80%',
            height: '16px',
            lines: 2,
            className: 'profile-bio'
          },
          {
            key: 'profile-stats',
            shape: 'rect',
            width: '100%',
            height: 60,
            className: 'profile-stats'
          }
        ],
        layout: 'stack',
        gap: '1rem'
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={profileSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent list item skeleton', () => {
      const listItemSpec: SkeletonSpec = {
        children: [
          {
            key: 'item-icon',
            shape: 'circle',
            width: 24,
            height: 24,
            className: 'item-icon'
          },
          {
            key: 'item-title',
            shape: 'line',
            width: '40%',
            height: '18px',
            lines: 1,
            className: 'item-title'
          },
          {
            key: 'item-description',
            shape: 'line',
            width: '60%',
            height: '14px',
            lines: 1,
            className: 'item-description'
          },
          {
            key: 'item-action',
            shape: 'rect',
            width: 60,
            height: 24,
            borderRadius: '2px',
            className: 'item-action'
          }
        ],
        layout: 'row',
        gap: '0.5rem'
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={listItemSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent table row skeleton', () => {
      const tableRowSpec: SkeletonSpec = {
        children: [
          {
            key: 'cell-1',
            shape: 'line',
            width: '20%',
            height: '16px',
            lines: 1,
            className: 'table-cell'
          },
          {
            key: 'cell-2',
            shape: 'line',
            width: '30%',
            height: '16px',
            lines: 1,
            className: 'table-cell'
          },
          {
            key: 'cell-3',
            shape: 'line',
            width: '25%',
            height: '16px',
            lines: 1,
            className: 'table-cell'
          },
          {
            key: 'cell-4',
            shape: 'rect',
            width: 60,
            height: 20,
            borderRadius: '2px',
            className: 'table-cell-action'
          }
        ],
        layout: 'row',
        gap: '1rem'
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={tableRowSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Responsive Skeleton Snapshots', () => {
    it('should render consistent skeleton with percentage widths', () => {
      const responsiveSpec: SkeletonSpec = {
        children: [
          {
            key: 'responsive-1',
            shape: 'rect',
            width: '100%',
            height: 40
          },
          {
            key: 'responsive-2',
            shape: 'line',
            width: '75%',
            height: '16px',
            lines: 2
          },
          {
            key: 'responsive-3',
            shape: 'rect',
            width: '50%',
            height: 30
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={responsiveSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent skeleton with rem units', () => {
      const remSpec: SkeletonSpec = {
        children: [
          {
            key: 'rem-1',
            shape: 'rect',
            width: '20rem',
            height: '3rem'
          },
          {
            key: 'rem-2',
            shape: 'line',
            width: '15rem',
            height: '1.2rem',
            lines: 1
          },
          {
            key: 'rem-3',
            shape: 'circle',
            width: '2.5rem',
            height: '2.5rem'
          }
        ],
        gap: '1rem'
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={remSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Animation State Snapshots', () => {
    it('should render consistent markup across animation types', () => {
      const spec: SkeletonSpec = {
        children: [
          {
            key: 'animated-rect',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const animations = ['pulse', 'wave', 'none'] as const;
      
      animations.forEach(animation => {
        const { container } = render(
          <DynamicSkeleton renderSpec={spec} animation={animation} />
        );
        
        expect(container.firstChild).toMatchSnapshot(`animation-${animation}`);
        
        // Clean up for next iteration
        document.body.innerHTML = '';
      });
    });

    it('should render consistent markup across theme types', () => {
      const spec: SkeletonSpec = {
        children: [
          {
            key: 'themed-rect',
            shape: 'rect',
            width: 100,
            height: 50
          }
        ]
      };

      const themes = ['light', 'dark'] as const;
      
      themes.forEach(theme => {
        const { container } = render(
          <DynamicSkeleton renderSpec={spec} theme={theme} />
        );
        
        expect(container.firstChild).toMatchSnapshot(`theme-${theme}`);
        
        // Clean up for next iteration
        document.body.innerHTML = '';
      });
    });
  });

  describe('Edge Case Snapshots', () => {
    it('should render consistent markup for empty spec', () => {
      const emptySpec: SkeletonSpec = {
        children: []
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={emptySpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent markup for minimal primitives', () => {
      const minimalSpec: SkeletonSpec = {
        children: [
          {
            key: 'minimal',
            shape: 'rect'
            // No width/height specified
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={minimalSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent markup for zero-dimension primitives', () => {
      const zeroSpec: SkeletonSpec = {
        children: [
          {
            key: 'zero-width',
            shape: 'rect',
            width: 0,
            height: 50
          },
          {
            key: 'zero-height',
            shape: 'rect',
            width: 100,
            height: 0
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={zeroSpec} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent markup for large line counts', () => {
      const { container } = render(
        <SkeletonLine lines={10} />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});