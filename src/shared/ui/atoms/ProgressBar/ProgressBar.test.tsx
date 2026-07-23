import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('should render with role="progressbar"', () => {
    // Arrange & Act
    render(<ProgressBar value={50} />)
    // Assert
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should set aria-valuenow to the given value', () => {
    // Arrange & Act
    render(<ProgressBar value={42} />)
    // Assert
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42')
  })

  it('should set aria-valuemin and aria-valuemax to 0 and 100', () => {
    // Arrange & Act
    render(<ProgressBar value={42} />)
    const bar = screen.getByRole('progressbar')
    // Assert
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('should render the fill at the given width', () => {
    // Arrange & Act
    render(<ProgressBar value={30} />)
    const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement
    // Assert
    expect(fill).toHaveStyle({ width: '30%' })
  })

  it('should clamp a value above 100 down to 100', () => {
    // Arrange & Act
    render(<ProgressBar value={150} />)
    const bar = screen.getByRole('progressbar')
    // Assert
    expect(bar).toHaveAttribute('aria-valuenow', '100')
  })

  it('should clamp a negative value up to 0', () => {
    // Arrange & Act
    render(<ProgressBar value={-10} />)
    const bar = screen.getByRole('progressbar')
    // Assert
    expect(bar).toHaveAttribute('aria-valuenow', '0')
  })

  it('should apply custom className to root element', () => {
    // Arrange & Act
    render(<ProgressBar value={50} className="my-custom-class" />)
    // Assert
    expect(screen.getByRole('progressbar')).toHaveClass('my-custom-class')
  })
})
