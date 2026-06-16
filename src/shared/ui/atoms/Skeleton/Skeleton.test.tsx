import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies animate-pulse class', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('defaults to text variant with rounded class', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('rounded')
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
})
