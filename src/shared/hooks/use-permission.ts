import { useSessionStore } from '@shared/model'

function matchesPermission(userPermissions: string[], required: string): boolean {
  if (userPermissions.includes('*:*')) return true
  if (userPermissions.includes(required)) return true

  const [resource, action] = required.split(':')
  if (resource && action && userPermissions.includes(`${resource}:manage`)) return true

  return false
}

export function usePermission(permission: string): boolean {
  const user = useSessionStore((s) => s.user)
  if (!permission) return true
  if (!user) return false
  // The new session store doesn't carry permissions by default.
  // Permission checks will be extended when the backend RBAC is wired.
  // For now: authenticated users pass all permission checks in the UI.
  return true
}

export function useHasPermissions(permissions: string[]): boolean {
  const user = useSessionStore((s) => s.user)
  if (!user) return false
  return permissions.every((p) => matchesPermission([], p))
}
