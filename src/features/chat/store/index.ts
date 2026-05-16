import { create } from 'zustand'
import type { ChatRoom, ChatMessage } from '../model/types'

interface ChatState {
  rooms: ChatRoom[]
  activeRoomId: string | null
  messages: Record<string, ChatMessage[]>
  isConnected: boolean

  setRooms: (rooms: ChatRoom[]) => void
  setActiveRoom: (roomId: string | null) => void
  addMessage: (message: ChatMessage) => void
  setMessages: (roomId: string, messages: ChatMessage[]) => void
  setConnected: (connected: boolean) => void
  markRoomRead: (roomId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  activeRoomId: null,
  messages: {},
  isConnected: false,

  setRooms: (rooms) => set({ rooms }),
  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),
  addMessage: (message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [message.roomId]: [...(state.messages[message.roomId] ?? []), message],
      },
    })),
  setMessages: (roomId, messages) =>
    set((state) => ({ messages: { ...state.messages, [roomId]: messages } })),
  setConnected: (connected) => set({ isConnected: connected }),
  markRoomRead: (roomId) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === roomId ? { ...r, unreadCount: 0 } : r)),
    })),
}))
