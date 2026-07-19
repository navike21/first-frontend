import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrandMark } from './BrandMark'

describe('BrandMark component', () => {
  it('should render the icon and the "First" wordmark', () => {
    const { container } = render(<BrandMark />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('should mark the icon as decorative (aria-hidden)', () => {
    const { container } = render(<BrandMark />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('should apply the text size matching each size', () => {
    render(<BrandMark size="x-small" />)
    expect(screen.getByText('First')).toHaveClass('text-xl')
  })

  it('should switch to white text when color="white"', () => {
    render(<BrandMark color="white" />)
    expect(screen.getByText('First')).toHaveClass('text-white')
  })

  it('should use foreground text by default', () => {
    render(<BrandMark />)
    expect(screen.getByText('First')).toHaveClass('text-foreground')
  })

  it('should forward className to the wrapper', () => {
    const { container } = render(<BrandMark className="custom-class" />)
    expect(container.firstElementChild).toHaveClass('custom-class')
  })
})
