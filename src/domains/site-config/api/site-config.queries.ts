import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export const useUpdateSiteConfig = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SiteConfigUpdatePayload) => siteConfigApi.update(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: siteConfigKeys.all }),
  })
}
