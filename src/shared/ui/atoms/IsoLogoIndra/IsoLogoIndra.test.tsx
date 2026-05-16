import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IsoLogoIndra } from './IsoLogoIndra'

describe('IsoLogoIndra component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render an SVG element', () => {
    // Arrange & Act
    const { container } = render(<IsoLogoIndra />)
    // Assert
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should apply default color class (fill-[#002532])', () => {
    // Arrange & Act
    const { container } = render(<IsoLogoIndra />)
    // Assert
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('fill-[#002532]')
  })

  it('should apply white color class when color="white"', () => {
    // Arrange & Act
    const { container } = render(<IsoLogoIndra color="white" />)
    // Assert
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('fill-white')
  })

  it('should apply medium size class by default (w-14)', () => {
    // Arrange & Act
    const { container } = render(<IsoLogoIndra />)
    // Assert
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-14')
  })

  it('should apply x-small size class (w-8)', () => {
    // Arrange & Act
    const { container } = render(<IsoLogoIndra size="x-small" />)
    // Assert
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-8')
  })

  it('should apply small size class (w-10)', () => {
    // Arrange & Act
    const { container } = render(<IsoLogoIndra size="small" />)
    // Assert
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-10')
  })

  it('should apply large size class (w-18)', () => {
    // Arrange & Act
    const { container } = render(<IsoLogoIndra size="large" />)
    // Assert
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-18')
  })

  it('should forward extra SVG props', () => {
    // Arrange & Act
    const { container } = render(<IsoLogoIndra aria-label="Indra logo" />)
    // Assert
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-label', 'Indra logo')
  })
})
