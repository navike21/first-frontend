import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Sidebar } from './Sidebar'
import { useSidebarStore } from '../model/store'

const { pathnameMock } = vi.hoisted(() => ({
  pathnameMock: { value: '/es/usuarios' },
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({
      to,
      className,
      children,
      title,
      onClick,
    }: {
      to: string
      className?: string
      children?: React.ReactNode
      title?: string
      onClick?: () => void
    }) => (
      <a href={to} className={className} title={title} onClick={onClick}>
        {children}
      </a>
    ),
    useRouterState: () => ({ location: { pathname: pathnameMock.value } }),
  }
})

vi.mock('@/shared/ui', () => ({
  IconComponent: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} className={className} />
  ),
  Accordion: ({
    title,
    icon,
    children,
    isOpen,
    onToggle,
  }: {
    title: string
    icon?: React.ReactNode
    children: React.ReactNode
    isOpen: boolean
    onToggle: () => void
  }) => (
    <div>
      <button onClick={onToggle} data-open={isOpen}>
        {icon}
        {title}
      </button>
      {isOpen && <div data-testid="accordion-content">{children}</div>}
    </div>
  ),
  AppLogo: () => <svg data-testid="app-logo" />,
  Drawer: ({
    children,
    title,
    isOpen,
    onClose,
    className,
  }: {
    children: React.ReactNode
    title?: React.ReactNode
    isOpen: boolean
    onClose: () => void
    className?: string
  }) => (
    <div data-testid="drawer" className={className} data-open={isOpen}>
      {title}
      <button onClick={onClose} aria-label="close-drawer">Close</button>
      {children}
    </div>
  ),
  NavItem: ({ label, to, isActive }: { label: string; to?: string; isActive?: boolean }) => (
    <a href={to ?? '#'} data-testid={`nav-item-${label}`} data-active={String(isActive)}>{label}</a>
  ),
}))

// Menu with: a direct item (href defined), an accordion item, and an item with no href (triggers ?? '/' fallback)
vi.mock('../model/menu.config', () => ({
  getMenuConfig: () => [
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: 'RiTeamLine',
      href: '/es/usuarios',
      exact: false,
    },
    {
      id: 'gestion',
      label: 'Gestión',
      icon: 'RiGroupLine',
      href: '/es/gestion',
      exact: false,
      children: [
        { id: 'gestion-a', label: 'Sub A', href: '/es/gestion/a' },
        { id: 'gestion-b', label: 'Sub B', href: '/es/gestion/b' },
      ],
    },
    {
      id: 'no-href-item',
      label: 'Sin Href',
      icon: 'RiSettings3Line',
      exact: false,
      // no href — triggers item.href ?? '/' fallback on lines 51 and 118
    },
  ],
}))

describe('Sidebar active-state branches', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    pathnameMock.value = '/es/usuarios'
    useSidebarStore.setState({ isCollapsed: false, isOpenMobile: false })
  })

  it('passes isActive=true to NavItem when route matches item href', () => {
    render(<Sidebar />)
    expect(screen.getByTestId('nav-item-Usuarios')).toHaveAttribute('data-active', 'true')
  })

  it('passes isActive=false to NavItem when route does not match', () => {
    pathnameMock.value = '/es/otros'
    render(<Sidebar />)
    expect(screen.getByTestId('nav-item-Usuarios')).toHaveAttribute('data-active', 'false')
  })

  it('renders NavItem with to=/ when item has no href (line 118 ?? fallback)', () => {
    render(<Sidebar />)
    // The no-href item renders as NavItem with to='/' (undefined ?? '/')
    expect(screen.getByTestId('nav-item-Sin Href')).toHaveAttribute('href', '/')
  })

  describe('collapsed mode (lines 47-65)', () => {
    beforeEach(() => {
      useSidebarStore.setState({ isCollapsed: true, isOpenMobile: false })
    })

    it('renders collapsed icon-only link for item with href', () => {
      render(<Sidebar />)
      // In collapsed mode, items render as <Link to={item.href}>
      const link = screen.getByTitle('Usuarios')
      expect(link).toHaveAttribute('href', '/es/usuarios')
    })

    it('applies active bg class to collapsed item when isItemActive=true', () => {
      pathnameMock.value = '/es/usuarios'
      const { container } = render(<Sidebar />)
      const activeLinks = container.querySelectorAll('a.bg-\\(--surface-subtle\\)')
      expect(activeLinks.length).toBeGreaterThan(0)
    })

    it('renders accordion item in collapsed mode using item href', () => {
      render(<Sidebar />)
      const gestionLink = screen.getByTitle('Gestión')
      expect(gestionLink).toHaveAttribute('href', '/es/gestion')
    })

    it('renders no-href item in collapsed mode with href=/ (line 51 ?? fallback)', () => {
      render(<Sidebar />)
      // The no-href item in collapsed mode: <Link to={undefined ?? '/'} title="Sin Href">
      const link = screen.getByTitle('Sin Href')
      expect(link).toHaveAttribute('href', '/')
    })
  })

  describe('accordion with active parent and active child (lines 67-111)', () => {
    beforeEach(() => {
      // /es/gestion/a matches gestion.children[0].href and parent /es/gestion
      pathnameMock.value = '/es/gestion/a'
      useSidebarStore.setState({ isCollapsed: false, isOpenMobile: false })
    })

    it('renders accordion with active icon color (line 77)', () => {
      render(<Sidebar />)
      const icon = screen.getByTestId('icon-RiGroupLine')
      expect(icon).toHaveClass('text-(--text-primary)')
    })

    it('renders active child with active classes (lines 97-100)', () => {
      render(<Sidebar />)
      const content = screen.getByTestId('accordion-content')
      // Sub A is at /es/gestion/a — matches pathname → isChildActive=true
      const subALink = Array.from(content.querySelectorAll('a')).find(
        (a) => a.getAttribute('href') === '/es/gestion/a'
      )
      expect(subALink).toBeDefined()
      expect(subALink?.className).toContain('font-semibold')
    })

    it('renders inactive child without active classes (line 97 false branch)', () => {
      render(<Sidebar />)
      const content = screen.getByTestId('accordion-content')
      // Sub B is at /es/gestion/b — does NOT match pathname → isChildActive=false
      const subBLink = Array.from(content.querySelectorAll('a')).find(
        (a) => a.getAttribute('href') === '/es/gestion/b'
      )
      expect(subBLink).toBeDefined()
      expect(subBLink?.className).toContain('text-(--text-secondary)')
    })
  })
})
