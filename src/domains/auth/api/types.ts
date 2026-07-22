import type { AuthUser } from '@/shared/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ResetPasswordResponse {
  message: string
}
