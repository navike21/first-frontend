import { useLanguage } from '@/shared/model'
import { useCountries } from '@/shared/api/geo'
import { COUNTRY_FLAGS, type FlagIcon } from './countryFlags'

export interface CountryLabelProps {
  /** ISO-3166 alpha-2 country code (e.g. "PE"). */
  code?: string
  /** Hide the country name, showing only the flag. */
  flagOnly?: boolean
}

/** Renders a country as its flag + localized name (falls back to the code). */
export const CountryLabel = ({ code, flagOnly }: CountryLabelProps) => {
  const language = useLanguage()
  const { data: countries } = useCountries(language)
  if (!code) return null

  const upper = code.toUpperCase()
  const Flag: FlagIcon | undefined = COUNTRY_FLAGS[upper]
  const name = countries?.find((c) => c.code === upper)?.name ?? upper

  return (
    <span className="inline-flex items-center gap-2">
      {Flag && <Flag title={name} className="h-3.5 w-5 shrink-0 rounded-sm" />}
      {!flagOnly && <span>{name}</span>}
    </span>
  )
}
