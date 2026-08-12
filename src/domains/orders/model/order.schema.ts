import { z } from 'zod'
import type { OrderTranslations } from '../i18n/types'
import type { OrderAddress } from './order.types'

type V = OrderTranslations['validation']

export interface CreateOrderItemPayload {
  productId: string
  variantId?: string
  quantity: number
}

export interface CreateOrderPayload {
  customerId: string
  items: CreateOrderItemPayload[]
  couponCode?: string
  shippingAddress: OrderAddress
  billingAddress?: OrderAddress
  fulfillmentLocationId: string
  notes?: string
}

export interface OrderBuilderItemFormData {
  productId: string
  variantId?: string
  nameSnapshot: string
  skuSnapshot?: string
  /** Integer cents — display only, set once when the item is added. The
   * server always recomputes the authoritative price from the product/
   * variant, so this never round-trips back into the create payload. */
  unitPriceAmount: number
  currency: string
  quantity: string
}

const addressFormShape = {
  country: z.string().trim().default(''),
  ubigeoCode: z.string().trim().default(''),
  region: z.string().trim().default(''),
  province: z.string().trim().default(''),
  district: z.string().trim().default(''),
  address: z.string().trim().default(''),
  addressNumber: z.string().trim().default(''),
  addressInterior: z.string().trim().default(''),
}

export interface OrderAddressFormData {
  country: string
  ubigeoCode: string
  region: string
  province: string
  district: string
  address: string
  addressNumber: string
  addressInterior: string
}

export interface OrderBuilderFormData {
  customerId: string
  fulfillmentLocationId: string
  items: OrderBuilderItemFormData[]
  couponCode: string
  shippingAddress: OrderAddressFormData
  sameBillingAddress: boolean
  billingAddress: OrderAddressFormData
  notes: string
}

function addressComplete(a: OrderAddressFormData): boolean {
  return a.country.trim().length === 2 && !!a.region.trim() && !!a.address.trim()
}

export function createOrderBuilderSchema(v: V) {
  return z
    .object({
      customerId: z.string().trim().min(1, v.required),
      fulfillmentLocationId: z.string().trim().min(1, v.required),
      items: z
        .array(
          z.object({
            productId: z.string().trim().min(1),
            variantId: z.string().trim().optional(),
            nameSnapshot: z.string(),
            skuSnapshot: z.string().optional(),
            unitPriceAmount: z.number(),
            currency: z.string(),
            quantity: z
              .string()
              .trim()
              .refine((v_) => Number.parseInt(v_, 10) > 0, v.itemQuantityInvalid),
          })
        )
        .min(1, v.itemsRequired),
      couponCode: z.string().trim().default(''),
      shippingAddress: z.object(addressFormShape),
      sameBillingAddress: z.boolean().default(true),
      billingAddress: z.object(addressFormShape),
      notes: z.string().trim().default(''),
    })
    .superRefine((data, ctx) => {
      if (!addressComplete(data.shippingAddress)) {
        ctx.addIssue({
          code: 'custom',
          message: v.addressIncomplete,
          path: ['shippingAddress', 'address'],
        })
      }
      if (!data.sameBillingAddress && !addressComplete(data.billingAddress)) {
        ctx.addIssue({
          code: 'custom',
          message: v.addressIncomplete,
          path: ['billingAddress', 'address'],
        })
      }
    })
}

function toOrderAddress(a: OrderAddressFormData): OrderAddress {
  return {
    country: a.country.toUpperCase(),
    ubigeoCode: a.ubigeoCode || undefined,
    region: a.region,
    province: a.province || undefined,
    district: a.district || undefined,
    address: a.address,
    addressNumber: a.addressNumber || undefined,
    addressInterior: a.addressInterior || undefined,
  }
}

export function toOrderPayload(data: OrderBuilderFormData): CreateOrderPayload {
  return {
    customerId: data.customerId,
    items: data.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId || undefined,
      quantity: Number.parseInt(item.quantity, 10),
    })),
    couponCode: data.couponCode.trim() ? data.couponCode.trim().toUpperCase() : undefined,
    shippingAddress: toOrderAddress(data.shippingAddress),
    billingAddress: data.sameBillingAddress
      ? undefined
      : toOrderAddress(data.billingAddress),
    fulfillmentLocationId: data.fulfillmentLocationId,
    notes: data.notes.trim() || undefined,
  }
}

/** Client-side estimated subtotal for the builder's running total display —
 * the server always recomputes the authoritative subtotal/discount/shipping/
 * tax/total from real product prices; this is feedback only. */
export function estimateSubtotal(items: OrderBuilderItemFormData[]): number {
  return items.reduce((sum, item) => {
    const qty = Number.parseInt(item.quantity, 10) || 0
    return sum + item.unitPriceAmount * qty
  }, 0)
}
