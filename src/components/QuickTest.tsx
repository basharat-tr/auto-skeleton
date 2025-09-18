import React, { useState, useRef } from 'react';
import { DynamicSkeleton } from './DynamicSkeletonWorking';
import { SkeletonThemeProvider } from './SkeletonThemeProvider';

/**
 * Simple test component for Dynamic Skeleton Loader
 */
const QuickTest: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleLoading = () => setLoading(!loading);

  return (
    <SkeletonThemeProvider theme={theme}>
      <div style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>

        <h1>🧪 Quick Test - Dynamic Skeleton Loader</h1>

        {/* Controls */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={toggleLoading}
            style={{
              padding: '10px 20px',
              background: loading ? '#dc2626' : '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? '👁️ Show Content' : '💀 Show Skeleton'}
          </button>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
              padding: '10px 20px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {theme === 'light' ? '🌙 Dark Theme' : '☀️ Light Theme'}
          </button>

          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 3000);
            }}
            style={{
              padding: '10px 20px',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🎯 Simulate 3s Load
          </button>
        </div>

        {/* Test Content */}
        <div style={{
          background: theme === 'dark' ? '#1f2937' : 'white',
          color: theme === 'dark' ? 'white' : '#1f2937',
          padding: '24px',
          borderRadius: '12px',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>

          {/* Always render content for ref, but hide when loading */}
          <div
            ref={contentRef}
            style={{ display: loading ? 'none' : 'block' }}
          >
            {/* Header Section */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 8px 0' }}>Welcome to Our Platform</h2>
              <p style={{ margin: 0, opacity: 0.8 }}>
                Discover amazing features and boost your productivity with our tools.
              </p>
            </div>

            {/* Profile Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
              padding: '16px',
              background: theme === 'dark' ? '#374151' : '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                👤
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>John Doe</h3>
                <p style={{ margin: '0', opacity: 0.7, fontSize: '14px' }}>john.doe@example.com</p>
                <p style={{ margin: '4px 0 0 0', opacity: 0.7, fontSize: '14px' }}>Premium Member</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {[
                { label: 'Projects', value: '12', icon: '📁' },
                { label: 'Tasks', value: '48', icon: '✅' },
                { label: 'Team Size', value: '8', icon: '👥' },
                { label: 'Progress', value: '85%', icon: '📊' }
              ].map((stat, index) => (
                <div key={index} style={{
                  padding: '16px',
                  background: theme === 'dark' ? '#374151' : '#f9fafb',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button style={{
                padding: '12px 24px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                Create Project
              </button>
              <button style={{
                padding: '12px 24px',
                background: 'transparent',
                color: theme === 'dark' ? 'white' : '#374151',
                border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                View Reports
              </button>
              <button style={{
                padding: '12px 24px',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                Invite Team
              </button>
            </div>

            {/* Recent Activity */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Created new project "Mobile App Redesign"',
                  'Completed task "User Research Analysis"',
                  'Added 3 new team members to workspace',
                  'Updated project timeline and milestones'
                ].map((activity, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    background: theme === 'dark' ? '#374151' : '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    opacity: 0.9
                  }}>
                    • {activity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Show skeleton when loading */}
          {loading && (
            <DynamicSkeleton
              forRef={contentRef}
              animation="pulse"
            />
          )}
        </div>

        {/* Info */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f0f9ff',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <strong>� 💡 Tips:</strong> Toggle loading states to see the skeleton in action.
          Try different themes and test with various content layouts.
        </div>
      </div>
    </SkeletonThemeProvider>
  );
};

export default QuickTest;