import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { getSocket, connectSocket } from '@shared/lib/socket'
import { notify } from '@shared/lib/notify'
import { useChatStore } from '../store'
import type { ApiResponse } from '@shared/api/types'
import type { ChatRoom, ChatMessage, SendMessageInput } from '../model/types'

export const chatKeys = {
  rooms: ['chat', 'rooms'] as const,
  messages: (roomId: string) => ['chat', 'messages', roomId] as const,
}

export function useChatRooms() {
  const setRooms = useChatStore((s) => s.setRooms)

  return useQuery({
    queryKey: chatKeys.rooms,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<ChatRoom[]>>('/chat/rooms')
      setRooms(data.data)
      return data.data
    },
  })
}

export function useChatMessages(roomId: string) {
  const setMessages = useChatStore((s) => s.setMessages)

  return useQuery({
    queryKey: chatKeys.messages(roomId),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<ChatMessage[]>>(
        `/chat/rooms/${roomId}/messages`,
      )
      setMessages(roomId, data.data)
      return data.data
    },
    enabled: !!roomId,
  })
}

export function useSocketChat(token: string | null) {
  const addMessage = useChatStore((s) => s.addMessage)
  const setConnected = useChatStore((s) => s.setConnected)

  useEffect(() => {
    if (!token) return

    const socket = connectSocket(token)

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('chat:message', (message: ChatMessage) => {
      addMessage(message)
    })
    socket.on('connect_error', () => {
      notify.error('Error de conexión al chat')
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('chat:message')
      socket.off('connect_error')
    }
  }, [token, addMessage, setConnected])
}

export function sendMessage(input: SendMessageInput) {
  const socket = getSocket()
  if (!socket?.connected) {
    notify.error('Sin conexión al chat')
    return
  }
  socket.emit('chat:send', input)
}
