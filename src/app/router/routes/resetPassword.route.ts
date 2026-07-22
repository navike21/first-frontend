import { createRoute } from '@tanstack/react-router'
import { publicLayout } from '../layouts'
import { NAV } from '@/shared/router'
import { ResetPasswordLayout } from '@domains/auth'

interface ResetPasswordSearch {
  token?: string
}

export const resetPasswordRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: NAV.resetPassword.segment,
  component: ResetPasswordLayout,
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
})

// Re-exportado como resetPasswordRouteTree por consistencia con login.route.ts.
export const resetPasswordRouteTree = resetPasswordRoute
