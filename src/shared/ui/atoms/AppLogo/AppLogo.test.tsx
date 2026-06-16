import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppLogo } from './AppLogo'

describe('AppLogo component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render an SVG element', () => {
    const { container } = render(<AppLogo />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should apply default color class (fill-[#0f172a])', () => {
    const { container } = render(<AppLogo />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('fill-[#0f172a]')
  })

  it('should apply white color class when color="white"', () => {
    const { container } = render(<AppLogo color="white" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('fill-white')
  })

  it('should apply medium size class by default (w-14)', () => {
    const { container } = render(<AppLogo />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-14')
  })

  it('should apply x-small size class (w-8)', () => {
    const { container } = render(<AppLogo size="x-small" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-8')
  })

  it('should apply small size class (w-10)', () => {
    const { container } = render(<AppLogo size="small" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-10')
  })

  it('should apply large size class (w-18)', () => {
    const { container } = render(<AppLogo size="large" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-18')
  })

  it('should forward extra SVG props', () => {
    const { container } = render(<AppLogo aria-label="First logo" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-label', 'First logo')
  })
})
