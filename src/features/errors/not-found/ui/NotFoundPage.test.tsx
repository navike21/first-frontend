import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotFoundPage } from './NotFoundPage'

const backMock = vi.fn()
const navigateMock = vi.fn().mockResolvedValue(undefined)
const routerState = vi.hoisted(() => ({ state: {} as Record<string, unknown> }))

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
    }) => <a href={to} className={className}>{children}</a>,
  }
})

vi.mock('@/shared/ui', () => ({
  AppLogo: () => <svg data-testid="app-logo" />,
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
    expect(screen.getByText(/La página que buscas no existe/i)).toBeInTheDocument()
  })

  it('should render the app logo', () => {
    render(<NotFoundPage />)
    expect(screen.getByTestId('app-logo')).toBeInTheDocument()
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

  it('should always render the home button', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('button', { name: /ir al inicio/i })).toBeInTheDocument()
  })

  it('should navigate to / with replace:true when "Ir al inicio" is clicked', async () => {
    const user = userEvent.setup()
    render(<NotFoundPage />)
    await user.click(screen.getByRole('button', { name: /ir al inicio/i }))
    expect(navigateMock).toHaveBeenCalledWith({ to: '/es', replace: true })
  })

  it('should render "Página anterior" button when history.length > 1', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeInTheDocument()
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
    expect(screen.queryByRole('button', { name: /página anterior/i })).not.toBeInTheDocument()
  })
})
