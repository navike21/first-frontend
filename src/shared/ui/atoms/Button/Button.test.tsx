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
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should apply primary variant styles by default', () => {
    render(<Button>Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary-950', 'text-white')
  })

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-white', 'text-primary-text')
  })

  it('should apply correct size classes', () => {
    const { rerender } = render(<Button size="small">Small</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('px-6', 'py-3', 'text-xs')

    rerender(<Button size="medium">Medium</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('px-8', 'py-3.5', 'text-sm')

    rerender(<Button size="large">Large</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('px-10', 'py-4', 'text-md')
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
    expect(button).toHaveClass('cursor-not-allowed', 'opacity-50')
  })

  it('should pass through additional props', () => {
    render(
      <Button data-testid="test-button" aria-label="Test button">
        Button
      </Button>,
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
      'duration-500',
      'ease-in-out',
      'font-medium',
      'rounded-md',
    )
  })
})
