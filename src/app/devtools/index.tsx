import { lazy, Suspense } from 'react'
import { router } from '@/app/router/router'

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({
    default: m.ReactQueryDevtools,
  }))
)

const TanStackRouterDevtools = lazy(() =>
  import('@tanstack/react-router-devtools').then((m) => ({
    default: m.TanStackRouterDevtools,
  }))
)

/**
 * All DevTools in one place.
 * Lazy-loaded so chunks are never fetched in production.
 * import.meta.env.DEV is a compile-time constant — Rolldown eliminates
 * the entire branch (and lazy chunks) from the production bundle.
 */
export function AppDevtools() {
  if (!import.meta.env.DEV) return null

  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools router={router} position="bottom-right" />
    </Suspense>
  )
}
