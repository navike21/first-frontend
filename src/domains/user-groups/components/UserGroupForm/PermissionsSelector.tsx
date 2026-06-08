import clsx from 'clsx'

interface PermissionsSelectorProps {
  value: string[]
  onChange: (v: string[]) => void
  catalog: string[]
  disabled?: boolean
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatResource(resource: string): string {
  return resource.split('-').map(capitalize).join(' ')
}

export const PermissionsSelector = ({
  value,
  onChange,
  catalog,
  disabled = false,
}: PermissionsSelectorProps) => {
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
        No permissions available
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
            <label className="flex cursor-pointer items-center gap-2 pb-2">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected
                }}
                onChange={() => !disabled && toggleAll(resource)}
                disabled={disabled}
                className={clsx(
                  'h-4 w-4 cursor-pointer rounded',
                  'border-slate-300 text-blue-600 dark:border-slate-600',
                  'disabled:cursor-not-allowed'
                )}
              />
              <span className="text-sm font-semibold text-(--text-primary)">
                {formatResource(resource)}
              </span>
            </label>
            {/* Action checkboxes */}
            <div className="flex flex-col gap-1 border-t border-(--border-subtle) pt-2">
              {actions.map((action) => {
                const perm = `${resource}:${action}`
                return (
                  <label
                    key={action}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(perm)}
                      onChange={() => !disabled && toggle(perm)}
                      disabled={disabled}
                      className={clsx(
                        'h-4 w-4 cursor-pointer rounded',
                        'border-slate-300 text-blue-600 dark:border-slate-600',
                        'disabled:cursor-not-allowed'
                      )}
                    />
                    <span className="text-xs text-(--text-secondary)">
                      {capitalize(action)}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
