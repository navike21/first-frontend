import { configureAmplify } from './auth.client'
import { cognitoAuthService } from './auth.service'
import { fakeAuthService } from './auth.fake'
import type { IAuthService } from './auth.types'

const provider = (import.meta.env.VITE_AUTH_PROVIDER as string) ?? 'fake'

if (provider === 'cognito') {
  configureAmplify()
}

export const authService: IAuthService =
  provider === 'cognito' ? cognitoAuthService : fakeAuthService

export type { IAuthService, SignInResult } from './auth.types'
