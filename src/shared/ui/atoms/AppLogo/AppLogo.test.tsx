import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppLogo } from './AppLogo'

const { useReducedMotionMock } = vi.hoisted(() => ({
  useReducedMotionMock: vi.fn(() => false),
}))

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()
  return {
    ...actual,
    useReducedMotion: useReducedMotionMock,
  }
})

describe('AppLogo component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useReducedMotionMock.mockReturnValue(false)
  })

  it('should render an SVG element', () => {
    const { container } = render(<AppLogo />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should render the navy badge background', () => {
    const { container } = render(<AppLogo />)
    const badge = container.querySelector('rect')
    expect(badge).toHaveClass('fill-primary-950')
  })

  it('should render the ascending bars in brand colors by default', () => {
    const { container } = render(<AppLogo />)
    const bars = container.querySelectorAll('rect')
    expect(bars[1]).toHaveClass('fill-primary-800')
    expect(bars[2]).toHaveClass('fill-primary-700')
    expect(bars[3]).toHaveClass('fill-primary-600')
  })

  it('should render white bars (negative mono) when color="white"', () => {
    const { container } = render(<AppLogo color="white" />)
    const bars = container.querySelectorAll('rect')
    expect(bars[0]).toHaveClass('fill-primary-950') // badge stays navy
    expect(bars[1]).toHaveClass('fill-white')
    expect(bars[2]).toHaveClass('fill-white')
    expect(bars[3]).toHaveClass('fill-white')
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

  it('should render bars at their final position by default (no animateIn)', () => {
    const { container } = render(<AppLogo />)
    const bars = container.querySelectorAll('rect')
    expect(bars[1]).toHaveAttribute('y', '48')
    expect(bars[1]).toHaveAttribute('height', '24')
    expect(bars[3]).toHaveAttribute('y', '22')
    expect(bars[3]).toHaveAttribute('height', '50')
  })

  it('should render 3 bars when animateIn is true', () => {
    const { container } = render(<AppLogo animateIn />)
    const bars = container.querySelectorAll('rect')
    expect(bars).toHaveLength(4) // badge + 3 barras
  })

  it('should skip the animation and render final positions when prefers-reduced-motion is set', () => {
    useReducedMotionMock.mockReturnValue(true)
    const { container } = render(<AppLogo animateIn />)
    const bars = container.querySelectorAll('rect')
    expect(bars[1]).toHaveAttribute('y', '48')
    expect(bars[1]).toHaveAttribute('height', '24')
    expect(bars[3]).toHaveAttribute('y', '22')
    expect(bars[3]).toHaveAttribute('height', '50')
  })
})
