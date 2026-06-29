import { useHasPermission } from '@/shared/lib/permissions'
import type { CanProps } from './Can.types'

/** Authorization gate: renders `children` only when the user satisfies `anyOf` and `when`. */
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
