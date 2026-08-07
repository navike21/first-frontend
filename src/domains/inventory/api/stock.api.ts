import { request } from '@/shared/api'
import type { ApiResponse } from '@/shared/api/types'
import type { StockSummary } from '../model/location.types'
import type { AdjustStockPayload } from '../model/stock.schema'

const BASE = '/inventory/stock'

export const stockApi = {
  getByProduct: (productId: string) =>
    request<ApiResponse<StockSummary>>({
      api: `${BASE}/${productId}`,
      method: 'GET',
    }),

  adjust: (body: AdjustStockPayload) =>
    request<ApiResponse<{ quantity: number }>, AdjustStockPayload>({
      api: BASE,
      method: 'PATCH',
      body,
    }),
}
