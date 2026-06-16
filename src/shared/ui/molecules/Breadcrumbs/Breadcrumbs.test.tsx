import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({
      to,
      children,
      className,
    }: {
      to: string
      children: ReactNode
      className?: string
    }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  }
})

import { Breadcrumbs } from './Breadcrumbs'
import type { BreadcrumbItem } from './Breadcrumbs.types'

describe('Breadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null when items array is empty', () => {
    // Arrange & Act
    const { container } = render(<Breadcrumbs items={[]} />)
    // Assert
    expect(container.firstChild).toBeNull()
  })

  it('should render a nav element with aria-label "breadcrumb"', () => {
    // Arrange
    const items: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert
    expect(
      screen.getByRole('navigation', { name: 'breadcrumb' })
    ).toBeInTheDocument()
  })

  it('should render the last item as a span (current page, not a link)', () => {
    // Arrange
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' },
      { label: 'Configuración' },
    ]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert
    expect(screen.queryByRole('link', { name: /Configuración/i })).toBeNull()
    expect(screen.getByText('Configuración').tagName).toBe('SPAN')
  })

  it('should render non-last items as links with correct hrefs', () => {
    // Arrange
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' },
      { label: 'Configuración', href: '/configuracion' },
      { label: 'Plantillas' },
    ]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert
    expect(screen.getByRole('link', { name: /Inicio/i })).toHaveAttribute(
      'href',
      '/'
    )
    expect(
      screen.getByRole('link', { name: /Configuración/i })
    ).toHaveAttribute('href', '/configuracion')
  })

  it('should render the correct number of list items', () => {
    // Arrange
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' },
      { label: 'Configuración', href: '/configuracion' },
      { label: 'Plantillas' },
    ]
    // Act
    const { container } = render(<Breadcrumbs items={items} />)
    // Assert
    expect(container.querySelectorAll('li')).toHaveLength(3)
  })

  it('should render separator icons between items', () => {
    // Arrange
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' },
      { label: 'Configuración' },
    ]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert
    expect(screen.getByTestId('icon-RiArrowRightSLine')).toBeInTheDocument()
  })

  it('should not render any separator when there is only one item', () => {
    // Arrange
    const items: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert
    expect(screen.queryByTestId('icon-RiArrowRightSLine')).toBeNull()
  })

  it('should render the icon when the item has an icon prop', () => {
    // Arrange
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/', icon: 'RiHomeLine' },
    ]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert
    expect(screen.getByTestId('icon-RiHomeLine')).toBeInTheDocument()
  })

  it('should render separators for N-1 pairs when there are multiple items', () => {
    // Arrange
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' },
      { label: 'Configuración', href: '/configuracion' },
      { label: 'Plantillas' },
    ]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert — 3 items → 2 separators
    expect(screen.getAllByTestId('icon-RiArrowRightSLine')).toHaveLength(2)
  })

  it('should render a single item as a span (current page)', () => {
    // Arrange
    const items: BreadcrumbItem[] = [{ label: 'Inicio' }]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert
    expect(screen.getByText('Inicio').tagName).toBe('SPAN')
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('should render icon in non-last BreadcrumbLink', () => {
    // Arrange — covers icon branch in BreadcrumbLink (lines 8-16)
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/', icon: 'RiHomeLine' },
      { label: 'Subsección' },
    ]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert
    expect(screen.getByTestId('icon-RiHomeLine')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Inicio/i })).toBeInTheDocument()
  })

  it('should use / as href fallback when non-last item has no href', () => {
    // Arrange — covers href ?? '/' branch in BreadcrumbLink
    const items: BreadcrumbItem[] = [
      { label: 'Inicio' },
      { label: 'Subsección' },
    ]
    // Act
    render(<Breadcrumbs items={items} />)
    // Assert
    expect(screen.getByRole('link', { name: /Inicio/i })).toHaveAttribute(
      'href',
      '/'
    )
  })
})
