import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { Order, OrderListParams, OrderStatus, PaymentStatus } from '../model/order.types'
import type { CreateOrderPayload } from '../model/order.schema'

const BASE = '/orders'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const ordersApi = {
  list: (params: OrderListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.search) query.set('search', params.search)
    if (params.status) query.set('status', params.status)
    if (params.paymentStatus) query.set('paymentStatus', params.paymentStatus)
    if (params.customerId) query.set('customerId', params.customerId)
    const qs = query.toString()
    return request<ApiResponse<Order[]>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<Order>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (body: CreateOrderPayload) =>
    request<ApiResponse<Order>, CreateOrderPayload>({
      api: BASE,
      method: 'POST',
      body,
    }),

  updateStatus: (id: string, status: OrderStatus, trackingNumber?: string) =>
    request<ApiResponse<Order>, { status: OrderStatus; trackingNumber?: string }>({
      api: `${BASE}/${id}/status`,
      method: 'PATCH',
      body: { status, trackingNumber },
    }),

  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus) =>
    request<ApiResponse<Order>, { paymentStatus: PaymentStatus }>({
      api: `${BASE}/${id}/payment-status`,
      method: 'PATCH',
      body: { paymentStatus },
    }),

  softDelete: (id: string) =>
    request<ApiResponse<Order>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Order[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Order>>({
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
