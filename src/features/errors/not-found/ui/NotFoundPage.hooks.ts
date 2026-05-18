import { useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { navPaths } from '@/shared/router'
import { useIsAuthenticated } from '@/shared/model'
import { useErrorTranslation } from '../../i18n'

export function useNotFoundPage() {
  const router = useRouter()
  const navigate = useNavigate()
  const { location } = useRouterState()
  const { t } = useErrorTranslation()
  const isAuthenticated = useIsAuthenticated()
  const brokenPath = (location.state as { brokenPath?: string })?.brokenPath
  const canGoBack = globalThis.history.length > 1

  const handleBack = () => router.history.back()
  const handleHome = () => {
    const to = isAuthenticated ? navPaths.home() : navPaths.login()
    navigate({ to: to as never, replace: true }).catch(() => null)
  }

  return { t, brokenPath, canGoBack, isAuthenticated, handleBack, handleHome }
}
