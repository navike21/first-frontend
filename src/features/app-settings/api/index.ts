import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import type { ApiResponse } from '@shared/api/types'
import type { AppSettings, UpdateAppSettingsInput } from '../model/types'

export const appSettingsKeys = {
  settings: ['app-settings'] as const,
}

export function useAppSettings() {
  return useQuery({
    queryKey: appSettingsKeys.settings,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<AppSettings>>('/app-settings')
      return data.data
    },
    staleTime: 1000 * 60 * 30,
  })
}

export function useUpdateAppSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateAppSettingsInput) => {
      const { data } = await apiClient.patch<ApiResponse<AppSettings>>('/app-settings', input)
      return data.data
    },
    onSuccess: (settings) => {
      qc.setQueryData(appSettingsKeys.settings, settings)
      notify.success('Configuración guardada')
    },
  })
}
