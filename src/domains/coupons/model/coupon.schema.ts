import { z } from 'zod'
import type { CouponTranslations } from '../i18n/types'
import type { Money, CouponType, CouponScopeType, CouponStatus } from './coupon.types'

type V = CouponTranslations['validation']

export interface CreateCouponPayload {
  code: string
  type: CouponType
  value: number
  maxDiscountAmount?: Money
  usageLimitTotal?: number
  usageLimitPerCustomer?: number
  startsAt?: string
  expiresAt?: string
  isStackable: boolean
  scope: { type: CouponScopeType; targetIds: string[] }
  status: CouponStatus
}

/** Converts a `PriceInput` raw major-units decimal string to integer-cents `Money`. */
export function toMoney(raw: string, currency: string): Money {
  const majorUnits = Number.parseFloat(raw || '0')
  return { amount: Math.round(majorUnits * 100), currency }
}

/** Converts integer-cents `Money` back to a `PriceInput` raw major-units decimal string. */
export function fromMoney(money?: Money): string {
  if (!money) return ''
  return (money.amount / 100).toFixed(2)
}

/** `value`'s unit depends on `type` — percentage points (plain number) or an
 * amount in the store's currency (major-units decimal string, `PriceInput`-
 * compatible) — converted at the payload boundary, same split as `products`'
 * `toMoney`/`fromMoney`. */
export function toCouponValue(
  type: 'percentage' | 'fixed',
  raw: string,
  currency: string
): number {
  if (type === 'fixed') return toMoney(raw, currency).amount
  return Number.parseFloat(raw || '0')
}

export function fromCouponValue(
  type: 'percentage' | 'fixed',
  value: number,
  currency: string
): string {
  if (type === 'fixed') return fromMoney({ amount: value, currency })
  return String(value)
}

function toIsoOrUndefined(value: string | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function createCouponSchema(v: V) {
  return z
    .object({
      code: z
        .string()
        .trim()
        .min(3, v.codeMinLength)
        .max(50, v.codeMaxLength),
      type: z.enum(['percentage', 'fixed']),
      value: z.string().trim().min(1, v.required),
      maxDiscountAmount: z.string().trim().optional().or(z.literal('')),
      usageLimitTotal: z.string().trim().optional().or(z.literal('')),
      usageLimitPerCustomer: z.string().trim().optional().or(z.literal('')),
      startsAt: z.string().trim().optional().or(z.literal('')),
      expiresAt: z.string().trim().optional().or(z.literal('')),
      isStackable: z.boolean().default(false),
      scopeType: z.enum(['cart', 'products', 'categories']).default('cart'),
      targetIds: z.array(z.string()).default([]),
      status: z.enum(['active', 'inactive']).default('active'),
    })
    .superRefine((data, ctx) => {
      if (data.type === 'percentage') {
        const num = Number.parseFloat(data.value || '0')
        if (Number.isFinite(num) && num > 100) {
          ctx.addIssue({
            code: 'custom',
            message: v.percentageMax,
            path: ['value'],
          })
        }
      }
      if (data.scopeType !== 'cart' && data.targetIds.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: v.scopeTargetsRequired,
          path: ['targetIds'],
        })
      }
      if (
        data.startsAt &&
        data.expiresAt &&
        new Date(data.startsAt) > new Date(data.expiresAt)
      ) {
        ctx.addIssue({
          code: 'custom',
          message: v.dateRangeInvalid,
          path: ['expiresAt'],
        })
      }
    })
}

export type CouponFormData = {
  code: string
  type: 'percentage' | 'fixed'
  value: string
  maxDiscountAmount?: string
  usageLimitTotal?: string
  usageLimitPerCustomer?: string
  startsAt?: string
  expiresAt?: string
  isStackable: boolean
  scopeType: 'cart' | 'products' | 'categories'
  targetIds: string[]
  status: 'active' | 'inactive'
}

export function toCouponPayload(
  data: CouponFormData,
  currency: string
): CreateCouponPayload {
  return {
    code: data.code.trim(),
    type: data.type,
    value: toCouponValue(data.type, data.value, currency),
    maxDiscountAmount:
      data.type === 'percentage' && data.maxDiscountAmount
        ? toMoney(data.maxDiscountAmount, currency)
        : undefined,
    usageLimitTotal: data.usageLimitTotal
      ? Number.parseInt(data.usageLimitTotal, 10)
      : undefined,
    usageLimitPerCustomer: data.usageLimitPerCustomer
      ? Number.parseInt(data.usageLimitPerCustomer, 10)
      : undefined,
    startsAt: toIsoOrUndefined(data.startsAt),
    expiresAt: toIsoOrUndefined(data.expiresAt),
    isStackable: data.isStackable,
    scope: { type: data.scopeType, targetIds: data.targetIds },
    status: data.status,
  }
}
