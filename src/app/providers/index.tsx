import { useEffect, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from './query.provider'
import { registerUnauthorizedHandler } from '@/shared/api'
import { router } from '../router/router'
import { navPaths } from '@/shared/router'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      router.navigate({ to: navPaths.forbidden() as never }).catch(() => null)
    })
  }, [])

  return (
    <QueryProvider>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </QueryProvider>
  )
}
