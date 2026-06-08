import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Sidebar } from './Sidebar'
import { useSidebarStore } from '../model/store'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({
      to,
      className,
      children,
      onClick,
    }: {
      to: string
      className?: string
      children: React.ReactNode
      onClick?: () => void
    }) => (
      <a href={to} className={className} onClick={onClick}>
        {children}
      </a>
    ),
    useRouterState: () => ({ location: { pathname: '/es' } }),
  }
})

vi.mock('@/shared/ui', () => ({
  IconComponent: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} className={className} />
  ),
  Accordion: ({
    title,
    children,
    isOpen,
    onToggle,
  }: {
    title: string
    children: React.ReactNode
    isOpen: boolean
    onToggle: () => void
  }) => (
    <div>
      <button onClick={onToggle} data-open={isOpen}>
        {title}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  ),
  AppLogo: () => <svg data-testid="app-logo" />,
  Drawer: ({
    children,
    title,
    isOpen,
    onClose,
  }: {
    children: React.ReactNode
    title?: React.ReactNode
    isOpen: boolean
    onClose: () => void
  }) => (
    <div data-testid="drawer" data-open={isOpen}>
      {title}
      <button onClick={onClose} aria-label="close-drawer">Close</button>
      {children}
    </div>
  ),
  NavItem: ({ label, to }: { label: string; to?: string }) => (
    <a href={to ?? '#'} data-testid={`nav-item-${label}`}>{label}</a>
  ),
}))

// Mock menu config to include an item WITH children
vi.mock('../model/menu.config', () => ({
  getMenuConfig: () => [
    {
      id: 'manage',
      label: 'Gestión',
      icon: 'RiGroupLine',
      children: [
        { id: 'users-list', label: 'Listado', href: '/es/usuarios' },
        { id: 'users-new', label: 'Nuevo', href: '/es/usuarios/nuevo' },
      ],
    },
  ],
}))

describe('Sidebar accordion children (lines 68-88)', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useSidebarStore.setState({ isCollapsed: false, isOpenMobile: false })
  })

  it('renders accordion for menu item with children', () => {
    render(<Sidebar />)
    expect(screen.getByText('Gestión')).toBeInTheDocument()
  })

  it('shows child links when accordion is open', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    // The accordion opens when openMenuId matches the item id
    // openMenuId is initialized based on active route — /es matches nothing in this mock
    // Click to open it
    await user.click(screen.getByRole('button', { name: 'Gestión' }))
    expect(screen.getByText('Listado')).toBeInTheDocument()
    expect(screen.getByText('Nuevo')).toBeInTheDocument()
  })

  it('child links have correct hrefs', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    await user.click(screen.getByRole('button', { name: 'Gestión' }))
    expect(screen.getByRole('link', { name: 'Listado' })).toHaveAttribute('href', '/es/usuarios')
  })
})
