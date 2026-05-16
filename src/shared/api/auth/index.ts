import { fakeAuthService } from './auth.fake'
import { apiAuthService } from './auth.api'

const provider = (import.meta.env.VITE_AUTH_PROVIDER as string | undefined) ?? 'fake'

export const authService = provider === 'api' ? apiAuthService : fakeAuthService

export type { IAuthService, SignInResult } from './auth.types'
