import { useAuthStore } from '@features/auth/store'

export function usePermission(permission: string): boolean {
  const permissions = useAuthStore((s) => s.permissions)

  if (!permissions || permissions.length === 0) return false

  // Superadmin
  if (permissions.includes('*:*')) return true

  // Exact match
  if (permissions.includes(permission)) return true

  // Wildcard resource:manage covers all sub-actions for that resource
  const [resource] = permission.split(':')
  if (resource && permissions.includes(`${resource}:manage`)) return true

  return false
}

export function useHasPermissions(requiredPermissions: string[]): boolean {
  const permissions = useAuthStore((s) => s.permissions)

  if (!permissions || permissions.length === 0) return false
  if (permissions.includes('*:*')) return true

  return requiredPermissions.every((perm) => {
    if (permissions.includes(perm)) return true
    const [resource] = perm.split(':')
    return resource ? permissions.includes(`${resource}:manage`) : false
  })
}
