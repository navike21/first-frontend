import type { Language } from '@/shared/types/languages'

/** Persisted location: country (ISO-2) + deepest division code + denormalized names. */
export interface LocationValue {
  countryCode?: string
  ubigeoCode?: string
  region?: string
  province?: string
  district?: string
}

export interface LocationSelectProps {
  value: LocationValue
  onChange: (value: LocationValue) => void
  countryLabel: string
  /** Label for the free-text region/city shown when a country has no divisions. */
  regionLabel: string
  cityLabel: string
  lang: Language
  disabled?: boolean
}
