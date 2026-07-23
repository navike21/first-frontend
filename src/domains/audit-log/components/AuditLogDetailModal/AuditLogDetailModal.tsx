import type { ReactNode } from 'react'
import { Modal, Button, Chip } from '@/shared/ui'
import { useAuditLogsTranslation } from '../../i18n'
import type { AuditLog } from '../../api/auditLog.api'

interface AuditLogDetailModalProps {
  log: AuditLog | null
  userName?: string
  formattedDate: string
  onClose: () => void
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="border-border-subtle flex flex-col gap-1 border-b py-2.5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
    <span className="text-secondary shrink-0 text-sm">{label}</span>
    <span className="text-foreground text-left text-sm font-medium break-all sm:text-right">
      {value}
    </span>
  </div>
)

const getActionChipVariant = (action: string) => {
  const lower = action.toLowerCase()
  if (
    lower.includes('delete') ||
    lower.includes('purge') ||
    lower.includes('remove')
  )
    return 'error'
  if (lower.includes('create') || lower.includes('restore')) return 'success'
  if (
    lower.includes('update') ||
    lower.includes('patch') ||
    lower.includes('edit')
  )
    return 'warning'
  if (
    lower.includes('login') ||
    lower.includes('logout') ||
    lower.includes('auth')
  )
    return 'informative'
  return 'default'
}

export const AuditLogDetailModal = ({
  log,
  userName,
  formattedDate,
  onClose,
}: AuditLogDetailModalProps) => {
  const { t } = useAuditLogsTranslation()

  return (
    <Modal
      isOpen={!!log}
      onClose={onClose}
      size="lg"
      title={t.detail.title}
      footer={
        <Button variant="secondary" onClick={onClose}>
          {t.detail.closeButton}
        </Button>
      }
    >
      {log && (
        <div className="flex flex-col gap-4">
          <div>
            <Row label={t.table.colDate} value={formattedDate} />
            <Row
              label={t.table.colUser}
              value={userName ?? log.userId ?? '—'}
            />
            <Row
              label={t.table.colAction}
              value={
                <Chip size="small" variant={getActionChipVariant(log.action)}>
                  {log.action}
                </Chip>
              }
            />
            <Row label={t.table.colResource} value={log.resource} />
            <Row label={t.table.colIp} value={log.ipAddress ?? '—'} />
            <Row label={t.detail.colUserAgent} value={log.userAgent ?? '—'} />
          </div>

          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-foreground text-sm font-semibold">
                {t.detail.colMetadata}
              </span>
              <pre className="border-border bg-surface-subtle text-secondary max-h-48 overflow-y-auto rounded-lg border p-3 font-mono text-xs leading-relaxed">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
