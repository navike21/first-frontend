import { useEffect, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from './query.provider'
import {
  registerUnauthorizedHandler,
  registerLanguageProvider,
  preferencesApi,
} from '@/shared/api'
import { useLanguageStore, useSessionStore } from '@/shared/model'
import { hydratePreferences } from '@/shared/lib/preferencesHydrate'
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

    // On load (page reload with a persisted session), reconcile preferences
    // from the backend — covers changes made on another device. Best-effort:
    // on failure the locally persisted values stay in place.
    if (useSessionStore.getState().token) {
      preferencesApi
        .me()
        .then((res) => hydratePreferences(res.data.preferences))
        .catch(() => {})
    }
  }, [])

  return (
    <QueryProvider>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </QueryProvider>
  )
}
