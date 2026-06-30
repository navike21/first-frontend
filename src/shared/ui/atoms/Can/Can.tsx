import { useHasPermission } from '@/shared/lib/permissions'
import type { CanProps } from './Can.types'

const toRequired = (value: CanProps['anyOf']): string[] => {
  if (value === undefined) return []
  return typeof value === 'string' ? [value] : [...value]
}

/** Authorization gate: renders `children` only when the user satisfies `anyOf` and `when`. */
export const Can = ({
  anyOf,
  when = true,
  fallback = null,
  children,
}: CanProps) => {
  const required = toRequired(anyOf)
  const hasAny = useHasPermission(...required)
  // Empty `required` ⇒ no permission requirement (gate only on `when`).
  const allowed = (required.length === 0 || hasAny) && when
  return <>{allowed ? children : fallback}</>
}
