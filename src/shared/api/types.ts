/** Non-blocking warning attached to a 2xx mutation (e.g. image upload failed). */
export interface ApiWarning {
  field: string
  code: string
  message: string
}

/** Metadata block the backend attaches to every response. */
export interface ResponseMeta {
  timestamp?: string
  [key: string]: unknown
}

/** Standard envelope returned by first-backend for every endpoint. */
export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  code: string
  message: string
  data: T
  meta?: ResponseMeta
  /**
   * Present on mutations when something non-blocking failed (e.g. the record
   * was saved but its image couldn't be uploaded). The status is still 2xx —
   * consumers must inspect this and warn the user.
   */
  warnings?: ApiWarning[]
}

/** Paginated payload shape returned by list endpoints. */
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}
