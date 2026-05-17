import { create } from 'zustand'
import type { UserGender, UserGroup, UserMetadata } from './user.types'
import { usersApi } from '../api/users.api'
import { userGroupsApi } from '../api/userGroups.api'

interface UserConfigState {
  genders: UserGender[]
  presenceStatuses: string[]
  userStatuses: string[]
  userGroups: UserGroup[]
  isLoaded: boolean
}

interface UserConfigActions {
  load: () => Promise<void>
}

type UserConfigStore = UserConfigState & UserConfigActions

const initial: UserConfigState = {
  genders: ['female', 'male', 'other', 'prefer_not_to_say'],
  presenceStatuses: ['available', 'busy', 'away', 'offline'],
  userStatuses: ['active', 'inactive'],
  userGroups: [],
  isLoaded: false,
}

export const useUserConfigStore = create<UserConfigStore>((set, get) => ({
  ...initial,

  load: async () => {
    if (get().isLoaded) return
    try {
      const [metaRes, groupsRes] = await Promise.all([
        usersApi.metadata(),
        userGroupsApi.list(),
      ])
      const meta: UserMetadata = metaRes.data
      set({
        genders: meta.genders,
        presenceStatuses: meta.presenceStatuses,
        userStatuses: meta.userStatuses,
        userGroups: groupsRes.data?.items ?? [],
        isLoaded: true,
      })
    } catch {
      // Keep defaults on error — forms still work with hardcoded fallbacks
      set({ isLoaded: true })
    }
  },
}))
