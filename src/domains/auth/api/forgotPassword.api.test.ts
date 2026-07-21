import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ForgotPasswordResponse } from './types'
import { forgotPasswordApi } from './forgotPassword.api'

vi.mock('@/shared/api', () => ({
  authService: {
    forgotPassword: (email: string): Promise<ForgotPasswordResponse> =>
      Promise.resolve({ message: `sent to ${email}` }),
  },
}))

describe('forgotPasswordApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolves with the message returned by the auth service', async () => {
    const result = await forgotPasswordApi({ email: 'ana@navike21.com' })
    expect(result.message).toBe('sent to ana@navike21.com')
  })
})
