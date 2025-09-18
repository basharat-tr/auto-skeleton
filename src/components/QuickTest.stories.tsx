import type { Meta, StoryObj } from '@storybook/react';
import QuickTest from './QuickTest';

const meta: Meta<typeof QuickTest> = {
  title: 'Testing/QuickTest',
  component: QuickTest,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Quick Test Component

A simple, focused component for rapid testing and experimentation with the Dynamic Skeleton Loader.

## 🎯 Purpose

This component is designed for:
- Quick testing of skeleton functionality
- Performance experimentation
- Theme testing
- Development and debugging

## 🚀 Features

- **Simple Controls**: Toggle loading, themes, and simulate loading
- **Performance Logging**: Console logs for timing and metrics
- **Theme Support**: Light and dark theme switching
- **Realistic Content**: Dashboard-style content for testing
- **Performance Monitoring**: Built-in timing and memory tracking

## 🛠️ How to Use

1. **Toggle Loading**: Switch between skeleton and content states
2. **Change Themes**: Test light and dark theme variations
3. **Simulate Loading**: 3-second loading simulation
4. **Monitor Performance**: Check browser console for metrics

## 📊 Performance Features

- Optimized DOM scanning (max 100 nodes, 30ms timeout)
- GPU-accelerated animations
- Memory-efficient rendering
- Real-time performance logging

Perfect for quick testing and development work!
        `
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '🧪 Quick Test',
  parameters: {
    docs: {
      description: {
        story: `
The main quick test component for rapid development and testing.

**Features:**
- Simple toggle controls
- Performance logging in console
- Theme switching
- Realistic test content

**Try This:**
1. Toggle between skeleton and content
2. Switch themes to test appearance
3. Use the 3s simulation for realistic loading
4. Open dev tools to see performance logs
        `
      }
    }
  }
};

export const LoadingFocus: Story = {
  name: '⏳ Loading State',
  parameters: {
    docs: {
      description: {
        story: `
Focused on the loading state for detailed skeleton testing.

Perfect for:
- Testing skeleton appearance
- Checking animation performance
- Validating theme compatibility
- Performance monitoring
        `
      }
    }
  }
};

export const PerformanceTesting: Story = {
  name: '📊 Performance Testing',
  parameters: {
    docs: {
      description: {
        story: `
Optimized for performance testing and monitoring.

**Console Logging:**
- State change timing
- Render performance
- Memory usage tracking
- Animation frame rates

Check the browser console for detailed performance metrics.
        `
      }
    }
  }
};