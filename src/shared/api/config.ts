import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { useConfigCacheStore } from '@/shared/model/configCache.store'

export interface ConfigOption {
  value: string
  label: string
}

export interface CurrencyOption extends ConfigOption {
  symbol: string
}

export interface DocumentTypeOption extends ConfigOption {
  pattern?: string
  maxLength?: number
}

export interface ConfigData {
  currencies?: CurrencyOption[]
  documentTypes?: DocumentTypeOption[]
  languages?: ConfigOption[]
  industries?: ConfigOption[]
  clientTypes?: ConfigOption[]
  genders?: ConfigOption[]
}

export type ConfigGroup = keyof ConfigData

const fetchConfig = (groups: ConfigGroup[], lang: string) =>
  request<ApiResponse<ConfigData>>({
    api: `/config?groups=${groups.join(',')}&lang=${lang}`,
    method: 'GET',
  })

export const configKeys = {
  all: ['config'] as const,
  groups: (groups: ConfigGroup[], lang: string) =>
    [...configKeys.all, lang, ...[...groups].sort()] as const,
}

/**
 * Resolves a stored config value to its localized label.
 * Returns the raw value as fallback if not found (never crashes).
 */
export function labelFor(
  options: ConfigOption[] | undefined,
  value: string | undefined
): string | undefined {
  if (!value) return undefined
  return options?.find((o) => o.value === value)?.label ?? value
}

/**
 * Fetches several reference-data groups in a single request via TanStack Query.
 * Used by clients module. For a Zustand-persisted version use `useConfigData`.
 */
export const useConfig = (groups: ConfigGroup[], lang: string) =>
  useQuery({
    queryKey: configKeys.groups(groups, lang),
    queryFn: () => fetchConfig(groups, lang),
    select: (res) => res.data,
    staleTime: Infinity,
  })

const ALL_GROUPS: ConfigGroup[] = [
  'currencies',
  'documentTypes',
  'languages',
  'industries',
  'clientTypes',
  'genders',
]

const fetchAllConfig = (lang: string): Promise<ConfigData> =>
  request<ApiResponse<ConfigData>>({
    api: `/config?groups=${ALL_GROUPS.join(',')}&lang=${lang}`,
    method: 'GET',
  }).then((res) => res.data)

/**
 * Zustand-persisted version of useConfig. Fetches ALL groups at once per lang
 * and stores the result in localStorage (TTL 24h). Subsequent calls with the
 * same lang hit the store instantly — no re-fetch between form navigations.
 * Language change automatically triggers a fresh fetch for the new lang.
 */
export const useConfigData = (groups: ConfigGroup[], lang: string) => {
  const cache = useConfigCacheStore((s) => s.cache)
  const set = useConfigCacheStore((s) => s.set)
  const isValid = useConfigCacheStore((s) => s.isValid)

  useEffect(() => {
    if (isValid(lang)) return
    fetchAllConfig(lang).then((data) => set(lang, data)).catch(() => {})
  }, [lang, isValid, set])

  const entry = cache[lang]
  if (!entry) return { data: undefined, isLoading: true }

  const data = groups.reduce<Partial<ConfigData>>((acc, g) => {
    const val = entry.data[g]
    if (val !== undefined) (acc as Record<string, unknown>)[g] = val
    return acc
  }, {})

  return { data, isLoading: false }
}
