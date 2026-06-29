import type { ReactNode } from 'react'

export interface CanProps {
  /** Required permission(s); passes if the user holds ANY. Omit to gate only on `when`. */
  anyOf?: string | readonly string[]
  /** Extra boolean AND-ed with the permission check. */
  when?: boolean
  /** Rendered when the gate fails. Defaults to nothing. */
  fallback?: ReactNode
  children: ReactNode
}
