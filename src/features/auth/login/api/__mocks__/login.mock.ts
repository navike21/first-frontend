import type { AuthUser } from '@/shared/types'
import type { LoginRequest, LoginResponse } from '../types'

const FAKE_DELAY_MS = 900

interface MockUser extends LoginResponse {
  email: string
  password: string
}

const MOCK_USERS: MockUser[] = [
  {
    email: 'j.chaponan@navike21.com',
    password: 'admin123',
    token: 'mock-token-admin_user-001',
    user: {
      id: '1',
      email: 'j.chaponan@navike21.com',
      firstName: 'José Iván',
      lastName: 'Chaponan',
      permissions: [],
    } satisfies AuthUser,
  },
  {
    email: 'm.garcia@navike21.com',
    password: 'secure1234',
    token: 'mock-token-mgarcia-002',
    user: {
      id: '2',
      email: 'm.garcia@navike21.com',
      firstName: 'María',
      lastName: 'García López',
      permissions: [],
    } satisfies AuthUser,
  },
  {
    email: 'r.lopez@navike21.com',
    password: 'pass5678',
    token: 'mock-token-rlopez-003',
    user: {
      id: '3',
      email: 'r.lopez@navike21.com',
      firstName: 'Roberto',
      lastName: 'López Vega',
      permissions: [],
    } satisfies AuthUser,
  },
  {
    email: 'a.morales@navike21.com',
    password: 'first2026',
    token: 'mock-token-amorales-004',
    user: {
      id: '4',
      email: 'a.morales@navike21.com',
      firstName: 'Ana',
      lastName: 'Morales Ruiz',
      permissions: [],
    } satisfies AuthUser,
  },
]

export const mockLoginApi = (body: LoginRequest): Promise<LoginResponse> =>
  new Promise<LoginResponse>((resolve, reject) => {
    setTimeout(() => {
      const match = MOCK_USERS.find(
        (u) => u.email === body.email && u.password === body.password
      )

      if (match) {
        resolve({ token: match.token, user: match.user })
      } else {
        reject(new Error('Usuario o contraseña incorrectos'))
      }
    }, FAKE_DELAY_MS)
  })
