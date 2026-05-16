import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      // Serve cache when offline; never mark query as paused
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Allow mutation functions to run offline (they enqueue via request())
      networkMode: 'offlineFirst',
    },
  },
})
