import { z } from 'zod'
import type { ShippingTranslations } from '../i18n/types'
import type { Money, ShippingRuleType } from './shippingRule.types'

type V = ShippingTranslations['validation']

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

export function parseProvincesText(text: string): string[] {
  return text
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

const zoneSchema = z.object({
  region: z.string().trim(),
  provincesText: z.string().trim(),
})

export function createShippingRuleSchema(v: V) {
  return z
    .object({
      name: z.string().trim().min(2, v.required),
      type: z.enum(['flat', 'free_over_threshold', 'by_zone']),
      amount: z.string().trim().min(1, v.required),
      freeOverAmount: z.string().trim().optional().or(z.literal('')),
      zones: z.array(zoneSchema).default([]),
      isActive: z.boolean().default(true),
      order: z.string().trim().optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
      if (data.type === 'free_over_threshold' && !data.freeOverAmount) {
        ctx.addIssue({
          code: 'custom',
          message: v.freeOverAmountRequired,
          path: ['freeOverAmount'],
        })
      }
      if (data.type === 'by_zone') {
        if (data.zones.length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: v.zonesRequired,
            path: ['zones'],
          })
        }
        data.zones.forEach((zone, index) => {
          if (!zone.region) {
            ctx.addIssue({
              code: 'custom',
              message: v.required,
              path: ['zones', index, 'region'],
            })
          }
        })
      }
    })
}

export interface ShippingRuleFormData {
  name: string
  type: ShippingRuleType
  amount: string
  freeOverAmount?: string
  zones: { region: string; provincesText: string }[]
  isActive: boolean
  order?: string
}

export interface CreateShippingRulePayload {
  name: string
  type: ShippingRuleType
  amount: Money
  freeOverAmount?: Money
  zones: { region: string; provinces?: string[] }[]
  isActive: boolean
  order: number
}

export function toShippingRulePayload(
  data: ShippingRuleFormData,
  currency: string
): CreateShippingRulePayload {
  return {
    name: data.name.trim(),
    type: data.type,
    amount: toMoney(data.amount, currency),
    freeOverAmount:
      data.type === 'free_over_threshold' && data.freeOverAmount
        ? toMoney(data.freeOverAmount, currency)
        : undefined,
    zones:
      data.type === 'by_zone'
        ? data.zones.map((zone) => {
            const provinces = parseProvincesText(zone.provincesText)
            return {
              region: zone.region.trim(),
              provinces: provinces.length > 0 ? provinces : undefined,
            }
          })
        : [],
    isActive: data.isActive,
    order: data.order ? Number.parseInt(data.order, 10) : 0,
  }
}
