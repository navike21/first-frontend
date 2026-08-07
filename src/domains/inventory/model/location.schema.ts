import { z } from 'zod'
import type { InventoryTranslations } from '../i18n/types'
import type { LocationAddress } from './location.types'

type V = InventoryTranslations['validation']

const optional = z.string().trim().optional().or(z.literal(''))

export function createLocationSchema(v: V) {
  return z.object({
    name: z.string().trim().min(1, v.nameRequired).max(150),
    type: z.enum(['warehouse', 'store']),
    country: optional,
    ubigeoCode: optional,
    region: optional,
    province: optional,
    district: optional,
    address: optional,
    addressNumber: optional,
    addressInterior: optional,
    fulfillsOnline: z.boolean().default(true),
    isActive: z.boolean().default(true),
  })
}

export type LocationFormData = z.infer<ReturnType<typeof createLocationSchema>>

export interface CreateLocationPayload {
  name: string
  type: 'warehouse' | 'store'
  address?: LocationAddress
  fulfillsOnline: boolean
  isActive: boolean
}

function stripEmpty<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== undefined)
  ) as T
}

export function toLocationPayload(
  data: LocationFormData
): CreateLocationPayload {
  const {
    name,
    type,
    fulfillsOnline,
    isActive,
    country,
    ubigeoCode,
    region,
    province,
    district,
    address,
    addressNumber,
    addressInterior,
  } = data
  const addr = stripEmpty({
    country,
    ubigeoCode,
    region,
    province,
    district,
    address,
    addressNumber,
    addressInterior,
  })

  return {
    name,
    type,
    fulfillsOnline,
    isActive,
    ...(Object.keys(addr).length > 0 ? { address: addr } : {}),
  }
}
