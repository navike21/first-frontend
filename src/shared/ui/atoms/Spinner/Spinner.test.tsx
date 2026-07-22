import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { Spinner } from './Spinner'

describe('Spinner', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render with default props', () => {
    // Arrange & Act
    render(<Spinner />)
    // Assert
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('w-10', 'h-10', 'animate-spin')
  })

  it('should render with small size', () => {
    // Arrange & Act
    render(<Spinner size="small" />)
    // Assert
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveClass('w-5', 'h-5')
    expect(spinner).not.toHaveClass('w-10', 'w-16')
  })

  it('should render with medium size', () => {
    // Arrange & Act
    render(<Spinner size="medium" />)
    // Assert
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveClass('w-10', 'h-10')
    expect(spinner).not.toHaveClass('w-5', 'w-16')
  })

  it('should render with large size', () => {
    // Arrange & Act
    render(<Spinner size="large" />)
    // Assert
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveClass('w-16', 'h-16')
    expect(spinner).not.toHaveClass('w-5', 'w-10')
  })

  it('should render with default variant', () => {
    // Arrange & Act
    render(<Spinner variant="default" />)
    // Assert
    const spinner = screen.getByTestId('spinner')
    const svg = spinner.querySelector('svg')
    expect(svg).toBeInTheDocument()

    const defs = svg?.querySelector('defs')
    const gradient = defs?.querySelector('linearGradient')
    expect(gradient).toBeInTheDocument()
    expect(gradient?.getAttribute('id')).toMatch(/^spinner_.*default$/)

    const stops = gradient?.querySelectorAll('stop')
    expect(stops?.[0]).toHaveAttribute('stop-color', 'var(--color-primary-600)')
    expect(stops?.[1]).toHaveAttribute('stop-color', 'var(--color-primary-600)')
  })

  it('should render with white variant', () => {
    // Arrange & Act
    render(<Spinner variant="white" />)
    // Assert
    const spinner = screen.getByTestId('spinner')
    const svg = spinner.querySelector('svg')
    expect(svg).toBeInTheDocument()

    const defs = svg?.querySelector('defs')
    const gradient = defs?.querySelector('linearGradient')
    expect(gradient).toBeInTheDocument()
    expect(gradient?.getAttribute('id')).toMatch(/^spinner_.*white$/)

    const stops = gradient?.querySelectorAll('stop')
    expect(stops?.[0]).toHaveAttribute('stop-color', '#f9f3f4')
    expect(stops?.[1]).toHaveAttribute('stop-color', '#f9f3f4')
  })

  it('should render with gradient variant', () => {
    // Arrange & Act
    render(<Spinner variant="gradient" />)
    // Assert
    const spinner = screen.getByTestId('spinner')
    const svg = spinner.querySelector('svg')
    expect(svg).toBeInTheDocument()

    const defs = svg?.querySelector('defs')
    const gradient = defs?.querySelector('linearGradient')
    expect(gradient).toBeInTheDocument()
    expect(gradient?.getAttribute('id')).toMatch(/^spinner_.*gradient$/)

    const stops = gradient?.querySelectorAll('stop')
    expect(stops?.[0]).toHaveAttribute('stop-color', 'var(--color-primary-600)')
    expect(stops?.[1]).toHaveAttribute('stop-color', 'var(--color-primary-600)')
  })

  it('should generate unique gradient IDs for different instances', () => {
    // Arrange
    const { rerender } = render(<Spinner variant="default" />)
    const firstSpinner = screen.getByTestId('spinner')
    const firstGradientId = firstSpinner
      .querySelector('linearGradient')
      ?.getAttribute('id')
    // Act
    rerender(<Spinner variant="white" />)
    // Assert
    const secondSpinner = screen.getByTestId('spinner')
    const secondGradientId = secondSpinner
      .querySelector('linearGradient')
      ?.getAttribute('id')

    expect(firstGradientId).not.toBe(secondGradientId)
    expect(firstGradientId).toMatch(/^spinner_.*default$/)
    expect(secondGradientId).toMatch(/^spinner_.*white$/)
  })

  it('should render SVG with correct structure', () => {
    // Arrange & Act
    render(<Spinner />)
    // Assert
    const svg = screen.getByTestId('spinner').querySelector('svg')
    expect(svg).toHaveAttribute('viewBox', '0 0 32 32')
    expect(svg).toHaveAttribute('fill', 'none')

    const paths = svg?.querySelectorAll('path')
    expect(paths).toHaveLength(2)

    const defs = svg?.querySelector('defs')
    expect(defs).toBeInTheDocument()

    const gradient = defs?.querySelector('linearGradient')
    expect(gradient).toBeInTheDocument()
    expect(gradient?.getAttribute('gradientUnits')).toBe('userSpaceOnUse')
  })

  it('should apply correct fill classes for background path', () => {
    // Arrange
    const { rerender } = render(<Spinner variant="default" />)
    // Assert default
    let path = screen.getByTestId('spinner').querySelector('svg path')
    expect(path).toHaveClass('fill-border-control')
    // Assert white
    rerender(<Spinner variant="white" />)
    path = screen.getByTestId('spinner').querySelector('svg path')
    expect(path).toHaveClass('fill-slate-50/10')
    // Assert gradient
    rerender(<Spinner variant="gradient" />)
    path = screen.getByTestId('spinner').querySelector('svg path')
    expect(path).toHaveClass('fill-border-control')
  })

  it('should have correct accessibility attributes', () => {
    // Arrange & Act
    render(<Spinner />)
    // Assert
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveAttribute('data-testid', 'spinner')
  })

  it('should apply transition classes', () => {
    // Arrange & Act
    render(<Spinner />)
    // Assert
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveClass(
      'transition-all',
      'ease-out-expo',
      'duration-fast'
    )
  })
})
