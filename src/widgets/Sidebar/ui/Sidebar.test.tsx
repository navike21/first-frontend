import { render, screen } from '@testing-library/react'
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
    useRouterState: () => ({ location: { pathname: '/' } }),
  }
})

vi.mock('@/shared/ui', () => ({
  IconComponent: ({
    icon,
    className,
  }: {
    icon: string
    className?: string
  }) => <span data-testid={`icon-${icon}`} className={className} />,
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
      <button onClick={onClose} aria-label="close-drawer">
        Close
      </button>
      {children}
    </div>
  ),
  NavItem: ({
    label,
    icon: _icon,
    to,
  }: {
    label: string
    icon: string
    to?: string
  }) => (
    <a href={to ?? '#'} data-testid={`nav-item-${label}`}>
      {label}
    </a>
  ),
}))

describe('Sidebar component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useSidebarStore.setState({ isCollapsed: false, isOpenMobile: false })
  })

  it('should render the drawer', () => {
    // Arrange & Act
    render(<Sidebar />)
    // Assert
    expect(screen.getByTestId('drawer')).toBeInTheDocument()
  })

  it('should render the title with "Menú" text', () => {
    // Arrange & Act
    render(<Sidebar />)
    // Assert
    expect(screen.getByText('Menú')).toBeInTheDocument()
  })

  it('should render navigation from menuConfig', () => {
    // Arrange & Act
    render(<Sidebar />)
    // Assert
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('should render collapsed icon-only view when isCollapsed is true and isOpenMobile is false', () => {
    // Arrange
    useSidebarStore.setState({ isCollapsed: true, isOpenMobile: false })
    // Act
    render(<Sidebar />)
    // Assert
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('should pass isOpen=false to drawer when isOpenMobile is false', () => {
    // Arrange & Act
    render(<Sidebar />)
    // Assert
    expect(screen.getByTestId('drawer')).toHaveAttribute('data-open', 'false')
  })

  it('should pass isOpen=true to drawer when isOpenMobile is true', () => {
    // Arrange
    useSidebarStore.setState({ isOpenMobile: true, isCollapsed: false })
    // Act
    render(<Sidebar />)
    // Assert
    expect(screen.getByTestId('drawer')).toHaveAttribute('data-open', 'true')
  })
})
