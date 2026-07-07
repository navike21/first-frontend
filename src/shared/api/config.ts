import { useEffect } from 'react'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { useConfigCacheStore, CONFIG_CACHE_TTL_MS } from '@/shared/model/configCache.store'

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
  technologies?: ConfigOption[]
}

export type ConfigGroup = keyof ConfigData

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

const fetchGroups = (lang: string, groups: ConfigGroup[]): Promise<Partial<ConfigData>> =>
  request<ApiResponse<ConfigData>>({
    api: `/config?groups=${groups.join(',')}&lang=${lang}`,
    method: 'GET',
  }).then((res) => res.data)

/**
 * Zustand-persisted config hook. Fetches ONLY the requested groups, merges
 * them into the per-lang cache entry (localStorage, TTL 24h). Navigating
 * between records never re-fetches; language change fetches only for the new
 * lang; each module only pays for the groups it actually uses.
 */
export const useConfigData = (groups: ConfigGroup[], lang: string) => {
  const cache = useConfigCacheStore((s) => s.cache)
  // Stable key so the effect doesn't re-run on every render (groups is a literal array)
  const groupsKey = [...groups].sort().join(',')

  useEffect(() => {
    const { cache: current, merge } = useConfigCacheStore.getState()
    const entry = current[lang]
    const isExpired = !!entry && Date.now() - entry.fetchedAt >= CONFIG_CACHE_TTL_MS

    // Groups that need fetching: expired ones are re-fetched, missing ones fetched for the first time
    const toFetch = isExpired
      ? groups
      : groups.filter((g) => !entry?.data[g])

    if (toFetch.length === 0) return
    fetchGroups(lang, toFetch).then((data) => merge(lang, data)).catch(() => {})
    // groupsKey is a serialized dep for `groups` — exhaustive-deps false positive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, groupsKey])

  const entry = cache[lang]
  const hasAll = !!entry && groups.every((g) => !!entry.data[g])

  if (!hasAll) return { data: undefined, isLoading: true }

  const data = groups.reduce<Partial<ConfigData>>((acc, g) => {
    ;(acc as Record<string, unknown>)[g] = entry.data[g]
    return acc
  }, {})

  return { data, isLoading: false }
}
