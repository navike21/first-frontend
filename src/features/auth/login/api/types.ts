import type { AuthUser } from '@/shared/types'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}
