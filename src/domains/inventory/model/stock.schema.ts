import { z } from 'zod'
import type { InventoryTranslations } from '../i18n/types'

type V = InventoryTranslations['validation']

export function createAdjustStockSchema(v: V) {
  return z.object({
    productId: z.string().trim().uuid(v.productIdInvalid),
    variantId: z
      .string()
      .trim()
      .uuid(v.variantIdInvalid)
      .optional()
      .or(z.literal('')),
    locationId: z.string().trim().uuid(v.locationRequired),
    quantity: z.coerce.number().int().min(0, v.quantityInvalid),
  })
}

export type AdjustStockFormData = z.infer<
  ReturnType<typeof createAdjustStockSchema>
>

export interface AdjustStockPayload {
  productId: string
  variantId?: string
  locationId: string
  quantity: number
}

export function toAdjustStockPayload(
  data: AdjustStockFormData
): AdjustStockPayload {
  return {
    productId: data.productId,
    ...(data.variantId ? { variantId: data.variantId } : {}),
    locationId: data.locationId,
    quantity: data.quantity,
  }
}
