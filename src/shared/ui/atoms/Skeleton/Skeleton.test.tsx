import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('is relative + overflow-hidden to host the shimmer sweep', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('relative', 'overflow-hidden')
  })

  it('renders a shimmer sweep element', () => {
    const { container } = render(<Skeleton />)
    expect((container.firstChild as HTMLElement).firstElementChild).toHaveClass('absolute')
  })

  it('uses bg-border-subtle for theming', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('bg-border-subtle')
  })

  it('defaults to text variant with rounded and h-4 classes', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('rounded', 'h-4')
  })

  it('applies circle variant with rounded-full class', () => {
    const { container } = render(<Skeleton variant="circle" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('applies rect variant with rounded-md class', () => {
    const { container } = render(<Skeleton variant="rect" />)
    expect(container.firstChild).toHaveClass('rounded-md')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-10 w-10" />)
    expect(container.firstChild).toHaveClass('w-10', 'h-10')
  })

  describe('width / height props', () => {
    it('sets width as string style', () => {
      const { container } = render(<Skeleton width="60%" />)
      expect((container.firstChild as HTMLElement).style.width).toBe('60%')
    })

    it('converts numeric width to px', () => {
      const { container } = render(<Skeleton width={120} />)
      expect((container.firstChild as HTMLElement).style.width).toBe('120px')
    })

    it('sets height as string style', () => {
      const { container } = render(<Skeleton height="2rem" />)
      expect((container.firstChild as HTMLElement).style.height).toBe('2rem')
    })

    it('converts numeric height to px', () => {
      const { container } = render(<Skeleton height={48} />)
      expect((container.firstChild as HTMLElement).style.height).toBe('48px')
    })
  })

  describe('rows prop (text variant)', () => {
    it('renders one element by default', () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild).not.toHaveClass('space-y-2')
    })

    it('renders a wrapper with N child divs when rows > 1', () => {
      const { container } = render(<Skeleton rows={3} />)
      expect(container.firstChild).toHaveClass('space-y-2')
      expect(container.firstChild?.childNodes).toHaveLength(3)
    })

    it('last row has w-3/4 when no explicit width is set', () => {
      const { container } = render(<Skeleton rows={3} />)
      const rows = container.firstChild?.childNodes
      expect(rows?.[2] as HTMLElement).toHaveClass('w-3/4')
      expect(rows?.[0] as HTMLElement).not.toHaveClass('w-3/4')
    })

    it('last row does NOT get w-3/4 when explicit width is set', () => {
      const { container } = render(<Skeleton rows={3} width="80%" />)
      const rows = container.firstChild?.childNodes
      expect(rows?.[2] as HTMLElement).not.toHaveClass('w-3/4')
    })

    it('wrapper has aria-hidden', () => {
      const { container } = render(<Skeleton rows={3} />)
      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    })

    it('applies className to the wrapper', () => {
      const { container } = render(<Skeleton rows={3} className="w-64" />)
      expect(container.firstChild).toHaveClass('w-64')
    })
  })
})
