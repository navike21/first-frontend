import { useSessionStore } from '@/shared/model'

/**
 * True if `permissions` satisfies ANY of `required`. The `*:*` super-root
 * wildcard grants everything. Callers that want "manage implies CRUD" semantics
 * must include the `:manage` permission in `required` explicitly (see {@link CAN}).
 */
export function hasPermission(
  permissions: string[],
  ...required: string[]
): boolean {
  if (permissions.includes('*:*')) return true
  return required.some((p) => permissions.includes(p))
}

const EMPTY_PERMISSIONS: string[] = []

/** Reactive permission check for components. */
export function useHasPermission(...required: string[]): boolean {
  const permissions = useSessionStore(
    (s) => s.user?.permissions ?? EMPTY_PERMISSIONS
  )
  return hasPermission(permissions, ...required)
}

/**
 * Reads the current user's permissions outside React — for route guards
 * (`beforeLoad`) that run before any component mounts.
 */
export function getSessionPermissions(): string[] {
  return useSessionStore.getState().user?.permissions ?? EMPTY_PERMISSIONS
}

/**
 * Capability → required permissions (any-of). `:manage` is included where the
 * backend treats it as granting that action (CRUD but NOT purge — purge needs
 * explicit `:purge` or `*:*`). `*:*` is always honored by {@link hasPermission}.
 * Single source of truth shared by the sidebar menu, route guards and in-page
 * action gating.
 */
export const CAN = {
  usersView: ['users:read', 'users:manage'],
  usersCreate: ['users:create', 'users:manage'],
  usersUpdate: ['users:update', 'users:manage'],
  usersDelete: ['users:delete', 'users:manage'],
  usersPurge: ['users:purge'],
  // Trash holds restore (update/manage) + purge actions, so viewing it is
  // gated by either capability (matches the "Ver papelera" link gate).
  usersTrash: ['users:purge', 'users:manage'],
  groupsView: ['user-groups:read', 'user-groups:manage'],
  groupsCreate: ['user-groups:create', 'user-groups:manage'],
  groupsUpdate: ['user-groups:update', 'user-groups:manage'],
  groupsDelete: ['user-groups:delete', 'user-groups:manage'],
  groupsPurge: ['user-groups:purge'],
  groupsTrash: ['user-groups:purge', 'user-groups:manage'],
} as const
