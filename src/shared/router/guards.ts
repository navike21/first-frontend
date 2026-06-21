import { redirect } from '@tanstack/react-router'
import { isTokenStored } from '@/shared/model'
import { getSessionPermissions, hasPermission } from '@/shared/lib/permissions'
import { navPaths } from './nav-paths'

export const requireAuth = (): void => {
  if (!isTokenStored()) {
    throw redirect({ to: navPaths.forbidden() as never })
  }
}

export const requireGuest = (): void => {
  if (isTokenStored()) {
    throw redirect({ to: navPaths.home() as never })
  }
}

/**
 * Route guard factory: blocks navigation (direct URL included) unless the user
 * holds ANY of `required` permissions, redirecting to /403. Hiding the menu
 * isn't enough — this stops typing the URL too. Backend stays the final
 * authority on data.
 */
export const requirePermission =
  (...required: string[]) =>
  (): void => {
    if (!hasPermission(getSessionPermissions(), ...required)) {
      throw redirect({ to: navPaths.forbidden() as never })
    }
  }
