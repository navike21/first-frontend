import { enqueue } from '@/shared/lib/offline-queue/queue'
import { useSessionStore } from '@/shared/model'

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

export class HttpError extends Error {
  readonly status: number
  readonly statusText: string

  constructor(status: number, statusText: string, message?: string) {
    super(message ?? `HTTP ${status}: ${statusText}`)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
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
  if (!navigator.onLine && method !== 'GET') {
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

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token !== null && { Authorization: `Bearer ${token}` }),
  }

  const response = await fetch(`${baseUrl}${api}`, {
    ...init,
    method,
    headers: { ...defaultHeaders, ...init.headers },
    body: (body !== undefined && JSON.stringify(body)) || undefined,
  })

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText)
  }

  // 204 No Content — no body to parse; caller should type TResponse as void
  if (response.status === 204) {
    return undefined as unknown as TResponse
  }

  return (await response.json()) as TResponse
}
