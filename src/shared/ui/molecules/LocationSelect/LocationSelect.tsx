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

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

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

const DivisionLevel = ({
  country,
  parentCode,
  level,
  selectedCode,
  lang,
  disabled,
  onSelect,
}: {
  country: string
  parentCode?: string
  level: number
  selectedCode?: string
  lang: Language
  disabled?: boolean
  onSelect: (code: string, name: string, hasChildren: boolean) => void
}) => {
  const { data, isLoading } = useDivisions(country, parentCode)
  const label = capitalize(data?.levels?.[level] ?? '')
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
      disabled={disabled || isLoading}
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

  const countryOptions = [
    { value: '', label: '—' },
    ...(countries ?? []).map((c) => ({
      value: c.code,
      label: c.name,
    })),
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

      {country?.hasDivisions && value.countryCode && (
        <>
          <DivisionLevel
            country={value.countryCode}
            level={0}
            selectedCode={path[0]?.code}
            lang={lang}
            disabled={disabled}
            onSelect={(c, n, h) => handleLevelSelect(0, c, n, h)}
          />
          {path[0]?.hasChildren && (
            <DivisionLevel
              country={value.countryCode}
              parentCode={path[0].code}
              level={1}
              selectedCode={path[1]?.code}
              lang={lang}
              disabled={disabled}
              onSelect={(c, n, h) => handleLevelSelect(1, c, n, h)}
            />
          )}
          {path[1]?.hasChildren && (
            <DivisionLevel
              country={value.countryCode}
              parentCode={path[1].code}
              level={2}
              selectedCode={path[2]?.code}
              lang={lang}
              disabled={disabled}
              onSelect={(c, n, h) => handleLevelSelect(2, c, n, h)}
            />
          )}
        </>
      )}

      {!country?.hasDivisions && value.countryCode && (
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
