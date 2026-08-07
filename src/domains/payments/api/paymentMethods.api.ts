import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { PaymentMethod, PaymentMethodListParams } from '../model/payment.types'
import type { CreatePaymentMethodPayload } from '../model/paymentMethod.schema'

const BASE = '/payments/methods'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const paymentMethodsApi = {
  list: (params: PaymentMethodListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.customerId) query.set('customerId', params.customerId)
    if (params.provider) query.set('provider', params.provider)
    const qs = query.toString()
    return request<ApiResponse<PaymentMethod[]>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<PaymentMethod>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (body: CreatePaymentMethodPayload) =>
    request<ApiResponse<PaymentMethod>, CreatePaymentMethodPayload>({
      api: BASE,
      method: 'POST',
      body,
    }),

  update: (id: string, body: Partial<CreatePaymentMethodPayload>) =>
    request<ApiResponse<PaymentMethod>, typeof body>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body,
    }),

  softDelete: (id: string) =>
    request<ApiResponse<PaymentMethod>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<PaymentMethod[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<PaymentMethod>>({
      api: `${BASE}/${id}/restore`,
      method: 'PATCH',
    }),

  purge: (id: string) =>
    request<ApiResponse<null>>({
      api: `${BASE}/${id}/permanent`,
      method: 'DELETE',
    }),

  bulkSoftDelete: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/bulk`,
      method: 'DELETE',
      body: { ids },
    }),

  bulkRestore: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/bulk/restore`,
      method: 'PATCH',
      body: { ids },
    }),

  bulkPurge: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/bulk/permanent`,
      method: 'DELETE',
      body: { ids },
    }),
}
