import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { EcommerceSettings } from '../model/ecommerceSettings.types'
import type { EcommerceSettingsUpdatePayload } from '../model/ecommerceSettings.schema'

const BASE = '/ecommerce-settings'

export const ecommerceSettingsApi = {
  get: () =>
    request<ApiResponse<EcommerceSettings>>({ api: BASE, method: 'GET' }),

  update: (body: Partial<EcommerceSettingsUpdatePayload>) =>
    request<ApiResponse<EcommerceSettings>, typeof body>({
      api: BASE,
      method: 'PATCH',
      body,
    }),
}
