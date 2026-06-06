import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ForbiddenPage } from './ForbiddenPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    className,
    children,
  }: {
    to?: string
    className?: string
    children: React.ReactNode
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

vi.mock('@/shared/ui', () => ({
  AppLogo: () => <svg data-testid="app-logo" />,
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
  LinkButton: ({
    children,
    href,
    variant,
  }: {
    children: React.ReactNode
    href?: string
    variant?: string
  }) => (
    <a href={href} data-variant={variant}>
      {children}
    </a>
  ),
}))

describe('ForbiddenPage component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the 403 status code', () => {
    // Arrange & Act
    render(<ForbiddenPage />)
    // Assert
    expect(screen.getByText('403')).toBeInTheDocument()
  })

  it('should render the "Acceso restringido" heading', () => {
    // Arrange & Act
    render(<ForbiddenPage />)
    // Assert
    expect(
      screen.getByRole('heading', { name: /acceso restringido/i })
    ).toBeInTheDocument()
  })

  it('should render the descriptive message', () => {
    // Arrange & Act
    render(<ForbiddenPage />)
    // Assert
    expect(screen.getByText(/No tienes una sesión activa/i)).toBeInTheDocument()
  })

  it('should render the app logo', () => {
    // Arrange & Act
    render(<ForbiddenPage />)
    // Assert
    expect(screen.getByTestId('app-logo')).toBeInTheDocument()
  })

  it('should render the login link button', () => {
    // Arrange & Act
    render(<ForbiddenPage />)
    // Assert
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument()
  })
})
