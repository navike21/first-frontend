import type { AuthUser } from '@/shared/types'
import type { LoginRequest, LoginResponse } from '../types'

// TODO: Remove this file and use the real API endpoint when the backend is ready.
//       See login.api.ts for the original request call.

interface MockCredential {
  username: string
  password: string
}

interface MockUser extends MockCredential, LoginResponse {}

const FAKE_DELAY_MS = 900

// ---------------------------------------------------------------------------
// Mock credentials — for local development only
// ---------------------------------------------------------------------------
const MOCK_USERS: MockUser[] = [
  {
    username: 'jichaponan',
    password: 'admin123',
    token: 'mock-token-admin_user-001',
    user: {
      id: '1',
      name: 'José Iván Chaponan',
      email: 'j.chaponan@navike21.com',
    } satisfies AuthUser,
  },
  {
    username: 'mgarcia',
    password: 'secure1234',
    token: 'mock-token-mgarcia-002',
    user: {
      id: '2',
      name: 'María García López',
      email: 'm.garcia@navike21.com',
    } satisfies AuthUser,
  },
  {
    username: 'rlopez',
    password: 'pass5678',
    token: 'mock-token-rlopez-003',
    user: {
      id: '3',
      name: 'Roberto López Vega',
      email: 'r.lopez@navike21.com',
    } satisfies AuthUser,
  },
  {
    username: 'amorales',
    password: 'first2026',
    token: 'mock-token-amorales-004',
    user: {
      id: '4',
      name: 'Ana Morales Ruiz',
      email: 'a.morales@navike21.com',
    } satisfies AuthUser,
  },
]

// ---------------------------------------------------------------------------
// Mock API function — simulates network delay and credential validation
// ---------------------------------------------------------------------------
export const mockLoginApi = (body: LoginRequest): Promise<LoginResponse> =>
  new Promise<LoginResponse>((resolve, reject) => {
    setTimeout(() => {
      const match = MOCK_USERS.find(
        (u) => u.username === body.username && u.password === body.password
      )

      if (match) {
        resolve({ token: match.token, user: match.user })
      } else {
        reject(new Error('Usuario o contraseña incorrectos'))
      }
    }, FAKE_DELAY_MS)
  })
