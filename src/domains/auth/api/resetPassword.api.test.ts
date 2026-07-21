import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ResetPasswordResponse } from './types'
import { resetPasswordApi } from './resetPassword.api'

vi.mock('@/shared/api', () => ({
  authService: {
    resetPassword: (
      token: string,
      password: string
    ): Promise<ResetPasswordResponse> =>
      token === 'valid-token'
        ? Promise.resolve({ message: `password set to ${password}` })
        : Promise.reject(new Error('Invalid or expired token')),
  },
}))

describe('resetPasswordApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolves with the message returned by the auth service', async () => {
    const result = await resetPasswordApi({
      token: 'valid-token',
      password: 'NewPass1',
    })
    expect(result.message).toBe('password set to NewPass1')
  })

  it('rejects when the token is invalid', async () => {
    await expect(
      resetPasswordApi({ token: 'bad-token', password: 'NewPass1' })
    ).rejects.toThrow('Invalid or expired token')
  })
})
