import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ecommerceSettingsApi } from './ecommerceSettings.api'
import type { EcommerceSettingsUpdatePayload } from '../model/ecommerceSettings.schema'

export const ecommerceSettingsKeys = {
  all: ['ecommerce-settings'] as const,
}

export const useEcommerceSettings = () =>
  useQuery({
    queryKey: ecommerceSettingsKeys.all,
    queryFn: () => ecommerceSettingsApi.get(),
    select: (res) => res.data,
  })

export const useUpdateEcommerceSettings = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<EcommerceSettingsUpdatePayload>) =>
      ecommerceSettingsApi.update(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ecommerceSettingsKeys.all }),
  })
}
