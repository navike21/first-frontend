import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotFoundPage } from './NotFoundPage'

const backMock = vi.fn()
const navigateMock = vi.fn().mockResolvedValue(undefined)
const routerState = vi.hoisted(() => ({ state: {} as Record<string, unknown> }))
const isAuthenticatedMock = vi.hoisted(() => ({ value: false }))

vi.mock('@/shared/model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/model')>()
  return {
    ...actual,
    useIsAuthenticated: () => isAuthenticatedMock.value,
  }
})

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useRouter: () => ({ history: { back: backMock } }),
    useNavigate: () => navigateMock,
    useRouterState: () => ({ location: { state: routerState.state } }),
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
  }
})

vi.mock('@/shared/ui', () => ({
  AppLogo: () => <svg data-testid="app-logo" />,
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
  Button: ({
    children,
    onClick,
    icon: _icon,
  }: {
    children: React.ReactNode
    onClick?: () => void
    icon?: string
  }) => <button onClick={onClick}>{children}</button>,
}))

describe('NotFoundPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routerState.state = {}
    isAuthenticatedMock.value = false
    Object.defineProperty(globalThis, 'history', {
      value: { length: 2, back: vi.fn() },
      writable: true,
    })
  })

  it('should render the 404 status code', () => {
    render(<NotFoundPage />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('should render the "Página no encontrada" heading', () => {
    render(<NotFoundPage />)
    expect(
      screen.getByRole('heading', { name: /página no encontrada/i })
    ).toBeInTheDocument()
  })

  it('should render the descriptive message', () => {
    render(<NotFoundPage />)
    expect(
      screen.getByText(/La página que buscas no existe/i)
    ).toBeInTheDocument()
  })

  it('should render the First wordmark', () => {
    render(<NotFoundPage />)
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('should show the broken URL when brokenPath is in state', () => {
    routerState.state = { brokenPath: '/configuracion/plantillass' }
    render(<NotFoundPage />)
    expect(screen.getByText('/configuracion/plantillass')).toBeInTheDocument()
  })

  it('should not show a code block when brokenPath is absent', () => {
    routerState.state = {}
    render(<NotFoundPage />)
    expect(screen.queryByRole('code')).not.toBeInTheDocument()
  })

  it('should render "Iniciar sesión" button when not authenticated', () => {
    isAuthenticatedMock.value = false
    render(<NotFoundPage />)
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('should render "Ir al inicio" button when authenticated', () => {
    isAuthenticatedMock.value = true
    render(<NotFoundPage />)
    expect(
      screen.getByRole('button', { name: /ir al inicio/i })
    ).toBeInTheDocument()
  })

  it('should navigate to login when unauthenticated and button is clicked', async () => {
    isAuthenticatedMock.value = false
    const user = userEvent.setup()
    render(<NotFoundPage />)
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/es/login',
      replace: true,
    })
  })

  it('should navigate to home when authenticated and button is clicked', async () => {
    isAuthenticatedMock.value = true
    const user = userEvent.setup()
    render(<NotFoundPage />)
    await user.click(screen.getByRole('button', { name: /ir al inicio/i }))
    expect(navigateMock).toHaveBeenCalledWith({ to: '/es', replace: true })
  })

  it('should render "Página anterior" button when history.length > 1', () => {
    render(<NotFoundPage />)
    expect(
      screen.getByRole('button', { name: /página anterior/i })
    ).toBeInTheDocument()
  })

  it('should call router.history.back() when "Página anterior" is clicked', async () => {
    const user = userEvent.setup()
    render(<NotFoundPage />)
    await user.click(screen.getByRole('button', { name: /página anterior/i }))
    expect(backMock).toHaveBeenCalledTimes(1)
  })

  it('should hide "Página anterior" button when history.length is 1', () => {
    Object.defineProperty(globalThis, 'history', {
      value: { length: 1, back: vi.fn() },
      writable: true,
    })
    render(<NotFoundPage />)
    expect(
      screen.queryByRole('button', { name: /página anterior/i })
    ).not.toBeInTheDocument()
  })

  it('catch handler does not throw when navigate rejects on home', async () => {
    navigateMock.mockRejectedValueOnce(new Error('Navigation failed'))
    const user = userEvent.setup()
    render(<NotFoundPage />)
    await expect(
      user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    ).resolves.not.toThrow()
  })
})
