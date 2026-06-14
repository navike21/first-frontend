import { request } from './api.services'
import type { ApiResponse } from './types'
import type { UserPreferences } from '@/shared/types'

/** Current-user UI preferences — backend merges and returns the full set. */
export const preferencesApi = {
  update: (prefs: Partial<UserPreferences>) =>
    request<ApiResponse<UserPreferences>, Partial<UserPreferences>>({
      api: '/users/me/preferences',
      method: 'PATCH',
      body: prefs,
    }),
}
