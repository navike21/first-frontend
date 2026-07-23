import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSessionStore } from '@/shared/model'
import type { AuthUser } from '@/shared/types'

const { useDashboardDataMock } = vi.hoisted(() => ({
  useDashboardDataMock: vi.fn(),
}))

vi.mock('./DashboardPage.hooks', () => ({
  useDashboardData: useDashboardDataMock,
}))

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
    useDashboardDataMock.mockReturnValue({
      kpiCards: [
        { key: 'clients', value: '--', icon: 'RiBuilding4Line' },
        { key: 'users', value: '--', icon: 'RiTeamLine' },
        { key: 'services', value: '--', icon: 'RiBriefcaseLine' },
      ],
      recentActivity: [],
    })
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

  it('renders a real KPI count when the hook provides one', () => {
    useDashboardDataMock.mockReturnValue({
      kpiCards: [
        { key: 'clients', value: 42, icon: 'RiBuilding4Line' },
        { key: 'users', value: '--', icon: 'RiTeamLine' },
        { key: 'services', value: '--', icon: 'RiBriefcaseLine' },
      ],
      recentActivity: [],
    })
    render(<DashboardPage />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders the recent activity section', () => {
    render(<DashboardPage />)
    expect(
      screen.getByRole('region', { name: /Actividad reciente/i })
    ).toBeInTheDocument()
  })

  it('renders no-recent-activity message when the hook returns no activity', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/no hay actividad reciente/i)).toBeInTheDocument()
  })

  it('renders recent activity items list', () => {
    useDashboardDataMock.mockReturnValue({
      kpiCards: [
        { key: 'clients', value: '--', icon: 'RiBuilding4Line' },
        { key: 'users', value: '--', icon: 'RiTeamLine' },
        { key: 'services', value: '--', icon: 'RiBriefcaseLine' },
      ],
      recentActivity: [
        { id: 'log-1', timestamp: '2024-01-01 10:00:00', text: 'Usuario creado' },
        {
          id: 'log-2',
          timestamp: '2024-01-01 11:00:00',
          text: 'Configuración actualizada',
        },
      ],
    })
    render(<DashboardPage />)
    expect(screen.getByText('Usuario creado')).toBeInTheDocument()
    expect(screen.getByText('Configuración actualizada')).toBeInTheDocument()
  })
})
