import type { AuthUser } from '@/shared/types'

export interface SignInResult {
  token: string
  user: AuthUser
}

export interface IAuthService {
  signIn(email: string, password: string): Promise<SignInResult>
}
