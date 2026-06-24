import { useState } from 'react'
import { PageHeader, DataTable, Can, type DataTableColumn } from '@/shared/ui'
import { CAN } from '@/shared/lib/permissions'
import { formatDate } from '@/shared/lib/formatDate'
import { ForbiddenPage } from '@domains/errors'
import { useAuditLogs } from '../api/auditLog.queries'
import { useAuditLogsTranslation } from '../i18n'
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

export const AuditLogsPage = () => {
  const { t } = useAuditLogsTranslation()
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading } = useAuditLogs({ page, limit })

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
      cell: (row) => (
        <span className="text-sm font-mono text-(--text-secondary)">
          {row.userId ?? '—'}
        </span>
      ),
    },
    {
      id: 'action',
      header: t.table.colAction,
      cell: (row) => (
        <span className="inline-flex items-center rounded-md bg-(--surface-subtle) px-2 py-1 text-xs font-semibold text-(--text-primary) ring-1 ring-inset ring-(--border)">
          {row.action}
        </span>
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
      id: 'ipAddress',
      header: t.table.colIp,
      cell: (row) => (
        <span className="text-sm font-mono text-(--text-muted)">
          {row.ipAddress ?? '—'}
        </span>
      ),
    },
  ]

  return (
    <Can anyOf={CAN.auditLogsView} fallback={<ForbiddenPage />}>
      <div className="animate-page-in space-y-6">
        <PageHeader title={t.page.title} description={t.page.desc} />
        
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
      </div>
    </Can>
  )
}
