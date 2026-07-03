import { useQuery } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'

export interface GeoCountry {
  code: string
  code3: string
  /** Country name resolved to the requested language. */
  name: string
  flag: string
  dialCode: string
  hasDivisions: boolean
  divisionLevels?: string[]
}

export interface GeoDivision {
  code: string
  name: string
  hasChildren: boolean
}

export interface GeoDivisions {
  levels: string[]
  items: GeoDivision[]
}

const geoApi = {
  countries: (lang: string) =>
    request<ApiResponse<GeoCountry[]>>({
      api: `/geo/countries?lang=${lang}`,
      method: 'GET',
    }),
  divisions: (country: string, parentCode?: string) =>
    request<ApiResponse<GeoDivisions>>({
      api: parentCode
        ? `/geo/${country}/divisions/${parentCode}`
        : `/geo/${country}/divisions`,
      method: 'GET',
    }),
}

export const geoKeys = {
  all: ['geo'] as const,
  countries: (lang: string) => [...geoKeys.all, 'countries', lang] as const,
  divisions: (country: string, parentCode?: string) =>
    [...geoKeys.all, 'divisions', country, parentCode ?? 'root'] as const,
}

export const useCountries = (lang: string) =>
  useQuery({
    queryKey: geoKeys.countries(lang),
    queryFn: () => geoApi.countries(lang),
    select: (res) => res.data,
    staleTime: Infinity,
  })

export const useDivisions = (country?: string, parentCode?: string) =>
  useQuery({
    queryKey: geoKeys.divisions(country ?? '', parentCode),
    queryFn: () => geoApi.divisions(country as string, parentCode),
    select: (res) => res.data,
    enabled: !!country,
    staleTime: Infinity,
  })
