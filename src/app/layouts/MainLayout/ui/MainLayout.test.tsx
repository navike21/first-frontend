import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MainLayout } from './MainLayout'

vi.mock('@/widgets/Header', () => ({
  Header: () => <header data-testid="header" />,
}))

vi.mock('@/widgets/Sidebar', () => ({
  Sidebar: () => <aside data-testid="sidebar" />,
}))

vi.mock('@/widgets/Footer', () => ({
  Footer: () => <footer data-testid="footer" />,
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Outlet: () => <main data-testid="outlet" />,
    useRouterState: () => ({ location: { pathname: '/es/usuarios' } }),
  }
})

vi.mock('@/shared/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/ui')>()
  return {
    ...actual,
    Breadcrumbs: ({ items }: { items: { label: string }[] }) => (
      <nav data-testid="breadcrumbs" aria-label="breadcrumb">
        {items.map((i) => <span key={i.label}>{i.label}</span>)}
      </nav>
    ),
  }
})

describe('MainLayout component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the Header', () => {
    // Arrange & Act
    render(<MainLayout />)
    // Assert
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('should render the Sidebar', () => {
    // Arrange & Act
    render(<MainLayout />)
    // Assert
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  it('should render the Footer', () => {
    // Arrange & Act
    render(<MainLayout />)
    // Assert
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('should render the Outlet', () => {
    // Arrange & Act
    render(<MainLayout />)
    // Assert
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('should render Breadcrumbs when path has more than one segment', () => {
    // Arrange — router mock returns /es/usuarios which has 2 segments → showBreadcrumbs=true
    render(<MainLayout />)
    // Assert
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
  })
})
