import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type {
  Subscriber,
  SubscriberListParams,
} from '../model/subscriber.types'
import type { CreateSubscriberPayload } from '../model/subscriber.schema'

const BASE = '/subscriber'

type BulkResult = { processedIds: string[]; notFoundIds: string[] }

export const subscribersApi = {
  list: (params: SubscriberListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return request<ApiResponse<Subscriber[]>>({
      api: qs ? `${BASE}/list?${qs}` : `${BASE}/list`,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<Subscriber>>({
      api: `${BASE}/search/${id}`,
      method: 'GET',
    }),

  register: (body: CreateSubscriberPayload, photo?: File | null) => {
    if (photo && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('photo', photo)
      return request<ApiResponse<Subscriber>, FormData>({
        api: `${BASE}/register`,
        method: 'POST',
        body: fd,
      })
    }
    return request<ApiResponse<Subscriber>, CreateSubscriberPayload>({
      api: `${BASE}/register`,
      method: 'POST',
      body,
    })
  },

  update: (
    id: string,
    body: Partial<CreateSubscriberPayload>,
    photo?: File | null
  ) => {
    if (photo && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('photo', photo)
      return request<ApiResponse<Subscriber>, FormData>({
        api: `${BASE}/update/${id}`,
        method: 'PATCH',
        body: fd,
      })
    }
    return request<ApiResponse<Subscriber>, Partial<CreateSubscriberPayload>>({
      api: `${BASE}/update/${id}`,
      method: 'PATCH',
      body,
    })
  },

  softDelete: (id: string) =>
    request<ApiResponse<Subscriber>>({
      api: `${BASE}/delete-logic/${id}`,
      method: 'DELETE',
    }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<Subscriber[]>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<Subscriber>>({
      api: `${BASE}/restore/${id}`,
      method: 'PATCH',
    }),

  purge: (id: string) =>
    request<ApiResponse<null>>({
      api: `${BASE}/delete/${id}`,
      method: 'DELETE',
    }),

  bulkSoftDelete: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/delete-logic-bulk`,
      method: 'DELETE',
      body: { ids },
    }),

  bulkRestore: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/restore-bulk`,
      method: 'PATCH',
      body: { ids },
    }),

  bulkPurge: (ids: string[]) =>
    request<ApiResponse<BulkResult>, { ids: string[] }>({
      api: `${BASE}/delete-bulk`,
      method: 'DELETE',
      body: { ids },
    }),
}
