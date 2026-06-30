import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { LinkButton } from './LinkButton'

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router'
  )
  return {
    ...actual,
    Link: ({
      href,
      to,
      className,
      children,
      ...rest
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }) => (
      <a href={href ?? to} className={className} {...rest}>
        {children}
      </a>
    ),
  }
})

describe('LinkButton component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render children correctly', () => {
    // Arrange & Act
    render(<LinkButton href="/test">Click me</LinkButton>)
    // Assert
    expect(screen.getByRole('link', { name: /click me/i })).toBeInTheDocument()
  })

  it('should have correct href attribute', () => {
    render(<LinkButton href="/test-page">Link</LinkButton>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/test-page')
  })

  it('should apply primary variant styles by default', () => {
    render(<LinkButton href="/test">Primary Button</LinkButton>)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('bg-primary-700', 'text-white')
  })

  it('should apply secondary variant styles', () => {
    render(
      <LinkButton href="/test" variant="secondary">
        Secondary Button
      </LinkButton>
    )
    const link = screen.getByRole('link')
    expect(link).toHaveClass(
      'bg-surface',
      'text-primary-700',
      'ring-1',
      'ring-primary-700',
      'ring-inset'
    )
  })

  it('should apply correct size classes', () => {
    const { rerender } = render(
      <LinkButton href="/test" size="small">
        Small
      </LinkButton>
    )
    let link = screen.getByRole('link')
    expect(link).toHaveClass('px-6', 'py-3', 'text-xs')

    rerender(
      <LinkButton href="/test" size="medium">
        Medium
      </LinkButton>
    )
    link = screen.getByRole('link')
    expect(link).toHaveClass('px-8', 'py-3.5', 'text-sm')

    rerender(
      <LinkButton href="/test" size="large">
        Large
      </LinkButton>
    )
    link = screen.getByRole('link')
    expect(link).toHaveClass('px-10', 'py-4', 'text-md')
  })

  it('should apply custom className', () => {
    render(
      <LinkButton href="/test" className="custom-class">
        Button
      </LinkButton>
    )
    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })

  it('should pass through additional props', () => {
    render(
      <LinkButton href="/test" data-testid="test-link" aria-label="Test link">
        Button
      </LinkButton>
    )
    const link = screen.getByTestId('test-link')
    expect(link).toHaveAttribute('aria-label', 'Test link')
  })

  it('should render with icon when provided', () => {
    render(
      <LinkButton href="/test" icon="RiHomeLine">
        With Icon
      </LinkButton>
    )
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
  })

  it('should have base link classes', () => {
    render(<LinkButton href="/test">Button</LinkButton>)
    const link = screen.getByRole('link')
    expect(link).toHaveClass(
      'cursor-pointer',
      'duration-fast',
      'ease-out-expo',
      'font-medium',
      'rounded-md'
    )
  })

  it('should apply hover classes based on variant', () => {
    const { rerender } = render(
      <LinkButton href="/test" variant="primary">
        Primary
      </LinkButton>
    )
    let link = screen.getByRole('link')
    expect(link).toHaveClass('hover:bg-primary-800')

    rerender(
      <LinkButton href="/test" variant="secondary">
        Secondary
      </LinkButton>
    )
    link = screen.getByRole('link')
    expect(link).toHaveClass('hover:bg-primary-700/10')
  })

  it('should render icon with correct size classes', () => {
    const { container, rerender } = render(
      <LinkButton href="/test" icon="RiHomeLine" size="small">
        Small
      </LinkButton>
    )
    let iconSvg = container.querySelector('svg')
    expect(iconSvg).toHaveClass('w-4', 'h-4')

    rerender(
      <LinkButton href="/test" icon="RiHomeLine" size="medium">
        Medium
      </LinkButton>
    )
    iconSvg = container.querySelector('svg')
    expect(iconSvg).toHaveClass('w-5', 'h-5')

    rerender(
      <LinkButton href="/test" icon="RiHomeLine" size="large">
        Large
      </LinkButton>
    )
    iconSvg = container.querySelector('svg')
    expect(iconSvg).toHaveClass('w-6', 'h-6')
  })

  it('should not render icon when not provided', () => {
    const { container } = render(<LinkButton href="/test">No Icon</LinkButton>)
    const iconSvg = container.querySelector('svg')
    expect(iconSvg).not.toBeInTheDocument()
  })
})
