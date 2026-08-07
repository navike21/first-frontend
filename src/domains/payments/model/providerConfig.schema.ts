import { z } from 'zod'
import type { PaymentProviderField } from './payment.types'

/** Builds a per-provider Zod schema from its own field list — same spirit as
 * the backend's `buildConfigSchema` (the field list IS the schema).
 * `enabled`/`isDefault` are the same toggles for every provider, so they're
 * added once rather than per-field. */
export function createProviderConfigCardSchema(fields: PaymentProviderField[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    enabled: z.boolean(),
    isDefault: z.boolean(),
  }
  for (const field of fields) {
    const base = z.string().trim()
    shape[field.key] = field.required ? base.min(1) : base.optional().or(z.literal(''))
  }
  return z.object(shape)
}

export type ProviderConfigCardFormData = {
  enabled: boolean
  isDefault: boolean
} & Record<string, string | boolean>

export function toProviderConfigPayload(
  fields: PaymentProviderField[],
  data: ProviderConfigCardFormData
): Record<string, string> {
  const config: Record<string, string> = {}
  for (const field of fields) {
    const value = data[field.key]
    const trimmed = typeof value === 'string' ? value.trim() : ''
    if (trimmed) config[field.key] = trimmed
  }
  return config
}
