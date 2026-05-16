import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket | null {
  return socket
}

export function connectSocket(token: string): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:4000', {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })
  }
  socket.auth = { token }
  socket.connect()
  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}
