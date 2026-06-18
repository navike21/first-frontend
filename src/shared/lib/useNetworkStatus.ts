import { useEffect } from 'react'
import { useNetworkStore } from '@/shared/model'
import { isTokenStored } from '@/shared/model/session.store'
import { replayQueue } from '@/shared/lib/offline-queue/queue.replay'
import { size } from '@/shared/lib/offline-queue/queue'
import { notify } from './notify'

/** Replays the offline queue and reports the outcome (synced / failed counts). */
const syncOfflineQueue = (): void => {
  replayQueue()
    .then(({ synced, failed }) => notify.syncResult(synced, failed.length))
    .catch(() => {})
}

/**
 * Listens to browser online/offline events and keeps the Zustand
 * network store in sync.
 *
 * - Offline  → updates store + shows a persistent warning toast.
 * - Online   → updates store + replays the offline mutation queue
 *              + reports how many changes synced (or failed).
 * - On mount → if already online with an authenticated session and a
 *              non-empty queue, replays it too — so a page refresh while
 *              online also flushes anything saved offline.
 *
 * Must be rendered inside the RouterProvider context (e.g., RootLayout).
 */
export const useNetworkStatus = (): void => {
  const setOnline = useNetworkStore((state) => state.setOnline)
  const setOffline = useNetworkStore((state) => state.setOffline)

  useEffect(() => {
    const handleOnline = (): void => {
      setOnline()
      syncOfflineQueue()
    }

    const handleOffline = (): void => {
      setOffline()
      notify.connectionLost()
    }

    globalThis.addEventListener('online', handleOnline)
    globalThis.addEventListener('offline', handleOffline)

    return () => {
      globalThis.removeEventListener('online', handleOnline)
      globalThis.removeEventListener('offline', handleOffline)
    }
  }, [setOnline, setOffline])

  // Flush the queue on startup (e.g. after a refresh) when we are online and
  // authenticated — the `online` event won't fire if we booted already online.
  useEffect(() => {
    if (!navigator.onLine || !isTokenStored()) return
    size()
      .then((pending) => {
        if (pending > 0) syncOfflineQueue()
      })
      .catch(() => {})
  }, [])
}
