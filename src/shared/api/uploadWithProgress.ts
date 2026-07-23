import { useSessionStore } from '@/shared/model'
import { HttpError, getCurrentLanguage, parseErrorJson, type ApiErrorDetails } from './api.services'

export interface UploadProgress {
  loaded: number
  total: number
  /** 0-100, rounded. */
  percentage: number
}

export interface UploadWithProgressConfig {
  api: string
  method: 'POST' | 'PATCH' | 'PUT'
  body: FormData
  onProgress?: (progress: UploadProgress) => void
}

/**
 * Multipart upload with real progress via `XMLHttpRequest` — `fetch()` has no
 * browser API to observe upload progress (only download), so anything that
 * needs a percentage (Media Library, entity image uploads) goes through this
 * instead of the shared `request()`.
 *
 * Deliberately simpler than `request()` in two ways: no offline queueing (a
 * file upload already needs a live connection — same rule `request()` itself
 * applies to FormData bodies) and no silent 401-refresh-and-retry (a session
 * expiring mid-upload is a rare edge case) — a 401 here just rejects with
 * `HttpError`, same as any other status.
 */
export function uploadWithProgress<TResponse>({
  api,
  method,
  body,
  onProgress,
}: UploadWithProgressConfig): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
    const token = useSessionStore.getState().token
    const lang = getCurrentLanguage()

    const xhr = new XMLHttpRequest()
    xhr.open(method, `${baseUrl}${api}`)
    xhr.setRequestHeader('Accept', 'application/json')
    if (lang) xhr.setRequestHeader('Accept-Language', lang)
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return
      onProgress({
        loaded: event.loaded,
        total: event.total,
        percentage: Math.round((event.loaded / event.total) * 100),
      })
    }

    xhr.onload = () => {
      let parsedBody: unknown
      try {
        parsedBody = xhr.responseText ? JSON.parse(xhr.responseText) : undefined
      } catch {
        parsedBody = undefined
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve((xhr.status === 204 ? undefined : parsedBody) as TResponse)
        return
      }

      const errPayload = parseErrorJson(
        (parsedBody ?? {}) as { message?: string; error?: { code?: string; details?: ApiErrorDetails } }
      )
      reject(new HttpError(xhr.status, xhr.statusText, errPayload.message, errPayload.code, errPayload.details))
    }

    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(body)
  })
}
