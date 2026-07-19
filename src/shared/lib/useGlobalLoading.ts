import { useEffect, useState } from 'react'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'

// Evita el parpadeo en operaciones que resuelven casi al instante (ej. una
// paginación con caché tibia) — solo interesa señalizar esperas que el
// usuario realmente percibe.
const SHOW_DELAY_MS = 150

/**
 * true cuando hay alguna llamada en curso en cualquier parte de la app:
 * queries u mutaciones de React Query (guardar un formulario, construir una
 * página, refrescar una tabla al paginar...) o una transición de ruta de
 * TanStack Router. Como el QueryClient y el Router son únicos y globales,
 * esto cubre cualquier pantalla sin que cada una tenga que reportarlo.
 */
export const useGlobalLoading = (): boolean => {
  const isFetching = useIsFetching() > 0
  const isMutating = useIsMutating() > 0
  const isNavigating = useRouterState({
    select: (s) => s.status === 'pending',
  })
  const isActive = isFetching || isMutating || isNavigating

  const [debounced, setDebounced] = useState(false)

  useEffect(() => {
    // Al apagar, delay 0 (siguiente tick) en vez de un setState síncrono en
    // el efecto — evita ocultarlo antes de que el cleanup cancele un timer
    // de encendido pendiente, y mantiene un único punto donde se llama
    // setDebounced (dentro del propio timer).
    const delay = isActive ? SHOW_DELAY_MS : 0
    const timer = setTimeout(() => setDebounced(isActive), delay)
    return () => clearTimeout(timer)
  }, [isActive])

  return debounced
}
