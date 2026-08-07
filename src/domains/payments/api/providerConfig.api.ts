import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { PaymentProviderConfig, PaymentProviderKey } from '../model/payment.types'

const BASE = '/payments/providers'

export interface UpdateProviderConfigBody {
  enabled?: boolean
  isDefault?: boolean
  config?: Record<string, string>
}

export const providerConfigApi = {
  list: () =>
    request<ApiResponse<PaymentProviderConfig[]>>({ api: BASE, method: 'GET' }),

  update: (provider: PaymentProviderKey, body: UpdateProviderConfigBody) =>
    request<ApiResponse<PaymentProviderConfig>, UpdateProviderConfigBody>({
      api: `${BASE}/${provider}`,
      method: 'PATCH',
      body,
    }),
}
