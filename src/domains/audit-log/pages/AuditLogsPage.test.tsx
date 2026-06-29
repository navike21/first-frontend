import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactNode, ChangeEvent, ButtonHTMLAttributes } from 'react'
import { AuditLogsPage } from './AuditLogsPage'
import { useHasPermission } from '@/shared/lib/permissions'
import { useAuditLogs } from '../api/auditLog.queries'
import type { DataTableColumn } from '@/shared/ui'
import type { AuditLog } from '../api/auditLog.api'

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
        colUser: 'User',
        colAction: 'Action',
        colResource: 'Resource',
        colIp: 'IP Address',
        colActions: 'Actions',
        noResults: 'No audit logs found',
        prevPage: 'Previous',
        nextPage: 'Next',
        totalCount: (n: number) => `Total: ${n}`,
        viewDetail: 'View details',
      },
      detail: {
        title: 'Log Entry Details',
        colUserAgent: 'Device / User Agent',
        colMetadata: 'Action Data',
        closeButton: 'Close',
      },
      filters: {
        dateFrom: 'Date from',
        dateTo: 'Date to',
        clear: 'Clear filters',
      },
    },
    language: 'en',
  }),
}))

vi.mock('@domains/errors', () => ({
  ForbiddenPage: () => <div data-testid="forbidden-page">Access Denied</div>,
}))

// We need to render actual Can component to test conditional rendering
vi.mock('@/shared/ui', async () => {
  const actual = await vi.importActual<typeof import('@/shared/ui')>(
    '@/shared/ui'
  )
  return {
    ...actual,
    PageContent: ({
      title,
      description,
      children,
    }: {
      title: string
      description?: string
      children: ReactNode
    }) => (
      <div data-testid="page-header">
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    ),
    DataTable: ({
      rows,
      columns,
      emptyLabel,
      totalLabel,
    }: {
      rows: AuditLog[]
      columns: DataTableColumn<AuditLog>[]
      emptyLabel: ReactNode
      totalLabel: ReactNode
    }) => (
      <div data-testid="data-table">
        <span data-testid="total-label">{totalLabel}</span>
        <span data-testid="empty-label">{emptyLabel}</span>
        <table>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} data-testid="row-item">
                <td>{columns.find((c) => c.id === 'userId')?.cell(row)}</td>
                <td>{columns.find((c) => c.id === 'action')?.cell(row)}</td>
                <td>{columns.find((c) => c.id === 'actions')?.cell(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    IconButton: ({
      onClick,
      'aria-label': ariaLabel,
    }: {
      onClick?: () => void
      'aria-label'?: string
    }) => (
      <button onClick={onClick} data-testid="icon-button">
        {ariaLabel}
      </button>
    ),
    Tooltip: ({
      children,
      heading,
    }: {
      children: ReactNode
      heading?: string
    }) => (
      <div data-testid="tooltip" title={heading}>
        {children}
      </div>
    ),
    InputDate: ({
      label,
      value,
      onChange,
    }: {
      label: string
      value?: string
      onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    }) => (
      <div data-testid={`input-date-container-${label}`}>
        <label htmlFor={`input-date-${label}`}>{label}</label>
        <input
          id={`input-date-${label}`}
          type="text"
          value={value}
          onChange={onChange}
          data-testid={`input-date-${label}`}
        />
      </div>
    ),
    Button: ({
      children,
      onClick,
      ...rest
    }: ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} {...rest}>
        {children}
      </button>
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
    } as unknown as ReturnType<typeof useAuditLogs>)

    // Act
    render(<AuditLogsPage />)

    // Assert
    expect(screen.queryByTestId('page-header')).not.toBeInTheDocument()
    expect(screen.getByTestId('forbidden-page')).toBeInTheDocument()
  })

  it('should render the page content when authorized and map UUIDs to names', () => {
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
            user: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
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
    } as unknown as ReturnType<typeof useAuditLogs>)

    // Act
    render(<AuditLogsPage />)

    // Assert
    expect(screen.getByTestId('page-header')).toBeInTheDocument()
    expect(screen.getByText('Audit Logs')).toBeInTheDocument()
    expect(screen.getByTestId('data-table')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('create')).toBeInTheDocument()
    expect(screen.getByTestId('total-label')).toHaveTextContent('Total: 1')
  })

  it('should open the detail modal when clicking view details', () => {
    // Arrange
    mockedUseHasPermission.mockReturnValue(true)
    mockedUseAuditLogs.mockReturnValue({
      data: {
        success: true,
        data: [
          {
            id: 'log-1',
            action: 'create',
            resource: 'users',
            occurredAt: '2026-06-24T15:18:37Z',
            userId: 'user-123',
            ipAddress: '127.0.0.1',
            metadata: { details: 'Created John' },
            user: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
          },
        ],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useAuditLogs>)

    render(<AuditLogsPage />)

    // Act: Click on the details button
    const viewButton = screen.getByTestId('icon-button')
    fireEvent.click(viewButton)

    // Assert: Modal fields should be visible
    expect(screen.getByText('Log Entry Details')).toBeInTheDocument()
    expect(screen.getAllByText('create').length).toBeGreaterThan(0)
    expect(screen.getByText('Action Data')).toBeInTheDocument()
    expect(screen.getByText(/"details": "Created John"/)).toBeInTheDocument()
  })

  it('should render date inputs and trigger query with date values when changed', () => {
    // Arrange
    mockedUseHasPermission.mockReturnValue(true)
    mockedUseAuditLogs.mockReturnValue({
      data: {
        success: true,
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useAuditLogs>)

    render(<AuditLogsPage />)

    // Act & Assert: Date fields should render
    const dateFromInput = screen.getByTestId('input-date-Date from')
    const dateToInput = screen.getByTestId('input-date-Date to')

    expect(dateFromInput).toBeInTheDocument()
    expect(dateToInput).toBeInTheDocument()

    // Clear button should not be visible initially
    expect(screen.queryByTestId('clear-filters-button')).not.toBeInTheDocument()

    // Set date from
    fireEvent.change(dateFromInput, { target: { value: '2026-06-01' } })

    // Verify hook called with the parameter
    expect(mockedUseAuditLogs).toHaveBeenLastCalledWith(
      expect.objectContaining({
        dateFrom: '2026-06-01',
      })
    )

    // Clear button should be visible now
    const clearBtn = screen.getByTestId('clear-filters-button')
    expect(clearBtn).toBeInTheDocument()

    // Click clear button
    fireEvent.click(clearBtn)

    // Verify hook called with undefined
    expect(mockedUseAuditLogs).toHaveBeenLastCalledWith(
      expect.objectContaining({
        dateFrom: undefined,
        dateTo: undefined,
      })
    )
  })
})
