import { toast } from 'sonner'
import { HttpError } from '@/shared/api'

const HTTP_MESSAGES: Partial<Record<number, string>> = {
  400: 'Solicitud incorrecta.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'Conflicto con el estado actual del recurso.',
  422: 'Los datos enviados no son válidos.',
  429: 'Demasiadas solicitudes. Espera un momento.',
  500: 'Error interno del servidor.',
  502: 'El servidor no está disponible en este momento.',
  503: 'Servicio temporalmente no disponible.',
}

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),

  /**
   * Translates a caught query/mutation error into a user-facing toast.
   * - 401 is silenced — auth guards handle the redirect.
   * - Network and CORS failures show a connection message.
   * - HTTP errors show a localised message or the status text as fallback.
   */
  queryError: (error: unknown) => {
    if (error instanceof HttpError) {
      if (error.status === 401) return
      const message = HTTP_MESSAGES[error.status] ?? `Error ${error.status}: ${error.statusText}`
      toast.error(message)
    } else {
      // TypeError: Failed to fetch (CORS, DNS, offline, etc.)
      toast.error('Error de red. Verifica tu conexión e intenta nuevamente.')
    }
  },
}
