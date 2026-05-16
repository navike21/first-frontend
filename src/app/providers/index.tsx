import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from './query.provider'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Root provider tree. Add global providers here
 * (e.g. ThemeProvider, AuthProvider).
 */
export function AppProviders({ children }: Readonly<AppProvidersProps>) {
  return (
    <QueryProvider>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </QueryProvider>
  )
}
