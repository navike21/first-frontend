import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useSessionStore, TOKEN_KEY } from '@/shared/model'
import { NAV } from '@/shared/router'

/**
 * Parses a raw localStorage value written by the persist middleware
 * and extracts the session token if present.
 */
const parseStoredToken = (raw: string | null): string | null => {
  if (raw === null) return null
  try {
    const parsed = JSON.parse(raw) as { state?: { token?: unknown } }
    return typeof parsed.state?.token === 'string' ? parsed.state.token : null
  } catch {
    return null
  }
}

/**
 * Synchronizes auth session state across multiple browser tabs.
 *
 * - If another tab clears the token (logout) → clears the local session
 *   and redirects to /403.
 * - If another tab sets the token (login) → navigates to / so the user
 *   lands on the app without needing to refresh.
 *
 * Must be rendered inside the RouterProvider context (e.g., RootLayout).
 */
export const useSessionSync = (): void => {
  const router = useRouter()
  const clearSession = useSessionStore((state) => state.clearSession)

  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== TOKEN_KEY) return

      const prevToken = parseStoredToken(event.oldValue)
      const nextToken = parseStoredToken(event.newValue)

      if (nextToken === null && prevToken !== null) {
        // Token cleared in another tab → force logout here too
        clearSession()
        router.navigate({ to: NAV.forbidden.path }).catch(() => null)
      } else if (nextToken !== null && prevToken === null) {
        // Token set in another tab → follow the login
        router.navigate({ to: '/' }).catch(() => null)
      }
    }

    globalThis.addEventListener('storage', handleStorage)
    return () => globalThis.removeEventListener('storage', handleStorage)
  }, [clearSession, router])
}
