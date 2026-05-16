import { useEffect } from 'react'
import { createRootRoute, useNavigate } from '@tanstack/react-router'
import { RootLayout } from './RootLayout'
import { NAV } from '@/shared/router'
import { getLastValidPath } from './navigationHistory'

const NotFoundRedirect = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate({
      to: NAV.notFound.path as never,
      replace: true,
      state: {
        brokenPath: globalThis.location.pathname,
        previousPath: getLastValidPath(),
      },
    }).catch(() => null)
  }, [navigate])
  return null
}

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundRedirect,
})
