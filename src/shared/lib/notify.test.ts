import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toast } from 'sonner'
import { HttpError, OfflineQueuedError } from '@/shared/api'
import { useLanguageStore } from '@/shared/model/language.store'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

import { notify } from './notify'

describe('notify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useLanguageStore.setState({ language: 'es' })
  })

  describe('success', () => {
    it('calls toast.success with the message', () => {
      notify.success('Operation successful')
      expect(toast.success).toHaveBeenCalledWith('Operation successful')
    })
  })

  describe('error', () => {
    it('calls toast.error with the message', () => {
      notify.error('Something went wrong')
      expect(toast.error).toHaveBeenCalledWith('Something went wrong')
    })
  })

  describe('info', () => {
    it('calls toast.info with the message', () => {
      notify.info('For your information')
      expect(toast.info).toHaveBeenCalledWith('For your information')
    })
  })

  describe('warning', () => {
    it('calls toast.warning with the message', () => {
      notify.warning('Be careful')
      expect(toast.warning).toHaveBeenCalledWith('Be careful')
    })
  })

  describe('queryError', () => {
    it('shows localized HTTP 404 message for es', () => {
      useLanguageStore.setState({ language: 'es' })
      notify.queryError(new HttpError(404, 'Not Found'))
      expect(toast.error).toHaveBeenCalledWith(
        'El recurso solicitado no existe.'
      )
    })

    it('shows localized HTTP 404 message for en', () => {
      useLanguageStore.setState({ language: 'en' })
      notify.queryError(new HttpError(404, 'Not Found'))
      expect(toast.error).toHaveBeenCalledWith(
        'The requested resource does not exist.'
      )
    })

    it('uses HttpError.message when status has no locale mapping', () => {
      notify.queryError(new HttpError(418, "I'm a teapot", "I'm a teapot"))
      expect(toast.error).toHaveBeenCalledWith("I'm a teapot")
    })

    it('shows network error message for non-HttpError', () => {
      notify.queryError(new Error('network failed'))
      expect(toast.error).toHaveBeenCalledWith(
        'Error de red. Verifica tu conexión e intenta nuevamente.'
      )
    })

    it('shows network error message for en when non-HttpError', () => {
      useLanguageStore.setState({ language: 'en' })
      notify.queryError(new TypeError('fetch failed'))
      expect(toast.error).toHaveBeenCalledWith(
        'Network error. Check your connection and try again.'
      )
    })

    it('skips toast for 401 HttpError', () => {
      notify.queryError(new HttpError(401, 'Unauthorized'))
      expect(toast.error).not.toHaveBeenCalled()
    })

    it('ignores OfflineQueuedError (the offline toast is shown elsewhere)', () => {
      notify.queryError(new OfflineQueuedError('POST', '/users'))
      expect(toast.error).not.toHaveBeenCalled()
    })
  })

  describe('offlineQueued', () => {
    it('shows the localized info toast (es)', () => {
      notify.offlineQueued()
      expect(toast.info).toHaveBeenCalledWith(
        'Guardado sin conexión. Se sincronizará al reconectar.'
      )
    })
  })

  describe('connectionLost', () => {
    it('shows the localized warning (es)', () => {
      notify.connectionLost()
      expect(toast.warning).toHaveBeenCalledWith(
        'Sin conexión — los cambios se guardarán automáticamente.'
      )
    })
  })

  describe('syncResult', () => {
    it('no-ops when nothing was processed', () => {
      notify.syncResult(0, 0)
      expect(toast.success).not.toHaveBeenCalled()
      expect(toast.warning).not.toHaveBeenCalled()
    })

    it('success toast when everything synced (es)', () => {
      notify.syncResult(3, 0)
      expect(toast.success).toHaveBeenCalledWith(
        'Conexión restaurada — 3 cambio(s) sincronizado(s).'
      )
    })

    it('warning toast when some changes failed (es)', () => {
      notify.syncResult(2, 1)
      expect(toast.warning).toHaveBeenCalledWith(
        '2 sincronizado(s), 1 no se pudieron sincronizar.'
      )
    })
  })
})
