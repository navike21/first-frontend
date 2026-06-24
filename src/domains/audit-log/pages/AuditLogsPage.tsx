import { useState } from 'react'
import { PageHeader, DataTable, Can, IconButton, Tooltip, InputDate, Button, Chip, type DataTableColumn } from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatDate } from '@/shared/lib/formatDate'
import { ForbiddenPage } from '@domains/errors'
import { useAuditLogs } from '../api/auditLog.queries'
import { useAuditLogsTranslation } from '../i18n'
import { AuditLogDetailModal } from '../components/AuditLogDetailModal/AuditLogDetailModal'
import type { AuditLog, AuditLogPaginationMeta } from '../api/auditLog.api'

const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return '—'
  const dateStr = formatDate(value)
  if (dateStr === '—') return '—'
  try {
    const d = new Date(value)
    if (isNaN(d.getTime())) return dateStr
    const timeStr = d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    return `${dateStr} ${timeStr}`
  } catch {
    return dateStr
  }
}

const getActionChipVariant = (action: string) => {
  const lower = action.toLowerCase()
  if (lower.includes('delete') || lower.includes('purge') || lower.includes('remove')) return 'error'
  if (lower.includes('create') || lower.includes('restore')) return 'success'
  if (lower.includes('update') || lower.includes('patch') || lower.includes('edit')) return 'warning'
  if (lower.includes('login') || lower.includes('logout') || lower.includes('auth')) return 'informative'
  return 'default'
}

export const AuditLogsPage = () => {
  const { t, language } = useAuditLogsTranslation()
  const [page, setPage] = useState(1)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const limit = 10

  const { data, isLoading } = useAuditLogs({
    page,
    limit,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  })

  const meta = data?.meta as AuditLogPaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1

  const columns: DataTableColumn<AuditLog>[] = [
    {
      id: 'occurredAt',
      header: t.table.colDate,
      cell: (row) => (
        <span className="font-medium text-(--text-primary)">
          {formatDateTime(row.occurredAt)}
        </span>
      ),
    },
    {
      id: 'userId',
      header: t.table.colUser,
      cell: (row) => {
        const name = row.user ? `${row.user.firstName} ${row.user.lastName}` : undefined
        return (
          <span className="text-sm font-medium text-(--text-secondary)">
            {name ?? row.userId ?? '—'}
          </span>
        )
      },
    },
    {
      id: 'action',
      header: t.table.colAction,
      cell: (row) => (
        <Chip size="small" variant={getActionChipVariant(row.action)}>
          {row.action}
        </Chip>
      ),
    },
    {
      id: 'resource',
      header: t.table.colResource,
      cell: (row) => (
        <span className="text-sm text-(--text-secondary)">
          {row.resource}
        </span>
      ),
    },
    {
      id: 'actions',
      header: t.table.colActions,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end">
          <Tooltip heading={t.table.viewDetail} position="top" size="small">
            <IconButton
              icon="RiEyeLine"
              variant="text"
              size="small"
              aria-label={t.table.viewDetail}
              onClick={() => setSelectedLog(row)}
            />
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <Can anyOf={CAN.auditLogsView} fallback={<ForbiddenPage />}>
      <div className="animate-page-in space-y-6">
        <PageHeader title={t.page.title} description={t.page.desc} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:w-52">
            <InputDate
              label={t.filters.dateFrom}
              mode="date"
              lang={language}
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <div className="w-full sm:w-52">
            <InputDate
              label={t.filters.dateTo}
              mode="date"
              lang={language}
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(1)
              }}
            />
          </div>
          {(dateFrom || dateTo) && (
            <Button
              variant="secondary"
              size="small"
              data-testid="clear-filters-button"
              onClick={() => {
                setDateFrom('')
                setDateTo('')
                setPage(1)
              }}
            >
              {t.filters.clear}
            </Button>
          )}
        </div>
        
        <DataTable
          columns={columns}
          rows={data?.data ?? []}
          getRowKey={(row) => row.id}
          isLoading={isLoading}
          emptyIcon="RiFileListLine"
          emptyLabel={t.table.noResults}
          totalLabel={t.table.totalCount(total)}
          pagination={{
            page,
            pages,
            onPageChange: (newPage) => setPage(newPage),
            prevLabel: t.table.prevPage,
            nextLabel: t.table.nextPage,
          }}
        />

        <AuditLogDetailModal
          log={selectedLog}
          userName={selectedLog?.user ? `${selectedLog.user.firstName} ${selectedLog.user.lastName}` : undefined}
          formattedDate={selectedLog ? formatDateTime(selectedLog.occurredAt) : ''}
          onClose={() => setSelectedLog(null)}
        />
      </div>
    </Can>
  )
}
