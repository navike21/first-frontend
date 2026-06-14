import { enqueue } from '@/shared/lib/offline-queue/queue'
import { useSessionStore } from '@/shared/model'
import { notify } from '@/shared/lib/notify'
import { handleUnauthorized } from './unauthorized'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/** Represents any value that can be safely serialised with JSON.stringify */
export type JsonBody =
  | string
  | number
  | boolean
  | null
  | JsonBody[]
  | { [key: string]: JsonBody }

/**
 * Thrown when a non-GET request is intercepted offline and added to the queue.
 * Callers (e.g. useMutation onError) can check `instanceof OfflineQueuedError`
 * to show a "saved for sync" message instead of an error.
 */
export class OfflineQueuedError extends Error {
  constructor(method: HttpMethod, api: string) {
    super(`Request queued offline: ${method} ${api}`)
    this.name = 'OfflineQueuedError'
  }
}

/** Field-level validation issue returned by the backend in `details.validation[]`. */
export interface ValidationIssue {
  path: string
  message: string
}

/** Structured error payload the backend may attach under `details`. */
export interface ApiErrorDetails {
  /** 422 VALIDATION_SCHEMA_ERROR — per-field issues. */
  validation?: ValidationIssue[]
  /** 409 RESOURCE_DUPLICATE — offending unique key names. */
  keys?: string[]
  [key: string]: unknown
}

export class HttpError extends Error {
  readonly status: number
  readonly statusText: string
  /** Backend error code (e.g. `VALIDATION_SCHEMA_ERROR`, `RESOURCE_DUPLICATE`). */
  readonly code?: string
  /** Structured details (validation issues, duplicate keys, …). */
  readonly details?: ApiErrorDetails

  constructor(
    status: number,
    statusText: string,
    message?: string,
    code?: string,
    details?: ApiErrorDetails
  ) {
    super(message ?? `HTTP ${status}: ${statusText}`)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.code = code
    this.details = details
  }
}

export interface RequestConfig<TBody = unknown> extends Omit<
  RequestInit,
  'body' | 'method'
> {
  /** Endpoint path or full URL */
  api: string
  method: HttpMethod
  /** Request payload — must be JSON-serialisable */
  body?: TBody
}

/**
 * Generic HTTP client utility.
 *
 * @example
 * const user = await request<User>({ api: '/users/1', method: 'GET' })
 * const created = await request<User, NewUser>({ api: '/users', method: 'POST', body: { name: 'Ana' } })
 */
export async function request<TResponse, TBody = unknown>({
  api,
  method,
  body,
  ...init
}: RequestConfig<TBody>): Promise<TResponse> {
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData

  // Multipart uploads can't be JSON-serialised into the offline queue, so they
  // require a live connection; only JSON mutations are queued offline.
  if (!navigator.onLine && method !== 'GET' && !isFormData) {
    await enqueue({
      api,
      method,
      body: body as JsonBody | undefined,
      timestamp: Date.now(),
    })
    throw new OfflineQueuedError(method, api)
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

  const token = useSessionStore.getState().token

  // For FormData the browser sets `Content-Type` (with the multipart boundary)
  // automatically — setting it by hand breaks the upload.
  const defaultHeaders: HeadersInit = {
    Accept: 'application/json',
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token !== null && { Authorization: `Bearer ${token}` }),
  }

  let requestBody: BodyInit | undefined
  if (isFormData) {
    requestBody = body as FormData
  } else if (body !== undefined) {
    requestBody = JSON.stringify(body)
  }

  const response = await fetch(`${baseUrl}${api}`, {
    ...init,
    method,
    headers: { ...defaultHeaders, ...init.headers },
    body: requestBody,
  })

  if (!response.ok) {
    let apiMessage: string | undefined
    let apiCode: string | undefined
    let apiDetails: ApiErrorDetails | undefined
    try {
      const errBody = (await response.json()) as {
        message?: string
        code?: string
        details?: ApiErrorDetails
      }
      apiMessage = errBody.message
      apiCode = errBody.code
      apiDetails = errBody.details
    } catch {
      // body not parseable — use HTTP defaults
    }

    if (response.status === 401) {
      notify.error(apiMessage ?? 'Sesión expirada o inválida')
      useSessionStore.getState().clearSession()
      handleUnauthorized()
    }

    throw new HttpError(
      response.status,
      response.statusText,
      apiMessage,
      apiCode,
      apiDetails
    )
  }

  // 204 No Content — no body to parse; caller should type TResponse as void
  if (response.status === 204) {
    return undefined as unknown as TResponse
  }

  return (await response.json()) as TResponse
}
