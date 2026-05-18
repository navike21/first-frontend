import { redirect } from '@tanstack/react-router'
import { isTokenStored } from '@/shared/model'
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
