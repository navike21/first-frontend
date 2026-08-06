import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { siteConfigApi } from './site-config.api'
import type { SiteConfigUpdatePayload } from '../model/site-config.types'

export const siteConfigKeys = {
  all: ['site-config'] as const,
}

export const useSiteConfig = () =>
  useQuery({
    queryKey: siteConfigKeys.all,
    queryFn: () => siteConfigApi.get(),
    select: (res) => res.data,
  })

/**
 * The content-language scope every domain's LangTabs/LangSidebar should
 * render — independent of the admin's own First UI language. Wraps
 * `useSiteConfig()` (React Query dedupes/caches it, so calling this from
 * several forms at once doesn't fire several requests) and falls back to
 * every supported language while loading or if the config predates this
 * field — a form must never end up with zero visible language tabs.
 */
export const useContentLanguages = (): {
  languages: readonly Language[]
  isLoading: boolean
} => {
  const { data, isLoading } = useSiteConfig()
  return {
    // SUPPORTED_LANGUAGES itself (not a copy) while loading/absent, so the
    // fallback is referentially stable across renders.
    languages: data?.contentLanguages ?? SUPPORTED_LANGUAGES,
    isLoading,
  }
}

// CMS pages picker — feeds the CTA "site page" destination selector so the
// admin never types translated slugs by hand.
interface PagePickerItem {
  id: string
  title: Record<string, string>
}

export const usePagesForCtaPicker = () =>
  useQuery({
    queryKey: ['pages', 'picker-for-site-config'],
    queryFn: () =>
      request<ApiResponse<PagePickerItem[]>>({
        api: '/pages/admin?limit=100',
        method: 'GET',
      }),
    select: (res) => res.data ?? [],
    staleTime: 60 * 1000,
  })

export const useUpdateSiteConfig = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SiteConfigUpdatePayload) =>
      siteConfigApi.update(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: siteConfigKeys.all }),
  })
}
