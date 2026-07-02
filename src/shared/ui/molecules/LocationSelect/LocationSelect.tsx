import { useState } from 'react'
import { Select } from '../Select/Select'
import { InputField } from '../InputField/InputField'
import { useCountries, useDivisions } from '@/shared/api/geo'
import type { Language } from '@/shared/types/languages'
import type { LocationSelectProps, LocationValue } from './LocationSelect.types'

interface PathItem {
  code: string
  name: string
  hasChildren: boolean
}

/**
 * Reconstructs the cascade path from a stored ubigeo code. Peru's codes are
 * hierarchical prefixes (departamento=2, provincia=4, distrito=6 digits), so
 * the intermediate codes can be derived without persisting them.
 */
function buildInitialPath(value: LocationValue): PathItem[] {
  if (value.countryCode !== 'PE' || !value.ubigeoCode) return []
  const code = value.ubigeoCode
  const items: PathItem[] = []
  if (code.length >= 2)
    items.push({ code: code.slice(0, 2), name: value.region ?? '', hasChildren: true })
  if (code.length >= 4)
    items.push({ code: code.slice(0, 4), name: value.province ?? '', hasChildren: true })
  if (code.length >= 6)
    items.push({ code: code.slice(0, 6), name: value.district ?? '', hasChildren: false })
  return items
}

/**
 * One cascading division select. Stays disabled (and does not fetch) until its
 * parent level is chosen; shows a loading spinner while its options load.
 */
const DivisionLevel = ({
  country,
  parentCode,
  label,
  selectedCode,
  locked,
  lang,
  onSelect,
}: {
  country: string
  parentCode?: string
  label: string
  selectedCode?: string
  locked: boolean
  lang: Language
  onSelect: (code: string, name: string, hasChildren: boolean) => void
}) => {
  const { data, isFetching } = useDivisions(locked ? undefined : country, parentCode)
  const options = [
    { value: '', label: '—' },
    ...(data?.items ?? []).map((item) => ({ value: item.code, label: item.name })),
  ]

  return (
    <Select
      label={label}
      options={options}
      value={selectedCode ?? ''}
      lang={lang}
      disabled={locked || isFetching}
      loading={isFetching}
      onChange={(e) => {
        const code = e.target.value
        const item = data?.items.find((i) => i.code === code)
        onSelect(code, item?.name ?? '', !!item?.hasChildren)
      }}
    />
  )
}

export const LocationSelect = ({
  value,
  onChange,
  countryLabel,
  regionLabel,
  cityLabel,
  lang,
  disabled,
}: LocationSelectProps) => {
  const { data: countries } = useCountries()
  const [path, setPath] = useState<PathItem[]>(() => buildInitialPath(value))

  const country = countries?.find((c) => c.code === value.countryCode)
  const levels = country?.divisionLevels ?? []

  const countryOptions = [
    { value: '', label: '—' },
    ...(countries ?? []).map((c) => ({ value: c.code, label: c.name })),
  ]

  const handleCountry = (code: string) => {
    setPath([])
    onChange({ countryCode: code || undefined })
  }

  const handleLevelSelect = (
    level: number,
    code: string,
    name: string,
    hasChildren: boolean
  ) => {
    const next = path.slice(0, level)
    if (code) next[level] = { code, name, hasChildren }
    setPath(next)
    onChange({
      countryCode: value.countryCode,
      ubigeoCode: next.length ? next[next.length - 1].code : undefined,
      region: next[0]?.name,
      province: next[1]?.name,
      district: next[2]?.name,
    })
  }

  return (
    <>
      <Select
        label={countryLabel}
        options={countryOptions}
        value={value.countryCode ?? ''}
        lang={lang}
        disabled={disabled}
        onChange={(e) => handleCountry(e.target.value)}
      />

      {country?.hasDivisions &&
        levels.map((label, i) => (
          <DivisionLevel
            key={label}
            country={value.countryCode as string}
            parentCode={i === 0 ? undefined : path[i - 1]?.code}
            label={label}
            selectedCode={path[i]?.code}
            locked={!!disabled || (i > 0 && !path[i - 1])}
            lang={lang}
            onSelect={(c, n, h) => handleLevelSelect(i, c, n, h)}
          />
        ))}

      {country && !country.hasDivisions && (
        <>
          <InputField
            label={regionLabel}
            value={value.region ?? ''}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, region: e.target.value })}
          />
          <InputField
            label={cityLabel}
            value={value.province ?? ''}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, province: e.target.value })}
          />
        </>
      )}
    </>
  )
}
