import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDashboardData } from './DashboardPage.hooks'

const { useHasPermissionMock, useClientsMock, useUsersMetaMock, useServicesMock, useAuditLogsMock } =
  vi.hoisted(() => ({
    useHasPermissionMock: vi.fn(),
    useClientsMock: vi.fn(),
    useUsersMetaMock: vi.fn(),
    useServicesMock: vi.fn(),
    useAuditLogsMock: vi.fn(),
  }))

vi.mock('@/shared/lib/permissions', () => ({
  useHasPermission: useHasPermissionMock,
  CAN: {
    clientsView: ['clients:read', 'clients:manage'],
    usersView: ['users:read', 'users:manage'],
    servicesView: ['services:read', 'services:manage'],
    auditLogsView: ['audit-logs:read', 'audit-logs:manage'],
  },
}))

vi.mock('@/domains/clients', () => ({ useClients: useClientsMock }))
vi.mock('@/domains/users', () => ({ useUsersMeta: useUsersMetaMock }))
vi.mock('@/domains/services', () => ({ useServices: useServicesMock }))
vi.mock('@/domains/audit-log', () => ({ useAuditLogs: useAuditLogsMock }))

vi.mock('../i18n', () => ({
  useDashboardTranslation: () => ({
    t: {
      activityBy: (user: string, resource: string, verb: string) =>
        `${user} — ${resource}: ${verb}`,
    },
  }),
}))

const emptyQuery = { data: undefined }

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useClientsMock.mockReturnValue(emptyQuery)
    useUsersMetaMock.mockReturnValue(emptyQuery)
    useServicesMock.mockReturnValue(emptyQuery)
    useAuditLogsMock.mockReturnValue(emptyQuery)
  })

  it('shows "--" for every KPI when the user has none of the view permissions', () => {
    useHasPermissionMock.mockReturnValue(false)
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.kpiCards.map((k) => k.value)).toEqual([
      '--',
      '--',
      '--',
    ])
  })

  it('does not query a KPI the user lacks permission to view', () => {
    useHasPermissionMock.mockReturnValue(false)
    renderHook(() => useDashboardData())
    expect(useClientsMock).toHaveBeenCalledWith(
      { limit: 1 },
      { enabled: false }
    )
  })

  it('reads the real total from meta for a KPI the user can view', () => {
    useHasPermissionMock.mockReturnValue(true)
    useClientsMock.mockReturnValue({ data: { meta: { total: 42 } } })
    const { result } = renderHook(() => useDashboardData())
    const clientsCard = result.current.kpiCards.find((k) => k.key === 'clients')
    expect(clientsCard?.value).toBe(42)
  })

  it('reads the users total from the nested PaginatedData shape (not meta)', () => {
    useHasPermissionMock.mockReturnValue(true)
    useUsersMetaMock.mockReturnValue({ data: { data: { total: 7 } } })
    const { result } = renderHook(() => useDashboardData())
    const usersCard = result.current.kpiCards.find((k) => k.key === 'users')
    expect(usersCard?.value).toBe(7)
  })

  it('shows "--" while the permitted query has not resolved yet', () => {
    useHasPermissionMock.mockReturnValue(true)
    useUsersMetaMock.mockReturnValue({ data: undefined })
    const { result } = renderHook(() => useDashboardData())
    const usersCard = result.current.kpiCards.find((k) => k.key === 'users')
    expect(usersCard?.value).toBe('--')
  })

  it('returns no recent activity when the user cannot view audit logs', () => {
    useHasPermissionMock.mockReturnValue(false)
    useAuditLogsMock.mockReturnValue({
      data: { data: [{ id: 'log-1', action: 'users:created', occurredAt: '2026-01-01T00:00:00Z' }] },
    })
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.recentActivity).toEqual([])
  })

  it('formats a recent activity entry from the user name and split action', () => {
    useHasPermissionMock.mockReturnValue(true)
    useAuditLogsMock.mockReturnValue({
      data: {
        data: [
          {
            id: 'log-1',
            action: 'subscribers:bulk_soft_deleted',
            occurredAt: '2026-01-05T14:30:00',
            user: { firstName: 'Super', lastName: 'Admin', email: 'a@a.com' },
          },
        ],
      },
    })
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.recentActivity).toHaveLength(1)
    expect(result.current.recentActivity[0]).toMatchObject({
      id: 'log-1',
      text: 'Super Admin — subscribers: bulk soft deleted',
    })
  })

  it('falls back to an em dash for an activity entry with no user', () => {
    useHasPermissionMock.mockReturnValue(true)
    useAuditLogsMock.mockReturnValue({
      data: {
        data: [
          {
            id: 'log-1',
            action: 'auth:login',
            occurredAt: '2026-01-05T14:30:00',
          },
        ],
      },
    })
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.recentActivity[0].text).toBe('— — auth: login')
  })
})
