import type { IAuthService, SignInResult } from './auth.types'
import type { AuthUser } from '@/shared/types'

// ---------------------------------------------------------------------------
// Fake credentials — mirrors login.mock.ts for local dev without Cognito
// ---------------------------------------------------------------------------
interface MockEntry {
  username: string
  password: string
  token: string
  user: AuthUser
}

const MOCK_USERS: MockEntry[] = [
  {
    username: 'j.chaponan@indra.com',
    password: 'admin123',
    token: 'mock-token-admin_user-001',
    user: {
      id: '1',
      name: 'José Iván Chaponan',
      email: 'j.chaponan@indra.com',
    },
  },
]

const FAKE_DELAY_MS = 900

let _fakeToken: string | null = null

export const fakeAuthService: IAuthService = {
  signIn: (username, password): Promise<SignInResult> =>
    new Promise<SignInResult>((resolve, reject) => {
      setTimeout(() => {
        const match = MOCK_USERS.find((u) => u.username === username && u.password === password)
        if (match) {
          _fakeToken = match.token
          resolve({ token: match.token, user: match.user })
        } else {
          reject(new Error('Usuario o contraseña incorrectos'))
        }
      }, FAKE_DELAY_MS)
    }),

  signOut: async () => {
    _fakeToken = null
  },

  getToken: async (): Promise<string | null> => _fakeToken,
}
