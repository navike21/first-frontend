import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
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

// CMS pages picker — feeds the CTA "site page" destination selector so the
// admin never types translated slugs by hand.
interface PagePickerItem {
  id: string
  title: Record<string, string>
}

export const usePagesForCtaPicker = () =>
  useQuery({
    queryKey: ['pages', 'picker-for-site-config'],
    queryFn: () => request<ApiResponse<PagePickerItem[]>>({ api: '/pages/admin?limit=100', method: 'GET' }),
    select: (res) => res.data ?? [],
    staleTime: 60 * 1000,
  })

export const useUpdateSiteConfig = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SiteConfigUpdatePayload) => siteConfigApi.update(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: siteConfigKeys.all }),
  })
}
