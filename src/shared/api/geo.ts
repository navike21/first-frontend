import { useQuery } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'

export interface GeoCountry {
  code: string
  code3: string
  name: string
  nameEn: string
  flag: string
  dialCode: string
  hasDivisions: boolean
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
  countries: () =>
    request<ApiResponse<GeoCountry[]>>({
      api: '/geo/countries',
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
  countries: () => [...geoKeys.all, 'countries'] as const,
  divisions: (country: string, parentCode?: string) =>
    [...geoKeys.all, 'divisions', country, parentCode ?? 'root'] as const,
}

export const useCountries = () =>
  useQuery({
    queryKey: geoKeys.countries(),
    queryFn: () => geoApi.countries(),
    select: (res) => res.data,
    staleTime: Infinity, // reference data — does not change during a session
  })

export const useDivisions = (country?: string, parentCode?: string) =>
  useQuery({
    queryKey: geoKeys.divisions(country ?? '', parentCode),
    queryFn: () => geoApi.divisions(country as string, parentCode),
    select: (res) => res.data,
    enabled: !!country,
    staleTime: Infinity,
  })
