import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Card } from './Card'

describe('Card component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render children', () => {
    // Arrange & Act
    render(<Card>Hello Card</Card>)
    // Assert
    expect(screen.getByText('Hello Card')).toBeInTheDocument()
  })

  it('should apply medium padding by default', () => {
    // Arrange & Act
    const { container } = render(<Card>Content</Card>)
    // Assert
    expect(container.firstChild).toHaveClass('p-6')
  })

  it('should apply no padding when padding="none"', () => {
    // Arrange & Act
    const { container } = render(<Card padding="none">Content</Card>)
    // Assert
    expect(container.firstChild).toHaveClass('p-0')
  })

  it('should apply small padding when padding="small"', () => {
    // Arrange & Act
    const { container } = render(<Card padding="small">Content</Card>)
    // Assert
    expect(container.firstChild).toHaveClass('p-4')
  })

  it('should apply large padding when padding="large"', () => {
    // Arrange & Act
    const { container } = render(<Card padding="large">Content</Card>)
    // Assert
    expect(container.firstChild).toHaveClass('p-8')
  })

  it('should apply hover classes when interactive is true', () => {
    // Arrange & Act
    const { container } = render(<Card interactive>Content</Card>)
    // Assert
    expect(container.firstChild).toHaveClass('hover:shadow-md', 'hover:border-gray-300')
  })

  it('should not apply hover classes when interactive is false by default', () => {
    // Arrange & Act
    const { container } = render(<Card>Content</Card>)
    // Assert
    expect(container.firstChild).not.toHaveClass('hover:shadow-md')
  })

  it('should merge custom className', () => {
    // Arrange & Act
    const { container } = render(<Card className="my-custom-class">Content</Card>)
    // Assert
    expect(container.firstChild).toHaveClass('my-custom-class')
  })

  it('should forward extra HTML attributes', () => {
    // Arrange & Act
    render(<Card data-testid="card-el">Content</Card>)
    // Assert
    expect(screen.getByTestId('card-el')).toBeInTheDocument()
  })
})
