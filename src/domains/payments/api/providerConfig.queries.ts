import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { providerConfigApi } from './providerConfig.api'
import type { UpdateProviderConfigBody } from './providerConfig.api'
import type { PaymentProviderKey } from '../model/payment.types'

export const providerConfigKeys = {
  all: ['payment-provider-configs'] as const,
}

export const useProviderConfigs = () =>
  useQuery({
    queryKey: providerConfigKeys.all,
    queryFn: () => providerConfigApi.list(),
    select: (res) => res.data ?? [],
  })

export const useUpdateProviderConfig = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      provider,
      body,
    }: {
      provider: PaymentProviderKey
      body: UpdateProviderConfigBody
    }) => providerConfigApi.update(provider, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: providerConfigKeys.all }),
  })
}
