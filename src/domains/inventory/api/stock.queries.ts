import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { stockApi } from './stock.api'
import type { AdjustStockPayload } from '../model/stock.schema'

export const stockKeys = {
  all: ['stock'] as const,
  byProduct: (productId: string) =>
    [...stockKeys.all, 'product', productId] as const,
}

export const useStockByProduct = (productId: string) =>
  useQuery({
    queryKey: stockKeys.byProduct(productId),
    queryFn: () => stockApi.getByProduct(productId),
    select: (res) => res.data,
    enabled: !!productId,
  })

export const useAdjustStock = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AdjustStockPayload) => stockApi.adjust(data),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({
        queryKey: stockKeys.byProduct(variables.productId),
      })
    },
  })
}
