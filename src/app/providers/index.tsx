import { useEffect, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from './query.provider'
import { registerUnauthorizedHandler, registerLanguageProvider } from '@/shared/api'
import { useLanguageStore } from '@/shared/model'
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
    // Send the current UI language as Accept-Language on every request.
    registerLanguageProvider(() => useLanguageStore.getState().language)
  }, [])

  return (
    <QueryProvider>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </QueryProvider>
  )
}
