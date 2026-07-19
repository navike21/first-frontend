import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { IconButton } from './IconButton'

describe('IconButton component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the icon', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" aria-label="Home" />)
    // Assert
    expect(screen.getByTestId('icon-RiHomeLine')).toBeInTheDocument()
  })

  it('should render a button element', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" aria-label="Home" />)
    // Assert
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument()
  })

  it('should apply primary variant styles by default', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('bg-primary-600', 'text-white')
  })

  it('should apply secondary variant styles', () => {
    // Arrange & Act
    render(
      <IconButton icon="RiHomeLine" variant="secondary" aria-label="Home" />
    )
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass(
      'bg-surface',
      'text-primary-700',
      'ring-1',
      'ring-primary-700',
      'ring-inset'
    )
  })

  it('should apply warning variant styles', () => {
    // Arrange & Act
    render(
      <IconButton icon="RiAlertLine" variant="warning" aria-label="Warning" />
    )
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('bg-amber-500', 'text-white')
  })

  it('should apply error variant styles', () => {
    // Arrange & Act
    render(
      <IconButton
        icon="RiErrorWarningLine"
        variant="error"
        aria-label="Error"
      />
    )
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('bg-red-600', 'text-white')
  })

  it('should apply information variant styles', () => {
    // Arrange & Act
    render(
      <IconButton
        icon="RiInformationLine"
        variant="information"
        aria-label="Info"
      />
    )
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('bg-blue-600', 'text-white')
  })

  it('should apply text variant styles', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" variant="text" aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('bg-transparent', 'text-foreground')
  })

  it('should apply circle shape (rounded-full) by default', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('rounded-full')
    expect(button).not.toHaveClass('rounded-md')
  })

  it('should apply square shape (rounded-md) when requested', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" shape="square" aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('rounded-md')
    expect(button).not.toHaveClass('rounded-full')
  })

  it('should apply circle shape (rounded-full)', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" shape="circle" aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('rounded-full')
    expect(button).not.toHaveClass('rounded-md')
  })

  it('should apply small size padding', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" size="small" aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('p-2')
  })

  it('should apply medium size padding by default', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('p-3')
  })

  it('should apply large size padding', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" size="large" aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('p-4')
  })

  it('should render icon with small size class', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" size="small" aria-label="Home" />)
    const icon = screen.getByTestId('icon-RiHomeLine')
    // Assert
    expect(icon).toHaveClass('h-4', 'w-4')
  })

  it('should render icon with medium size class', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" size="medium" aria-label="Home" />)
    const icon = screen.getByTestId('icon-RiHomeLine')
    // Assert
    expect(icon).toHaveClass('h-5', 'w-5')
  })

  it('should render icon with large size class', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" size="large" aria-label="Home" />)
    const icon = screen.getByTestId('icon-RiHomeLine')
    // Assert
    expect(icon).toHaveClass('h-6', 'w-6')
  })

  it('should show spinner and hide icon when loading', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" loading aria-label="Home" />)
    // Assert
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.queryByTestId('icon-RiHomeLine')).not.toBeInTheDocument()
  })

  it('should be disabled when loading', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" loading aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toBeDisabled()
    expect(button).toHaveClass('cursor-wait')
  })

  it('should be disabled when disabled prop is true', () => {
    // Arrange & Act
    render(<IconButton icon="RiHomeLine" disabled aria-label="Home" />)
    const button = screen.getByRole('button')
    // Assert
    expect(button).toBeDisabled()
    expect(button).toHaveClass('cursor-not-allowed', 'opacity-50')
  })

  it('should handle click events', async () => {
    // Arrange
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(
      <IconButton icon="RiHomeLine" onClick={handleClick} aria-label="Home" />
    )
    const button = screen.getByRole('button')
    // Act
    await user.click(button)
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', async () => {
    // Arrange
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(
      <IconButton
        icon="RiHomeLine"
        disabled
        onClick={handleClick}
        aria-label="Home"
      />
    )
    const button = screen.getByRole('button')
    // Act
    await user.click(button)
    // Assert
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    // Arrange & Act
    render(
      <IconButton
        icon="RiHomeLine"
        className="custom-class"
        aria-label="Home"
      />
    )
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('custom-class')
  })

  it('should pass through additional props', () => {
    // Arrange & Act
    render(
      <IconButton
        icon="RiHomeLine"
        data-testid="test-icon-button"
        aria-label="Test icon button"
      />
    )
    // Assert
    expect(screen.getByTestId('test-icon-button')).toHaveAttribute(
      'aria-label',
      'Test icon button'
    )
  })

  it('should apply circle shape with large size', () => {
    // Arrange & Act
    render(
      <IconButton
        icon="RiHomeLine"
        shape="circle"
        size="large"
        aria-label="Home"
      />
    )
    const button = screen.getByRole('button')
    // Assert
    expect(button).toHaveClass('rounded-full', 'p-4')
  })
})
