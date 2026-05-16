import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})

export async function setupOfflinePersistence(): Promise<void> {
  if (typeof window === 'undefined') return

  const [{ persistQueryClient }, { createAsyncStoragePersister }, localforage] = await Promise.all([
    import('@tanstack/react-query-persist-client'),
    import('@tanstack/query-async-storage-persister'),
    import('localforage'),
  ])

  const persister = createAsyncStoragePersister({ storage: localforage.default })

  await persistQueryClient({
    queryClient,
    persister,
    maxAge: 24 * 60 * 60 * 1000,
  })
}
