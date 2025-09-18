import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonPrimitive } from '../SkeletonPrimitive';
import { SkeletonLine } from '../SkeletonLine';
import { DynamicSkeleton } from '../DynamicSkeleton';
import { SkeletonSpec } from '../../types';

describe('Skeleton Markup Snapshots', () => {
  describe('SkeletonPrimitive snapshots', () => {
    it('should render consistent rect primitive markup', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-rect" 
          shape="rect" 
          width={200} 
          height={100} 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent circle primitive markup', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-circle" 
          shape="circle" 
          width={50} 
          height={50} 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent line primitive markup', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-line" 
          shape="line" 
          width="300px" 
          height="16px" 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent multi-line primitive markup', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-multiline" 
          shape="line" 
          lines={3}
          width="250px" 
          height="18px" 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render rect with custom border radius', () => {
      const { container } = render(
        <SkeletonPrimitive 
          key="test-rounded" 
          shape="rect" 
          width={120} 
          height={40} 
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
          style={{ margin: '10px', opacity: 0.7 }}
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
      const customTheme = { baseColor: '#ff6b6b', highlight: '#ffa8a8' };
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

  describe('SkeletonLine snapshots', () => {
    it('should render consistent single line markup', () => {
      const { container } = render(
        <SkeletonLine 
          lines={1} 
          width="200px" 
          lineHeight="20px" 
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent multi-line markup', () => {
      const { container } = render(
        <SkeletonLine 
          lines={4} 
          width="300px" 
          lineHeight="18px"
          spacing="6px"
          lastLineWidth="70%"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with custom spacing', () => {
      const { container } = render(
        <SkeletonLine 
          lines={3} 
          width={250} 
          lineHeight={16}
          spacing={8}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render with theme and animation', () => {
      const { container } = render(
        <SkeletonLine 
          lines={2} 
          width="100%" 
          theme="dark"
          animation="wave"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('DynamicSkeleton snapshots', () => {
    it('should render consistent skeleton from renderSpec', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'header',
            shape: 'line',
            width: '60%',
            height: '24px'
          },
          {
            key: 'paragraph',
            shape: 'line',
            lines: 3,
            width: '100%',
            height: '16px'
          },
          {
            key: 'button',
            shape: 'rect',
            width: '120px',
            height: '40px',
            borderRadius: '6px'
          },
          {
            key: 'avatar',
            shape: 'circle',
            width: '50px',
            height: '50px'
          }
        ]
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
            key: 'content',
            shape: 'rect',
            width: '100%',
            height: '200px'
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton 
          renderSpec={mockSpec} 
          theme="dark"
          animation="pulse"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent skeleton with custom aria label', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'loading-content',
            shape: 'rect',
            width: '300px',
            height: '100px'
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton 
          renderSpec={mockSpec} 
          ariaLabel="Loading user profile"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render consistent skeleton with custom className and styles', () => {
      const mockSpec: SkeletonSpec = {
        children: [
          {
            key: 'styled-content',
            shape: 'rect',
            width: '200px',
            height: '80px'
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton 
          renderSpec={mockSpec} 
          className="custom-skeleton-wrapper"
          style={{ padding: '20px', backgroundColor: '#f5f5f5' }}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render error state consistently', () => {
      const invalidSpec = {
        children: [
          {
            // Missing key
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

  describe('Complex skeleton compositions', () => {
    it('should render consistent card-like skeleton', () => {
      const cardSpec: SkeletonSpec = {
        children: [
          {
            key: 'card-image',
            shape: 'rect',
            width: '100%',
            height: '200px',
            borderRadius: '8px 8px 0 0'
          },
          {
            key: 'card-title',
            shape: 'line',
            width: '80%',
            height: '24px'
          },
          {
            key: 'card-description',
            shape: 'line',
            lines: 2,
            width: '100%',
            height: '16px'
          },
          {
            key: 'card-actions',
            shape: 'rect',
            width: '100px',
            height: '36px',
            borderRadius: '4px'
          }
        ]
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
            key: 'profile-avatar',
            shape: 'circle',
            width: '80px',
            height: '80px'
          },
          {
            key: 'profile-name',
            shape: 'line',
            width: '150px',
            height: '20px'
          },
          {
            key: 'profile-title',
            shape: 'line',
            width: '120px',
            height: '16px'
          },
          {
            key: 'profile-bio',
            shape: 'line',
            lines: 3,
            width: '300px',
            height: '14px'
          }
        ]
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
            width: '24px',
            height: '24px'
          },
          {
            key: 'item-title',
            shape: 'line',
            width: '200px',
            height: '18px'
          },
          {
            key: 'item-subtitle',
            shape: 'line',
            width: '150px',
            height: '14px'
          },
          {
            key: 'item-action',
            shape: 'rect',
            width: '60px',
            height: '28px',
            borderRadius: '14px'
          }
        ]
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
            key: 'col-1',
            shape: 'line',
            width: '100px',
            height: '16px'
          },
          {
            key: 'col-2',
            shape: 'line',
            width: '150px',
            height: '16px'
          },
          {
            key: 'col-3',
            shape: 'line',
            width: '80px',
            height: '16px'
          },
          {
            key: 'col-4',
            shape: 'rect',
            width: '70px',
            height: '24px',
            borderRadius: '4px'
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={tableRowSpec} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Responsive skeleton snapshots', () => {
    it('should render consistent skeleton with percentage widths', () => {
      const responsiveSpec: SkeletonSpec = {
        children: [
          {
            key: 'responsive-header',
            shape: 'line',
            width: '100%',
            height: '2rem'
          },
          {
            key: 'responsive-content',
            shape: 'line',
            lines: 4,
            width: '100%',
            height: '1rem'
          },
          {
            key: 'responsive-sidebar',
            shape: 'rect',
            width: '25%',
            height: '300px'
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
            key: 'rem-title',
            shape: 'line',
            width: '20rem',
            height: '1.5rem'
          },
          {
            key: 'rem-content',
            shape: 'line',
            lines: 2,
            width: '30rem',
            height: '1rem'
          }
        ]
      };

      const { container } = render(
        <DynamicSkeleton renderSpec={remSpec} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});