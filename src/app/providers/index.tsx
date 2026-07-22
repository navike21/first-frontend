import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from './query.provider'
import {
  registerUnauthorizedHandler,
  registerLanguageProvider,
  preferencesApi,
} from '@/shared/api'
import { useLanguageStore, useSessionStore, useTheme } from '@/shared/model'
import { hydratePreferences } from '@/shared/lib/preferencesHydrate'
import { router } from '../router/router'
import { navPaths } from '@/shared/router'

interface AppProvidersProps {
  children: ReactNode
}

// Toasts (sonner) alineados al Design System de First: bg/texto reutilizan
// los tokens de Chip (verificado que coinciden exacto por severidad), borde
// y sombra son propios de Toast. Inline style gana siempre por especificidad
// sobre las reglas [data-sonner-toaster][data-sonner-theme=...] de la
// librería, sin importar el orden de carga del CSS.
const toastStyle = {
  borderRadius: '12px',
  boxShadow: 'var(--shadow-toast)',
  '--normal-bg': 'var(--color-surface-panel)',
  '--normal-border': 'var(--color-border-control)',
  '--normal-text': 'var(--color-foreground)',
  '--success-bg': 'var(--color-chip-success-bg)',
  '--success-border': 'var(--color-toast-success-border)',
  '--success-text': 'var(--color-chip-success-text)',
  '--warning-bg': 'var(--color-chip-warning-bg)',
  '--warning-border': 'var(--color-toast-warning-border)',
  '--warning-text': 'var(--color-chip-warning-text)',
  '--error-bg': 'var(--color-chip-error-bg)',
  '--error-border': 'var(--color-toast-error-border)',
  '--error-text': 'var(--color-chip-error-text)',
  '--info-bg': 'var(--color-chip-info-bg)',
  '--info-border': 'var(--color-toast-info-border)',
  '--info-text': 'var(--color-chip-info-text)',
} as CSSProperties

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
  const theme = useTheme()

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
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        theme={theme}
        toastOptions={{ style: toastStyle }}
      />
    </QueryProvider>
  )
}
