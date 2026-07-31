import type { ReactNode } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import type { Language } from '@/shared/types/languages'

/** Persisted location: country (ISO-2) + deepest division code + denormalized names. */
export interface LocationValue {
  countryCode?: string
  ubigeoCode?: string
  region?: string
  province?: string
  district?: string
}

/** RHF field paths this component reads/writes, one per `LocationValue` key —
 * lets each consumer keep its own field names/nesting (flat, `location.*`,
 * `address.*`) without LocationSelect dictating a schema shape. */
export interface LocationSelectNames<T extends FieldValues> {
  countryCode: FieldPath<T>
  ubigeoCode: FieldPath<T>
  region: FieldPath<T>
  province: FieldPath<T>
  district: FieldPath<T>
}

export interface LocationSelectProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  names: LocationSelectNames<T>
  countryLabel: ReactNode
  /** Label for the free-text region/city shown when a country has no divisions. */
  regionLabel: string
  cityLabel: string
  lang: Language
  disabled?: boolean
}
