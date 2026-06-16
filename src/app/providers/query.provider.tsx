import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import localforage from 'localforage'
import type { ReactNode } from 'react'
import { queryClient, CACHE_MAX_AGE_MS } from './query.client'

// localforage stores values as any type — we restrict the persister
// to serialised strings so the TanStack persister API is satisfied.
const storage = {
  getItem: (key: string) => localforage.getItem<string>(key),
  setItem: (key: string, value: string) => localforage.setItem(key, value),
  removeItem: (key: string) => localforage.removeItem(key),
}

const persister = createAsyncStoragePersister({
  storage,
  key: 'first_query_cache',
  throttleTime: 1000, // write to IndexedDB at most once per second
})

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: Readonly<QueryProviderProps>) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: CACHE_MAX_AGE_MS,
        buster: import.meta.env.VITE_APP_VERSION ?? '1',
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
