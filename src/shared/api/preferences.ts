import { request } from './api.services'
import type { ApiResponse } from './types'
import type { UserPreferences } from '@/shared/types'

/** Current-user UI preferences — backend merges and returns the full set. */
export const preferencesApi = {
  /** Current user profile — read on load to reconcile preferences. */
  me: () =>
    request<ApiResponse<{ preferences?: UserPreferences }>>({
      api: '/users/me',
      method: 'GET',
    }),

  update: (prefs: Partial<UserPreferences>) =>
    request<ApiResponse<UserPreferences>, Partial<UserPreferences>>({
      api: '/users/me/preferences',
      method: 'PATCH',
      body: prefs,
    }),
}
