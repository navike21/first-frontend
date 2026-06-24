import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuditLogsPage } from './AuditLogsPage'
import { useHasPermission } from '@/shared/lib/permissions'
import { useAuditLogs } from '../api/auditLog.queries'

// Mock dependencies
vi.mock('@/shared/lib/permissions', () => ({
  useHasPermission: vi.fn(),
  CAN: {
    auditLogsView: ['audit-logs:read', 'audit-logs:manage'],
  },
}))

vi.mock('@/shared/lib/formatDate', () => ({
  formatDate: vi.fn(() => '24/06/2026'),
}))

vi.mock('../api/auditLog.queries', () => ({
  useAuditLogs: vi.fn(),
}))

vi.mock('../i18n', () => ({
  useAuditLogsTranslation: () => ({
    t: {
      page: {
        title: 'Audit Logs',
        desc: 'System activity and audit logs',
      },
      table: {
        colDate: 'Date & Time',
        colUser: 'User ID',
        colAction: 'Action',
        colResource: 'Resource',
        colIp: 'IP Address',
        noResults: 'No audit logs found',
        prevPage: 'Previous',
        nextPage: 'Next',
        totalCount: (n: number) => `Total: ${n}`,
      },
    },
  }),
}))

vi.mock('@domains/errors', () => ({
  ForbiddenPage: () => <div data-testid="forbidden-page">Access Denied</div>,
}))

// We need to render actual Can component to test conditional rendering
vi.mock('@/shared/ui', async () => {
  const actual = await vi.importActual<any>('@/shared/ui')
  return {
    ...actual,
    PageHeader: ({ title, description }: any) => (
      <div data-testid="page-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    ),
    DataTable: ({ rows, columns, emptyLabel, totalLabel }: any) => (
      <div data-testid="data-table">
        <span data-testid="total-label">{totalLabel}</span>
        <span data-testid="empty-label">{emptyLabel}</span>
        <ul>
          {rows.map((row: any) => (
            <li key={row.id} data-testid="row-item">
              {row.action} - {row.resource}
            </li>
          ))}
        </ul>
      </div>
    ),
  }
})

describe('AuditLogsPage component', () => {
  const mockedUseHasPermission = vi.mocked(useHasPermission)
  const mockedUseAuditLogs = vi.mocked(useAuditLogs)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render ForbiddenPage if user lacks permission', () => {
    // Arrange: Mock useHasPermission to return false
    mockedUseHasPermission.mockReturnValue(false)
    mockedUseAuditLogs.mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any)

    // Act
    render(<AuditLogsPage />)

    // Assert
    expect(screen.queryByTestId('page-header')).not.toBeInTheDocument()
    expect(screen.getByTestId('forbidden-page')).toBeInTheDocument()
  })

  it('should render the page content when authorized', () => {
    // Arrange: Mock useHasPermission to return true
    mockedUseHasPermission.mockReturnValue(true)
    mockedUseAuditLogs.mockReturnValue({
      data: {
        success: true,
        statusCode: 200,
        code: 'OK',
        message: 'Success',
        data: [
          {
            id: 'log-1',
            action: 'create',
            resource: 'users',
            occurredAt: '2026-06-24T15:18:37Z',
            userId: 'user-123',
            ipAddress: '127.0.0.1',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
      isLoading: false,
    } as any)

    // Act
    render(<AuditLogsPage />)

    // Assert
    expect(screen.getByTestId('page-header')).toBeInTheDocument()
    expect(screen.getByText('Audit Logs')).toBeInTheDocument()
    expect(screen.getByTestId('data-table')).toBeInTheDocument()
    expect(screen.getByText('create - users')).toBeInTheDocument()
    expect(screen.getByTestId('total-label')).toHaveTextContent('Total: 1')
  })
})
