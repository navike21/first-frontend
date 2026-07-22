import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { HttpError } from '@/shared/api'
import type { ResetPasswordRequest, ResetPasswordResponse } from '../api/types'

const { resetPasswordApiMock } = vi.hoisted(() => ({
  resetPasswordApiMock:
    vi.fn<(body: ResetPasswordRequest) => Promise<ResetPasswordResponse>>(),
}))

vi.mock('../api/resetPassword.api', () => ({
  resetPasswordApi: resetPasswordApiMock,
}))

import { useResetPassword } from './useResetPassword'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

beforeEach(() => {
  resetPasswordApiMock.mockReset()
})

describe('useResetPassword', () => {
  it('should return initial state', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useResetPassword('some-token'), {
      wrapper,
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isInvalidToken).toBe(false)
    expect(result.current.errorMessage).toBeNull()
  })

  it('should forward the token from the hook argument along with the form password', async () => {
    resetPasswordApiMock.mockResolvedValueOnce({ message: 'ok' })
    const wrapper = createWrapper()
    const { result } = renderHook(() => useResetPassword('the-token'), {
      wrapper,
    })

    act(() => {
      result.current.resetPassword({
        password: 'Password1',
        confirmPassword: 'Password1',
      })
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(resetPasswordApiMock).toHaveBeenCalledWith({
      token: 'the-token',
      password: 'Password1',
    })
    expect(result.current.successMessage).toBe('ok')
  })

  it('should set isInvalidToken and suppress errorMessage for an INVALID_TOKEN failure', async () => {
    resetPasswordApiMock.mockRejectedValueOnce(
      new HttpError(401, 'Unauthorized', 'Token inválido o expirado', 'INVALID_TOKEN')
    )
    const wrapper = createWrapper()
    const { result } = renderHook(() => useResetPassword('bad-token'), {
      wrapper,
    })

    act(() => {
      result.current.resetPassword({
        password: 'Password1',
        confirmPassword: 'Password1',
      })
    })
    await waitFor(() => expect(result.current.isInvalidToken).toBe(true))

    expect(result.current.errorMessage).toBeNull()
  })

  it('should set errorMessage (not isInvalidToken) for any other failure', async () => {
    resetPasswordApiMock.mockRejectedValueOnce(new Error('Network error'))
    const wrapper = createWrapper()
    const { result } = renderHook(() => useResetPassword('some-token'), {
      wrapper,
    })

    act(() => {
      result.current.resetPassword({
        password: 'Password1',
        confirmPassword: 'Password1',
      })
    })
    await waitFor(() => expect(result.current.errorMessage).not.toBeNull())

    expect(result.current.errorMessage).toBe('Network error')
    expect(result.current.isInvalidToken).toBe(false)
  })
})
