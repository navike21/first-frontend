import { create } from 'zustand'
import type { PresenceStatus } from '@domains/users'
import type { AvatarStatus } from '@/shared/ui/atoms/Avatar/Avatar.types'

interface PresenceState {
  presenceByUserId: Record<string, PresenceStatus>
}

interface PresenceActions {
  setOnlineUsers: (userIds: string[]) => void
  setUserPresence: (userId: string, status: PresenceStatus) => void
}

type PresenceStore = PresenceState & PresenceActions

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  presenceByUserId: {},

  setOnlineUsers: (userIds) => {
    const current = get().presenceByUserId
    const next: Record<string, PresenceStatus> = { ...current }
    for (const id of userIds) {
      if (!next[id] || next[id] === 'offline') next[id] = 'available'
    }
    set({ presenceByUserId: next })
  },

  setUserPresence: (userId, status) => {
    set((s) => ({
      presenceByUserId: { ...s.presenceByUserId, [userId]: status },
    }))
  },
}))

export function getUserAvatarStatus(userId: string): AvatarStatus {
  const status = usePresenceStore.getState().presenceByUserId[userId]
  const map: Record<PresenceStatus, AvatarStatus> = {
    available: 'online',
    busy: 'busy',
    away: 'away',
    offline: 'offline',
  }
  return status ? map[status] : 'none'
}

export function useUserAvatarStatus(userId: string): AvatarStatus {
  return usePresenceStore((s) => {
    const status = s.presenceByUserId[userId]
    const map: Record<PresenceStatus, AvatarStatus> = {
      available: 'online',
      busy: 'busy',
      away: 'away',
      offline: 'offline',
    }
    return status ? map[status] : 'none'
  })
}
