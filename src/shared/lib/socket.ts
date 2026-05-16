import { io, type Socket } from 'socket.io-client'
import { env } from '@shared/config/env'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.VITE_SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

export function connectSocket(token: string) {
  const s = getSocket()
  s.auth = { token }
  s.connect()
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
