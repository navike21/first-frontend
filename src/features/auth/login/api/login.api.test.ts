import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { LoginRequest, LoginResponse } from './types'
import { loginApi } from './login.api'

vi.mock('@/shared/api', () => ({
  authService: {
    signIn: (username: string, password: string): Promise<LoginResponse> => {
      if (username === 'admin' && password === 'admin123') {
        return Promise.resolve({
          token: 'mock-token-local-dev',
          user: { id: '1', name: 'Admin First', email: 'admin' },
        })
      }
      return Promise.reject(new Error('Usuario o contraseña incorrectos'))
    },
  },
}))

const makeLoginRequest = (overrides?: Partial<LoginRequest>): LoginRequest => ({
  username: 'admin',
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
    expect(result.user.name).toBe('Admin First')
  })

  it('rejects with error message for invalid credentials', async () => {
    await expect(loginApi(makeLoginRequest({ username: 'wrong', password: 'bad' }))).rejects.toThrow(
      'Usuario o contraseña incorrectos',
    )
  })
})
