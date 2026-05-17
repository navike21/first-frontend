import { useEffect } from 'react'
import { useSessionStore } from '@/shared/model/session.store'
import { usePresenceStore } from '@/shared/model/presence.store'
import { connectSocket, disconnectSocket } from './socket'
import type { PresenceStatus } from '@/features/users/model/user.types'

export function usePresenceSocket() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)
  const token = useSessionStore((s) => s.token)
  const { setOnlineUsers, setUserPresence } = usePresenceStore()

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectSocket()
      return
    }

    const socket = connectSocket(token)

    socket.on('presence:init', (data: { onlineUsers: string[] }) => {
      setOnlineUsers(data.onlineUsers)
    })

    socket.on('presence:changed', (data: { userId: string; status: PresenceStatus }) => {
      setUserPresence(data.userId, data.status)
    })

    return () => {
      socket.off('presence:init')
      socket.off('presence:changed')
    }
  }, [isAuthenticated, token, setOnlineUsers, setUserPresence])
}
