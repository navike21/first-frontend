import { useEffect, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from './query.provider'
import { registerUnauthorizedHandler } from '@/shared/api'
import { router } from '../router/router'
import { NAV } from '@/shared/router'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      router.navigate({ to: NAV.forbidden.path as never }).catch(() => null)
    })
  }, [])

  return (
    <QueryProvider>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </QueryProvider>
  )
}
