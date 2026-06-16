import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSessionStore } from '@/shared/model'
import type { AuthUser } from '@/shared/types'

// Override constants to include recent activity items — covers line 55
vi.mock('../lib/dashboard.constants', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../lib/dashboard.constants')>()
  return {
    ...actual,
    RECENT_ACTIVITY: [
      { timestamp: '2024-01-01 10:00', text: 'Usuario creado' },
      { timestamp: '2024-01-01 11:00', text: 'Configuración actualizada' },
    ],
  }
})

import { DashboardPage } from './DashboardPage'

const makeUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: 'u-1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@navike21.com',
  permissions: [],
  ...overrides,
})

describe('DashboardPage component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useSessionStore.setState({
      isAuthenticated: false,
      token: null,
      user: null,
    })
  })

  it('renders welcome heading with user name when session exists', () => {
    useSessionStore.setState({
      isAuthenticated: true,
      token: 'tok',
      user: makeUser({ firstName: 'María', lastName: 'García' }),
    })
    render(<DashboardPage />)
    expect(
      screen.getByRole('heading', { name: /Bienvenido, María/i })
    ).toBeInTheDocument()
  })

  it('renders welcome heading without name when no session', () => {
    render(<DashboardPage />)
    expect(
      screen.getByRole('heading', { name: /Bienvenido/i })
    ).toBeInTheDocument()
  })

  it('renders the KPI summary section', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('region', { name: /Resumen/i })).toBeInTheDocument()
  })

  it('renders the three KPI labels', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Servicios')).toBeInTheDocument()
  })

  it('renders the recent activity section', () => {
    render(<DashboardPage />)
    expect(
      screen.getByRole('region', { name: /Actividad reciente/i })
    ).toBeInTheDocument()
  })

  it('renders recent activity items list', () => {
    // Covers line 55: RECENT_ACTIVITY.map((item) => <li key={item.timestamp}>
    render(<DashboardPage />)
    expect(screen.getByText('Usuario creado')).toBeInTheDocument()
    expect(screen.getByText('Configuración actualizada')).toBeInTheDocument()
  })
})
