import type { ReactNode } from 'react'
import { useHasPermission } from '@/shared/lib/permissions'

export interface CanProps {
  /**
   * Permission(s) required to render `children`; passes if the user holds ANY
   * of them (the `*:*` super-root wildcard always passes). Omit to skip the
   * permission check (gate purely on `when`).
   */
  anyOf?: string | readonly string[]
  /**
   * Extra boolean condition, AND-ed with the permission check. Lets `<Can>`
   * double as a generic conditional gate (`<Can when={cond}>`).
   */
  when?: boolean
  /** Rendered when the gate fails. Defaults to nothing. */
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Authorization gate: renders `children` only when the current user satisfies
 * the permission requirement (and the optional `when` flag). Centralizes UI
 * gating so restricted actions/sections are never shown to users who lack the
 * permission — complements (does not replace) backend enforcement and route
 * guards.
 *
 * @example
 * <Can anyOf={CAN.usersCreate}><LinkButton .../></Can>
 * <Can when={selected.length > 0}><BulkBar /></Can>
 */
export const Can = ({
  anyOf,
  when = true,
  fallback = null,
  children,
}: CanProps) => {
  const required =
    anyOf === undefined ? [] : Array.isArray(anyOf) ? anyOf : [anyOf as string]
  const hasAny = useHasPermission(...(required as string[]))
  // Empty `required` ⇒ no permission requirement (gate only on `when`).
  const allowed = (required.length === 0 || hasAny) && when
  return <>{allowed ? children : fallback}</>
}
