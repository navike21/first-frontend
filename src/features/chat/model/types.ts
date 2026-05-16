export interface ChatRoom {
  id: string
  name: string
  type: 'direct' | 'group'
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  content: string
  type: 'text' | 'image' | 'file'
  readBy: string[]
  createdAt: string
}

export interface SendMessageInput {
  roomId: string
  content: string
  type?: 'text' | 'image' | 'file'
}
