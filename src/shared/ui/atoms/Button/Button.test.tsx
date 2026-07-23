import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'

import { Button } from './Button'

describe('Button component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render children correctly', () => {
    // Arrange & Act
    render(<Button>Click me</Button>)
    // Assert
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument()
  })

  it('should apply primary variant styles by default', () => {
    render(<Button>Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary-600', 'text-white')
  })

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'bg-surface',
      'text-foreground',
      'ring-1',
      'ring-border-control',
      'ring-inset'
    )
  })

  it('should apply ghost variant styles', () => {
    render(<Button variant="ghost">Ghost Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-transparent', 'text-primary-700')
  })

  it('should apply destructive variant styles', () => {
    render(<Button variant="destructive">Destructive Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'bg-surface',
      'text-danger-600',
      'ring-1',
      'ring-danger-200',
      'ring-inset'
    )
  })

  it('should apply correct size classes', () => {
    const { rerender } = render(<Button size="small">Small</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-8', 'px-3.5', 'text-[13px]')

    rerender(<Button size="medium">Medium</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'px-[18px]', 'text-sm')

    rerender(<Button size="large">Large</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-12', 'px-6', 'text-[15px]')
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByRole('button')

    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass(
      'cursor-not-allowed',
      'bg-border-control',
      'text-muted'
    )
  })

  it('should apply the opacity-50 fallback when disabled with variant text', () => {
    render(
      <Button disabled variant="text">
        Disabled Button
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('cursor-not-allowed', 'opacity-50')
  })

  it('should dim the whole button (not just the text) while loading', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('opacity-85')
  })

  it('should pass through additional props', () => {
    render(
      <Button data-testid="test-button" aria-label="Test button">
        Button
      </Button>
    )
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('aria-label', 'Test button')
  })

  it('should render with icon when provided', () => {
    render(<Button icon="RiHomeLine">With Icon</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should have base button classes', () => {
    render(<Button>Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'cursor-pointer',
      'duration-fast',
      'ease-out-expo',
      'font-medium',
      'rounded-control'
    )
  })

  describe('variant text', () => {
    it('should apply text-variant underline pseudo-element class', () => {
      render(<Button variant="text">Text Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('before:absolute')
    })

    it('should apply hover underline class when not loading', () => {
      render(<Button variant="text">Text Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:before:w-full')
    })

    it('should apply size text classes for variant text', () => {
      const { rerender } = render(
        <Button variant="text" size="small">
          S
        </Button>
      )
      expect(screen.getByRole('button')).toHaveClass('text-xs')

      rerender(
        <Button variant="text" size="medium">
          M
        </Button>
      )
      expect(screen.getByRole('button')).toHaveClass('text-sm')

      rerender(
        <Button variant="text" size="large">
          L
        </Button>
      )
      expect(screen.getByRole('button')).toHaveClass('text-md')
    })

    it('should apply inline-flex when variant text and loading', () => {
      render(
        <Button variant="text" loading>
          Loading
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('inline-flex', 'align-middle')
    })
  })

  describe('loading state', () => {
    it('should render spinner when loading', () => {
      render(<Button loading>Loading</Button>)
      // The loading div should be present (spinner container)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('cursor-wait')
    })

    it('should not apply hover classes when loading', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('hover:shadow-lg')
    })
  })
})
