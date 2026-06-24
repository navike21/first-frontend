import type { ReactNode } from 'react'
import { Modal, Button } from '@/shared/ui'
import { useAuditLogsTranslation } from '../../i18n'
import type { AuditLog } from '../../api/auditLog.api'

interface AuditLogDetailModalProps {
  log: AuditLog | null
  userName?: string
  formattedDate: string
  onClose: () => void
}

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex flex-col gap-1 border-b border-(--border-subtle) py-2.5 last:border-0 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
    <span className="text-sm text-(--text-secondary) shrink-0">{label}</span>
    <span className="text-sm font-medium text-(--text-primary) break-all text-left sm:text-right">{value}</span>
  </div>
)

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
            <Row label={t.table.colUser} value={userName ?? log.userId ?? '—'} />
            <Row
              label={t.table.colAction}
              value={
                <span className="inline-flex items-center rounded-md bg-(--surface-subtle) px-2 py-0.5 text-xs font-semibold text-(--text-primary) ring-1 ring-inset ring-(--border)">
                  {log.action}
                </span>
              }
            />
            <Row label={t.table.colResource} value={log.resource} />
            <Row label={t.table.colIp} value={log.ipAddress ?? '—'} />
            <Row label={t.detail.colUserAgent} value={log.userAgent ?? '—'} />
          </div>

          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-(--text-primary)">
                {t.detail.colMetadata}
              </span>
              <pre className="max-h-48 overflow-y-auto rounded-lg border border-(--border) bg-(--surface-subtle) p-3 text-xs font-mono text-(--text-secondary) leading-relaxed">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
