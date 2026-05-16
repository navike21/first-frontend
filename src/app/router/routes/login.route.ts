import { createRoute } from '@tanstack/react-router'
import { publicLayout } from '../layouts'
import { NAV } from '@/shared/router'
import { LoginLayout } from '@/features/auth/login/ui/LoginLayout'

export const loginRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: NAV.login.segment,
  component: LoginLayout,
})

// Re-exported as loginRouteTree for consistency with other feature barrels.
// Using loginRoute directly (no addChildren) avoids a TanStack Router type
// inference issue where addChildren([]) with an empty array drops the route
// path from the navigable-paths type union.
export const loginRouteTree = loginRoute
