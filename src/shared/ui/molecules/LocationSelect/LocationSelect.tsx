import { useState } from 'react'
import { useController, type FieldValues } from 'react-hook-form'
import { Select } from '../Select/Select'
import { InputField } from '../InputField/InputField'
import { FormGrid } from '../FormGrid/FormGrid'
import { useCountries, useDivisions } from '@/shared/api/geo'
import type { Language } from '@/shared/types/languages'
import type {
  LocationSelectProps,
  LocationValue,
} from './LocationSelect.types'

interface PathItem {
  code: string
  name: string
  hasChildren: boolean
}

// Shown locked before a country is chosen (the app is Peru-first); once a
// division-based country is selected its own `divisionLevels` take over.
const DEFAULT_DIVISION_LEVELS = ['Departamento', 'Provincia', 'Distrito']

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
    items.push({
      code: code.slice(0, 2),
      name: value.region ?? '',
      hasChildren: true,
    })
  if (code.length >= 4)
    items.push({
      code: code.slice(0, 4),
      name: value.province ?? '',
      hasChildren: true,
    })
  if (code.length >= 6)
    items.push({
      code: code.slice(0, 6),
      name: value.district ?? '',
      hasChildren: false,
    })
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
  const { data, isFetching } = useDivisions(
    locked ? undefined : country,
    parentCode
  )
  const options = [
    { value: '', label: '—' },
    ...(data?.items ?? []).map((item) => ({
      value: item.code,
      label: item.name,
    })),
  ]

  return (
    <Select
      label={label}
      options={options}
      value={selectedCode ?? ''}
      lang={lang}
      disabled={locked}
      loading={isFetching}
      onChange={(e) => {
        const code = e.target.value
        const item = data?.items.find((i) => i.code === code)
        onSelect(code, item?.name ?? '', !!item?.hasChildren)
      }}
    />
  )
}

export function LocationSelect<T extends FieldValues>({
  control,
  names,
  countryLabel,
  regionLabel,
  cityLabel,
  lang,
  disabled,
}: LocationSelectProps<T>) {
  const { data: countries } = useCountries(lang)
  const { field: countryField } = useController({
    control,
    name: names.countryCode,
  })
  const { field: ubigeoField } = useController({
    control,
    name: names.ubigeoCode,
  })
  const { field: regionField } = useController({ control, name: names.region })
  const { field: provinceField } = useController({
    control,
    name: names.province,
  })
  const { field: districtField } = useController({
    control,
    name: names.district,
  })

  const countryCode = (countryField.value as string | undefined) ?? ''
  const ubigeoCode = ubigeoField.value as string | undefined
  const region = regionField.value as string | undefined
  const province = provinceField.value as string | undefined
  const district = districtField.value as string | undefined

  const [path, setPath] = useState<PathItem[]>(() =>
    buildInitialPath({ countryCode, ubigeoCode, region, province, district })
  )

  const country = countries?.find((c) => c.code === countryCode)
  const isDivisionsCountry = country?.hasDivisions
  // Show the cascade up front (locked) even before a country is chosen; a
  // selected country without divisions falls back to free-text region/city.
  const showDivisions = !countryCode || !!isDivisionsCountry
  const levels = country?.divisionLevels ?? DEFAULT_DIVISION_LEVELS

  const countryOptions = [
    { value: '', label: '—' },
    ...(countries ?? []).map((c) => ({ value: c.code, label: c.name })),
  ]

  const handleCountry = (code: string) => {
    setPath([])
    countryField.onChange(code || '')
    ubigeoField.onChange(undefined)
    regionField.onChange(undefined)
    provinceField.onChange(undefined)
    districtField.onChange(undefined)
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
    ubigeoField.onChange(next.length ? next[next.length - 1].code : undefined)
    regionField.onChange(next[0]?.name)
    provinceField.onChange(next[1]?.name)
    districtField.onChange(next[2]?.name)
  }

  return (
    <FormGrid>
      <Select
        label={countryLabel}
        options={countryOptions}
        value={countryCode}
        lang={lang}
        disabled={disabled}
        onChange={(e) => handleCountry(e.target.value)}
      />

      {showDivisions &&
        levels.map((label, i) => (
          <DivisionLevel
            key={label}
            country={countryCode}
            parentCode={i === 0 ? undefined : path[i - 1]?.code}
            label={label}
            selectedCode={path[i]?.code}
            locked={
              !!disabled || !isDivisionsCountry || (i > 0 && !path[i - 1])
            }
            lang={lang}
            onSelect={(c, n, h) => handleLevelSelect(i, c, n, h)}
          />
        ))}

      {countryCode && !isDivisionsCountry && (
        <>
          <InputField
            label={regionLabel}
            value={region ?? ''}
            disabled={disabled}
            onChange={(e) => regionField.onChange(e.target.value)}
          />
          <InputField
            label={cityLabel}
            value={province ?? ''}
            disabled={disabled}
            onChange={(e) => provinceField.onChange(e.target.value)}
          />
        </>
      )}
    </FormGrid>
  )
}
