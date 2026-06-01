import { useSessionStore } from '@/shared/model'

export function hasPermission(permissions: string[], ...required: string[]): boolean {
  if (permissions.includes('*:*')) return true
  return required.some((p) => permissions.includes(p))
}

export function useHasPermission(...required: string[]): boolean {
  const permissions = useSessionStore((s) => s.user?.permissions ?? [])
  return hasPermission(permissions, ...required)
}
