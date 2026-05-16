import { useEffect } from 'react'
import { toast } from 'sonner'
import { useNetworkStore } from '@/shared/model'
import { replayQueue } from '@/shared/lib/offline-queue/queue.replay'

/**
 * Listens to browser online/offline events and keeps the Zustand
 * network store in sync.
 *
 * - Offline  → updates store + shows a persistent warning toast.
 * - Online   → updates store + replays the offline mutation queue
 *              + shows a success toast.
 *
 * Must be rendered inside the RouterProvider context (e.g., RootLayout).
 */
export const useNetworkStatus = (): void => {
  const setOnline = useNetworkStore((state) => state.setOnline)
  const setOffline = useNetworkStore((state) => state.setOffline)

  useEffect(() => {
    const handleOnline = (): void => {
      setOnline()
      replayQueue()
        .then(() => {
          toast.success('Conexión restaurada — cambios sincronizados')
        })
        .catch(() => {
          toast.error('Error al sincronizar cambios pendientes')
        })
    }

    const handleOffline = (): void => {
      setOffline()
      toast.warning('Sin conexión — los cambios se guardarán automáticamente')
    }

    globalThis.addEventListener('online', handleOnline)
    globalThis.addEventListener('offline', handleOffline)

    return () => {
      globalThis.removeEventListener('online', handleOnline)
      globalThis.removeEventListener('offline', handleOffline)
    }
  }, [setOnline, setOffline])
}
