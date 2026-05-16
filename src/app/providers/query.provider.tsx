import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { queryClient } from './query.client'

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: Readonly<QueryProviderProps>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
