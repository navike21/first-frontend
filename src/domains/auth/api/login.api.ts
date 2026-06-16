import { authService } from '@/shared/api'
import type { LoginRequest, LoginResponse } from './types'

export const loginApi = (body: LoginRequest): Promise<LoginResponse> =>
  authService.signIn(body.email, body.password)
