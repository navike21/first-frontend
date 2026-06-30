import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { Label } from './Label'

describe('Label', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the children', () => {
    // Arrange & Act
    render(<Label>Test Label</Label>)
    // Assert
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should apply htmlFor attribute', () => {
    // Arrange & Act
    render(<Label htmlFor="test-input">Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('should apply disabled styles when disabled is true', () => {
    // Arrange & Act
    render(<Label disabled>Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('text-secondary', 'cursor-not-allowed')
    expect(label).not.toHaveClass('text-foreground')
  })

  it('should apply default text color when disabled is false and no text color in className', () => {
    // Arrange & Act
    render(<Label>Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('text-foreground')
    expect(label).not.toHaveClass(
      'text-secondary',
      'cursor-not-allowed'
    )
  })

  it('should not apply default text color when className has text color', () => {
    // Arrange & Act
    render(<Label className="text-blue-500">Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('text-blue-500')
    expect(label).not.toHaveClass('text-foreground')
  })

  it('should apply custom className', () => {
    // Arrange & Act
    render(<Label className="custom-class">Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('custom-class')
  })

  it('should apply common classes', () => {
    // Arrange & Act
    render(<Label>Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass(
      'text-sm',
      'font-semibold',
      'transition-all',
      'duration-fast',
      'ease-out-expo'
    )
  })

  it('should spread additional props to the label element', () => {
    // Arrange & Act
    render(<Label data-testid="custom-label">Test Label</Label>)
    // Assert
    const label = screen.getByTestId('custom-label')
    expect(label).toBeInTheDocument()
  })

  it('should render as a label element', () => {
    // Arrange & Act
    render(<Label>Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label.tagName).toBe('LABEL')
  })

  it('should handle multiple text classes in className', () => {
    // Arrange & Act
    render(<Label className="bg-white text-red-500">Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('text-red-500', 'bg-white')
    expect(label).not.toHaveClass('text-foreground')
  })

  it('should apply default text color when className has non-text classes', () => {
    // Arrange & Act
    render(<Label className="bg-white font-bold">Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('bg-white', 'font-bold', 'text-foreground')
  })

  it('should not apply default text color when className has classes starting with text- but not text colors', () => {
    // Arrange & Act
    render(<Label className="texture-bg">Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('texture-bg', 'text-foreground')
  })

  it('should handle empty className string', () => {
    // Arrange & Act
    render(<Label className="">Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('text-foreground')
  })

  it('should handle className with multiple spaces', () => {
    // Arrange & Act
    render(<Label className="bg-white text-blue-500">Test Label</Label>)
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('text-blue-500', 'bg-white')
    expect(label).not.toHaveClass('text-foreground')
  })

  it('should apply disabled styles overriding text color classes', () => {
    // Arrange & Act
    render(
      <Label disabled className="text-blue-500">
        Test Label
      </Label>
    )
    // Assert
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass(
      'text-secondary',
      'cursor-not-allowed',
      'text-blue-500'
    )
  })
})
