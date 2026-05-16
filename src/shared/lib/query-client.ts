import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      networkMode: 'offlineFirst',
      retry: (failureCount, error) => {
        const status = (error as { status?: number }).status
        if (status !== undefined && status >= 400 && status < 500) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})

export async function setupOfflinePersistence() {
  if (typeof window === 'undefined') return

  const [{ persistQueryClient }, { createAsyncStoragePersister }, localforageModule] =
    await Promise.all([
      import('@tanstack/react-query-persist-client'),
      import('@tanstack/query-async-storage-persister'),
      import('localforage'),
    ])

  const localforage = localforageModule.default

  localforage.config({
    name: 'first-frontend',
    storeName: 'query-cache',
    description: 'TanStack Query offline cache',
  })

  const persister = createAsyncStoragePersister({
    storage: localforage,
    key: 'FIRST_QUERY_CACHE',
  })

  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => query.state.status === 'success',
    },
  })
}
