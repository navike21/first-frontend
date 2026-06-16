import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Avatar } from './Avatar'

describe('Avatar component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  describe('rendering with image', () => {
    it('should render with image src', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="Test User" />)
      const image = screen.getByRole('img', { name: /test user/i })
      expect(image).toBeInTheDocument()
    })

    it('should render with static image src string', () => {
      render(<Avatar src="/test.jpg" alt="Static Image" />)
      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
    })
  })

  describe('rendering with initials', () => {
    it('should render initials when no src provided', () => {
      render(<Avatar name="John Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should render first two initials from multi-word name', () => {
      render(<Avatar name="John Michael Doe Smith" />)
      expect(screen.getByText('JM')).toBeInTheDocument()
    })

    it('should render single initial for single name', () => {
      render(<Avatar name="John" />)
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('should render question mark when no name or src provided', () => {
      render(<Avatar />)
      expect(screen.getByText('?')).toBeInTheDocument()
    })

    it('should handle names with extra spaces', () => {
      render(<Avatar name="  John   Doe  " />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should convert initials to uppercase', () => {
      render(<Avatar name="john doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })
  })

  describe('size variants', () => {
    it('should apply small size classes', () => {
      const { container } = render(<Avatar name="Test" size="sm" />)
      const figure = container.querySelector('figure')
      expect(figure).toHaveClass('min-w-8', 'h-8')
    })

    it('should apply medium size classes by default', () => {
      const { container } = render(<Avatar name="Test" />)
      const figure = container.querySelector('figure')
      expect(figure).toHaveClass('min-w-12', 'h-12')
    })

    it('should apply large size classes', () => {
      const { container } = render(<Avatar name="Test" size="lg" />)
      const figure = container.querySelector('figure')
      expect(figure).toHaveClass('min-w-16', 'h-16')
    })
  })

  describe('status indicators', () => {
    it('should not render status indicator when status is none', () => {
      const { container } = render(<Avatar name="Test" status="none" />)
      const statusIndicator = container.querySelector(
        '.bg-green-500, .bg-gray-400, .bg-red-500, .bg-yellow-400'
      )
      expect(statusIndicator).not.toBeInTheDocument()
    })

    it('should render online status with green color', () => {
      const { container } = render(<Avatar name="Test" status="online" />)
      const statusIndicator = container.querySelector('.bg-green-500')
      expect(statusIndicator).toBeInTheDocument()
    })

    it('should render offline status with gray color', () => {
      const { container } = render(<Avatar name="Test" status="offline" />)
      const statusIndicator = container.querySelector('.bg-gray-400')
      expect(statusIndicator).toBeInTheDocument()
    })

    it('should render busy status with red color', () => {
      const { container } = render(<Avatar name="Test" status="busy" />)
      const statusIndicator = container.querySelector('.bg-red-500')
      expect(statusIndicator).toBeInTheDocument()
    })

    it('should render away status with yellow color', () => {
      const { container } = render(<Avatar name="Test" status="away" />)
      const statusIndicator = container.querySelector('.bg-yellow-400')
      expect(statusIndicator).toBeInTheDocument()
    })

    it('should apply correct status size for small avatar', () => {
      const { container } = render(
        <Avatar name="Test" status="online" size="sm" />
      )
      const statusIndicator = container.querySelector('.bg-green-500')
      expect(statusIndicator).toHaveClass('w-3', 'h-3')
    })

    it('should apply correct status size for medium avatar', () => {
      const { container } = render(
        <Avatar name="Test" status="online" size="md" />
      )
      const statusIndicator = container.querySelector('.bg-green-500')
      expect(statusIndicator).toHaveClass('w-3.5', 'h-3.5')
    })

    it('should apply correct status size for large avatar', () => {
      const { container } = render(
        <Avatar name="Test" status="online" size="lg" />
      )
      const statusIndicator = container.querySelector('.bg-green-500')
      expect(statusIndicator).toHaveClass('w-4', 'h-4')
    })
  })

  describe('accessibility', () => {
    it('should have correct aria-label from name', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const figure = container.querySelector('figure')
      expect(figure).toHaveAttribute('aria-label', 'John Doe')
    })

    it('should fallback to alt for aria-label when name is not provided', () => {
      const { container } = render(<Avatar alt="Profile Picture" />)
      const figure = container.querySelector('figure')
      expect(figure).toHaveAttribute('aria-label', 'Profile Picture')
    })

    it('should use name for title when title not provided', () => {
      const { container } = render(<Avatar name="John Doe" />)
      const figure = container.querySelector('figure')
      expect(figure).toHaveAttribute('title', 'John Doe')
    })

    it('should use custom title when provided', () => {
      const { container } = render(
        <Avatar name="John Doe" title="Custom Title" />
      )
      const figure = container.querySelector('figure')
      expect(figure).toHaveAttribute('title', 'Custom Title')
    })
  })

  describe('custom styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Avatar name="Test" className="custom-class" />
      )
      const figure = container.querySelector('figure')
      expect(figure).toHaveClass('custom-class')
    })

    it('should maintain base classes with custom className', () => {
      const { container } = render(
        <Avatar name="Test" className="custom-class" />
      )
      const figure = container.querySelector('figure')
      expect(figure).toHaveClass(
        'relative',
        'inline-flex',
        'rounded-full',
        'custom-class'
      )
    })
  })
})
