import { useQuery } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'

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
 * Fetches several reference-data groups (currencies, document types, languages,
 * industries) in a single request. Cached for the session.
 */
export const useConfig = (groups: ConfigGroup[], lang: string) =>
  useQuery({
    queryKey: configKeys.groups(groups, lang),
    queryFn: () => fetchConfig(groups, lang),
    select: (res) => res.data,
    staleTime: Infinity,
  })
