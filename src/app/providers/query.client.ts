import { QueryClient, QueryCache } from '@tanstack/react-query'
import { notify } from '@/shared/lib/notify'

// Must match the maxAge in the persister so in-memory GC and
// IndexedDB expiry stay in sync.
const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 // 24 h

const queryCache = new QueryCache({
  onError: (error, query) => {
    // Silence background refetch errors when cached data is already shown
    if (query.state.data !== undefined) return
    notify.queryError(error)
  },
})

export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min — serve fresh data when online
      gcTime: CACHE_MAX_AGE,       // 24 h — keep in memory for offline use
      retry: 1,
      networkMode: 'offlineFirst', // serve cached data when offline
    },
    mutations: {
      networkMode: 'offlineFirst', // allow mutations to run offline (enqueued)
    },
  },
})

export const CACHE_MAX_AGE_MS = CACHE_MAX_AGE
