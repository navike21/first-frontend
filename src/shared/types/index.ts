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

/** Theme preference as stored by the backend (the UI resolves `system`). */
export type ThemePreference = 'light' | 'dark' | 'system'

/** Per-user UI preferences synced with the backend (`/users/me/preferences`). */
export interface UserPreferences {
  /** Supported language code (e.g. `es`, `en`). */
  language?: string
  /** Primary color as hex `#RRGGBB`. */
  primaryColor?: string
  theme?: ThemePreference
}

/** Authenticated user returned by the login API. */
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  profilePictureUrl?: string
  permissions: string[]
  /** UI preferences returned at login so the front can apply them immediately. */
  preferences?: UserPreferences
}
