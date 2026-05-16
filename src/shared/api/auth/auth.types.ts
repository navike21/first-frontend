import type { AuthUser } from '@/shared/types'

export interface SignInResult {
  token: string
  user: AuthUser
}

export interface IAuthService {
  signIn(username: string, password: string): Promise<SignInResult>
  signOut(): Promise<void>
  getToken(): Promise<string | null>
}
