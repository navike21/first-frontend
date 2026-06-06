import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { LoginRequest, LoginResponse } from './types'
import { loginApi } from './login.api'

vi.mock('@/shared/api', () => ({
  authService: {
    signIn: (email: string, password: string): Promise<LoginResponse> => {
      if (email === 'admin@navike21.com' && password === 'admin123') {
        return Promise.resolve({
          token: 'mock-token-local-dev',
          user: { id: '1', email: 'admin@navike21.com', firstName: 'Admin', lastName: 'First', permissions: [] },
        })
      }
      return Promise.reject(new Error('Usuario o contraseña incorrectos'))
    },
  },
}))

const makeLoginRequest = (overrides?: Partial<LoginRequest>): LoginRequest => ({
  email: 'admin@navike21.com',
  password: 'admin123',
  ...overrides,
})

describe('loginApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolves with token and user for valid credentials', async () => {
    const result = await loginApi(makeLoginRequest())
    expect(result.token).toBe('mock-token-local-dev')
    expect(result.user.firstName).toBe('Admin')
  })

  it('rejects with error message for invalid credentials', async () => {
    await expect(loginApi(makeLoginRequest({ email: 'wrong@test.com', password: 'bad' }))).rejects.toThrow(
      'Usuario o contraseña incorrectos',
    )
  })
})
