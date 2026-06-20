import { fakeAuthService } from './auth.fake'
import { apiAuthService } from './auth.api'

const provider =
  (import.meta.env.VITE_AUTH_PROVIDER as string | undefined) ?? 'api'

// Fail-safe: the fake provider validates against credentials bundled into the
// client and must NEVER run in a production build, even if misconfigured.
// Default is `api`; `fake` is honored only during local development.
const useFake = provider === 'fake' && import.meta.env.DEV

export const authService = useFake ? fakeAuthService : apiAuthService

export type { IAuthService, SignInResult } from './auth.types'
