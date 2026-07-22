import type { AuthUser } from '@/shared/types'

export interface SignInResult {
  token: string
  user: AuthUser
}

export interface MessageResult {
  message: string
}

export interface IAuthService {
  signIn(email: string, password: string): Promise<SignInResult>
  /** Siempre resuelve (anti-enumeración: el backend responde igual exista o no el email). */
  forgotPassword(email: string): Promise<MessageResult>
  resetPassword(token: string, password: string): Promise<MessageResult>
}
