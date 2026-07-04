import { enqueue } from '@/shared/lib/offline-queue/queue'
import { useSessionStore } from '@/shared/model'
import { notify } from '@/shared/lib/notify'
import { handleUnauthorized } from './unauthorized'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type LanguageProvider = () => string | undefined
let _languageProvider: LanguageProvider | null = null

/**
 * Registers a getter for the current UI language, sent as `Accept-Language` on
 * every request so backend messages/warnings come localized. Injected (not
 * imported) to avoid an import cycle: the language store depends on `request`
 * (via preference syncing), so `request` must not import the language store.
 */
export function registerLanguageProvider(fn: LanguageProvider): void {
  _languageProvider = fn
}

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface ErrorPayload {
  message?: string
  code?: string
  details?: ApiErrorDetails
}

async function parseErrorBody(res: Response): Promise<ErrorPayload> {
  try {
    return (await res.json()) as ErrorPayload
  } catch {
    return {}
  }
}

function clearAndRedirect(message?: string): void {
  notify.error(message ?? 'Sesión expirada o inválida')
  useSessionStore.getState().clearSession()
  handleUnauthorized()
}

async function retryWithToken<TResponse>(
  url: string,
  method: HttpMethod,
  requestBody: BodyInit | undefined,
  headers: HeadersInit,
  init: RequestInit,
): Promise<TResponse> {
  const res = await fetch(url, { ...init, method, headers, body: requestBody })
  if (res.ok) {
    if (res.status === 204) return undefined as unknown as TResponse
    return (await res.json()) as TResponse
  }
  const err = await parseErrorBody(res)
  if (res.status === 401) clearAndRedirect(err.message)
  throw new HttpError(res.status, res.statusText, err.message, err.code, err.details)
}

async function handle401<TResponse>(
  url: string,
  method: HttpMethod,
  requestBody: BodyInit | undefined,
  defaultHeaders: HeadersInit,
  init: RequestInit,
  apiError: ErrorPayload,
): Promise<TResponse> {
  const newToken = await attemptRefresh()

  if (newToken !== null) {
    const { user } = useSessionStore.getState()
    if (user) useSessionStore.getState().setSession(newToken, user)
    const headers: HeadersInit = {
      ...defaultHeaders,
      Authorization: `Bearer ${newToken}`,
      ...init.headers,
    }
    return retryWithToken<TResponse>(url, method, requestBody, headers, init)
  }

  clearAndRedirect(apiError.message)
  throw new HttpError(401, 'Unauthorized', apiError.message, apiError.code, apiError.details)
}

// ─── Refresh promise ───────────────────────────────────────────────────────────

// Shared refresh promise — all concurrent 401s wait on the same attempt
let _refreshPromise: Promise<string | null> | null = null

async function attemptRefresh(): Promise<string | null> {
  if (_refreshPromise) return _refreshPromise
  _refreshPromise = (async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) return null
      const body = (await res.json()) as { data?: { accessToken?: string } }
      return body.data?.accessToken ?? null
    } catch {
      return null
    } finally {
      _refreshPromise = null
    }
  })()
  return _refreshPromise
}

// ─── Main request ──────────────────────────────────────────────────────────────

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
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

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
  const lang = _languageProvider?.()

  // For FormData the browser sets `Content-Type` (with the multipart boundary)
  // automatically — setting it by hand breaks the upload.
  const defaultHeaders: HeadersInit = {
    Accept: 'application/json',
    ...(lang && { 'Accept-Language': lang }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token !== null && { Authorization: `Bearer ${token}` }),
  }

  let requestBody: BodyInit | undefined
  if (isFormData) {
    requestBody = body as FormData
  } else if (body !== undefined) {
    requestBody = JSON.stringify(body)
  }

  const url = `${baseUrl}${api}`
  const response = await fetch(url, {
    ...init,
    method,
    headers: { ...defaultHeaders, ...init.headers },
    body: requestBody,
  })

  if (!response.ok) {
    const apiError = await parseErrorBody(response)
    if (response.status === 401) {
      return handle401<TResponse>(url, method, requestBody, defaultHeaders, init, apiError)
    }
    throw new HttpError(response.status, response.statusText, apiError.message, apiError.code, apiError.details)
  }

  // 204 No Content — no body to parse; caller should type TResponse as void
  if (response.status === 204) return undefined as unknown as TResponse
  return (await response.json()) as TResponse
}
