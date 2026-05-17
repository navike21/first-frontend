/** Shared utility types used across features. */

/** A value that may be null. */
export type Nullable<T> = T | null

/** Branded string identifier — use for domain ID types. */
export type BrandedId<Brand extends string> = string & {
  readonly _brand: Brand
}

/** Async operation state. */
export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

/** Authenticated user returned by the login API. */
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  permissions: string[]
}
