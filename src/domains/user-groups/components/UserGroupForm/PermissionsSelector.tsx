import { Checkbox } from '@/shared/ui'
import { useUserGroupsTranslation } from '../../i18n'

interface PermissionsSelectorProps {
  value: string[]
  onChange: (v: string[]) => void
  catalog: string[]
  disabled?: boolean
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function humanize(resource: string): string {
  return resource.split('-').map(capitalize).join(' ')
}

export const PermissionsSelector = ({
  value,
  onChange,
  catalog,
  disabled = false,
}: PermissionsSelectorProps) => {
  const { t } = useUserGroupsTranslation()
  const { resources: resourceLabels, actions: actionLabels, allLabel } =
    t.permissionCatalog

  // Localized label for a resource segment; `*` → "all permissions", unknown
  // resources fall back to the humanized key (so new backend resources still
  // render with a readable name until translated).
  const resourceLabel = (resource: string): string =>
    resource === '*'
      ? allLabel
      : (resourceLabels[resource] ?? humanize(resource))

  // Localized label for an action segment; `*` → "all permissions", unknown
  // actions fall back to capitalizing the key.
  const actionLabel = (action: string): string =>
    action === '*' ? allLabel : (actionLabels[action] ?? capitalize(action))

  // Group permissions by resource (left part of 'resource:action')
  const grouped = catalog.reduce<Record<string, string[]>>((acc, perm) => {
    const [resource, action] = perm.split(':')
    if (!resource || !action) return acc
    if (!acc[resource]) acc[resource] = []
    acc[resource].push(action)
    return acc
  }, {})

  const resources = Object.keys(grouped).sort()

  const toggle = (perm: string) => {
    if (value.includes(perm)) {
      onChange(value.filter((p) => p !== perm))
    } else {
      onChange([...value, perm])
    }
  }

  const toggleAll = (resource: string) => {
    const perms = (grouped[resource] ?? []).map(
      (action) => `${resource}:${action}`
    )
    const allSelected = perms.every((p) => value.includes(p))
    if (allSelected) {
      onChange(value.filter((p) => !perms.includes(p)))
    } else {
      const newPerms = [...value]
      for (const p of perms) {
        if (!newPerms.includes(p)) newPerms.push(p)
      }
      onChange(newPerms)
    }
  }

  if (resources.length === 0) {
    return (
      <div className="rounded-lg border border-(--border) bg-(--surface-subtle) p-4 text-sm text-(--text-muted)">
        {t.permissionCatalog.noneAvailable}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => {
        const actions = grouped[resource] ?? []
        const perms = actions.map((action) => `${resource}:${action}`)
        const selectedCount = perms.filter((p) => value.includes(p)).length
        const allSelected = selectedCount === perms.length
        const someSelected = selectedCount > 0 && !allSelected

        return (
          <div
            key={resource}
            className="rounded-lg border border-(--border) bg-(--surface) p-3"
          >
            {/* Resource header */}
            <div className="pb-2">
              <Checkbox
                label={
                  <span className="text-sm font-semibold text-(--text-primary)">
                    {resourceLabel(resource)}
                  </span>
                }
                checked={allSelected}
                indeterminate={someSelected}
                onChange={() => toggleAll(resource)}
                disabled={disabled}
              />
            </div>
            {/* Action checkboxes */}
            <div className="flex flex-col gap-1 border-t border-(--border-subtle) pt-2">
              {actions.map((action) => {
                const perm = `${resource}:${action}`
                return (
                  <Checkbox
                    key={action}
                    label={
                      <span className="text-xs text-(--text-secondary)">
                        {actionLabel(action)}
                      </span>
                    }
                    checked={value.includes(perm)}
                    onChange={() => toggle(perm)}
                    disabled={disabled}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
