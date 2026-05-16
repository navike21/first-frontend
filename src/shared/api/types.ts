/** Standard envelope returned by first-backend for every endpoint. */
export interface ApiResponse<T> {
  statusCode: number
  code: string
  message: string
  ns: string
  data: T
}

/** Paginated payload shape returned by list endpoints. */
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}
