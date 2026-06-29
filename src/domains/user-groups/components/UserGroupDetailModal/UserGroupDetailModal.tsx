import { Modal, Button, Chip, IconComponent } from '@/shared/ui'
import { useUserGroupsTranslation } from '../../i18n'
import type { UserGroup } from '../../model/userGroup.types'

interface UserGroupDetailModalProps {
  group: UserGroup | null
  onClose: () => void
  onEdit: (group: UserGroup) => void
}

const isSuperadmin = (permissions: string[]) =>
  permissions.includes('*:*') || permissions.includes('*')

function groupPermissions(permissions: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const perm of permissions) {
    const colonIdx = perm.indexOf(':')
    const resource = colonIdx !== -1 ? perm.slice(0, colonIdx) : perm
    const action = colonIdx !== -1 ? perm.slice(colonIdx + 1) : '*'
    ;(result[resource] ??= []).push(action)
  }
  return result
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function humanize(resource: string): string {
  return resource.split('-').map(capitalize).join(' ')
}

export const UserGroupDetailModal = ({
  group,
  onClose,
  onEdit,
}: UserGroupDetailModalProps) => {
  const { t } = useUserGroupsTranslation()

  const superadmin = group ? isSuperadmin(group.permissions) : false
  const grouped =
    group && !superadmin ? groupPermissions(group.permissions) : {}

  const {
    resources: resourceLabels,
    actions: actionLabels,
    allLabel,
  } = t.permissionCatalog
  const resourceLabel = (resource: string): string =>
    resource === '*'
      ? allLabel
      : (resourceLabels[resource] ?? humanize(resource))
  const actionLabel = (action: string): string =>
    action === '*' ? allLabel : (actionLabels[action] ?? capitalize(action))

  return (
    <Modal
      isOpen={!!group}
      onClose={onClose}
      size="md"
      title={t.detail.title}
      footer={
        group ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              {t.detail.closeButton}
            </Button>
            {!group.isSystem && (
              <Button variant="primary" onClick={() => onEdit(group)}>
                {t.detail.editButton}
              </Button>
            )}
          </>
        ) : undefined
      }
    >
      {group && (
        <div className="space-y-5">
          {/* Identity */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-full border border-(--border)"
              style={{ backgroundColor: group.color }}
            />
            <span className="font-semibold text-(--text-primary)">
              {group.name}
            </span>
            {group.isSystem && (
              <Chip variant="default" size="small">
                {t.table.systemBadge}
              </Chip>
            )}
            <Chip
              variant={group.status === 'active' ? 'success' : 'default'}
              size="small"
            >
              {t.status[group.status]}
            </Chip>
          </div>

          {/* Description */}
          {group.description && (
            <div>
              <p className="mb-1 text-xs font-semibold tracking-wide text-(--text-muted) uppercase">
                {t.detail.descriptionLabel}
              </p>
              <p className="text-sm text-(--text-primary)">
                {group.description}
              </p>
            </div>
          )}

          {/* Permissions */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-(--text-muted) uppercase">
              {t.detail.permissionsLabel}
            </p>

            {superadmin ? (
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <IconComponent
                  icon="RiInformationLine"
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                <span>{t.detail.superadminNotice}</span>
              </div>
            ) : group.permissions.length === 0 ? (
              <p className="text-sm text-(--text-muted)">
                {t.detail.noPermissions}
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(grouped).map(([resource, actions]) => (
                  <div
                    key={resource}
                    className="flex flex-wrap items-start gap-2"
                  >
                    <span className="w-28 shrink-0 pt-0.5 text-xs font-medium text-(--text-secondary)">
                      {resourceLabel(resource)}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {actions.map((action) => (
                        <span
                          key={action}
                          className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {actionLabel(action)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex gap-6 border-t border-(--border-subtle) pt-3 text-xs text-(--text-muted)">
            <span>
              {t.detail.createdAt}: {formatDate(group.createdAt)}
            </span>
            <span>
              {t.detail.updatedAt}: {formatDate(group.updatedAt)}
            </span>
          </div>
        </div>
      )}
    </Modal>
  )
}
