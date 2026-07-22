import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { ForgotPasswordFormData } from './forgotPassword.schema'
import type { ForgotPasswordResponse } from '../api/types'

const { forgotPasswordApiMock } = vi.hoisted(() => ({
  forgotPasswordApiMock:
    vi.fn<(body: ForgotPasswordFormData) => Promise<ForgotPasswordResponse>>(),
}))

vi.mock('../api/forgotPassword.api', () => ({
  forgotPasswordApi: forgotPasswordApiMock,
}))

import { useForgotPassword } from './useForgotPassword'

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
  forgotPasswordApiMock.mockReset()
})

describe('useForgotPassword', () => {
  it('should return initial state', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useForgotPassword(), { wrapper })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.successMessage).toBeNull()
    expect(result.current.errorMessage).toBeNull()
  })

  it('should expose the backend message on success', async () => {
    forgotPasswordApiMock.mockResolvedValueOnce({
      message: 'Si el correo existe, te enviamos un enlace.',
    })
    const wrapper = createWrapper()
    const { result } = renderHook(() => useForgotPassword(), { wrapper })

    act(() => {
      result.current.requestReset({ email: 'ana@navike21.com' })
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.successMessage).toBe(
      'Si el correo existe, te enviamos un enlace.'
    )
  })

  it('should expose the error message on failure', async () => {
    forgotPasswordApiMock.mockRejectedValueOnce(new Error('Network error'))
    const wrapper = createWrapper()
    const { result } = renderHook(() => useForgotPassword(), { wrapper })

    act(() => {
      result.current.requestReset({ email: 'ana@navike21.com' })
    })
    await waitFor(() => expect(result.current.errorMessage).not.toBeNull())

    expect(result.current.errorMessage).toBe('Network error')
    expect(result.current.isSuccess).toBe(false)
  })
})
