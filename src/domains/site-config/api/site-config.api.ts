import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { SiteConfigData, SiteConfigUpdatePayload } from '../model/site-config.types'

const BASE = '/site-config'

export const siteConfigApi = {
  get: () => request<ApiResponse<SiteConfigData>>({ api: BASE, method: 'GET' }),

  update: (body: SiteConfigUpdatePayload) =>
    request<ApiResponse<SiteConfigData>, SiteConfigUpdatePayload>({ api: BASE, method: 'PATCH', body }),
}
