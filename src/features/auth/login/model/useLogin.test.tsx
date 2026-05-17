import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useSessionStore } from '@/shared/model'
import { HttpError } from '@/shared/api'
import type { AuthUser } from '@/shared/types'
import type { LoginFormData } from './login.schema'
import type { LoginResponse } from '../api/types'

// ---------------------------------------------------------------------------
// Hoisted mocks (must be defined before vi.mock factories are evaluated)
// ---------------------------------------------------------------------------
const { loginApiMock } = vi.hoisted(() => ({
  loginApiMock: vi.fn<(body: LoginFormData) => Promise<LoginResponse>>(),
}))

vi.mock('../api/login.api', () => ({
  loginApi: loginApiMock,
}))

const navigateMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useRouter: () => ({ navigate: navigateMock }),
  }
})

// ---------------------------------------------------------------------------
// localStorage stub
// ---------------------------------------------------------------------------
const mockStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = value
    },
    removeItem: (key: string): void => {
      delete store[key]
    },
    clear: (): void => {
      store = {}
    },
  }
})()

vi.stubGlobal('localStorage', mockStorage)

// ---------------------------------------------------------------------------
// Import unit under test AFTER mocks are declared
// ---------------------------------------------------------------------------
import { useLogin } from './useLogin'

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------
const makeAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: '1',
  email: 'test@navike21.com',
  firstName: 'Test',
  lastName: 'User',
  permissions: [],
  ...overrides,
})

const makeLoginFormData = (
  overrides?: Partial<LoginFormData>
): LoginFormData => ({
  email: 'j.chaponan@navike21.com',
  password: 'admin123',
  ...overrides,
})

// ---------------------------------------------------------------------------
// Isolated QueryClient wrapper — fresh instance per test
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  loginApiMock.mockReset()
  navigateMock.mockClear()
  mockStorage.clear()
  useSessionStore.setState({ isAuthenticated: false, token: null, user: null })
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('useLogin', () => {
  it('should return null errorMessage and false isPending in initial state', () => {
    // Arrange
    const wrapper = createWrapper()

    // Act
    const { result } = renderHook(() => useLogin(), { wrapper })

    // Assert
    expect(result.current.errorMessage).toBeNull()
    expect(result.current.isPending).toBe(false)
  })

  it('should expose a login function', () => {
    // Arrange
    const wrapper = createWrapper()

    // Act
    const { result } = renderHook(() => useLogin(), { wrapper })

    // Assert
    expect(typeof result.current.login).toBe('function')
  })

  it('should set isPending to true while mutation is in flight', async () => {
    // Arrange
    let resolvePromise!: (value: LoginResponse) => void
    loginApiMock.mockReturnValueOnce(
      new Promise<LoginResponse>((res) => {
        resolvePromise = res
      })
    )
    const wrapper = createWrapper()
    const { result } = renderHook(() => useLogin(), { wrapper })

    // Act
    act(() => {
      result.current.login(makeLoginFormData())
    })

    // Assert — wait for React Query to flush the pending state
    await waitFor(() => expect(result.current.isPending).toBe(true))

    // Cleanup — resolve to avoid unhandled promise rejection
    act(() => {
      resolvePromise({ token: 'tok', user: makeAuthUser() })
    })
    await waitFor(() => expect(result.current.isPending).toBe(false))
  })

  it('should call setSession and navigate to / on successful login', async () => {
    // Arrange
    const user = makeAuthUser()
    const token = 'tok-success-001'
    loginApiMock.mockResolvedValueOnce({ token, user })
    const wrapper = createWrapper()
    const { result } = renderHook(() => useLogin(), { wrapper })

    // Act
    act(() => {
      result.current.login(makeLoginFormData())
    })
    await waitFor(() => expect(result.current.isPending).toBe(false))

    // Assert
    expect(useSessionStore.getState().isAuthenticated).toBe(true)
    expect(useSessionStore.getState().token).toBe(token)
    expect(useSessionStore.getState().user).toEqual(user)
    expect(navigateMock).toHaveBeenCalledWith({ to: '/' })
  })

  it('should set null errorMessage after a successful login', async () => {
    // Arrange
    loginApiMock.mockResolvedValueOnce({ token: 'tok', user: makeAuthUser() })
    const wrapper = createWrapper()
    const { result } = renderHook(() => useLogin(), { wrapper })

    // Act
    act(() => {
      result.current.login(makeLoginFormData())
    })
    await waitFor(() => expect(result.current.isPending).toBe(false))

    // Assert
    expect(result.current.errorMessage).toBeNull()
  })

  it('should return formatted HttpError message when API fails with HttpError', async () => {
    // Arrange
    loginApiMock.mockRejectedValueOnce(new HttpError(401, 'Unauthorized'))
    const wrapper = createWrapper()
    const { result } = renderHook(() => useLogin(), { wrapper })

    // Act
    act(() => {
      result.current.login(makeLoginFormData())
    })
    await waitFor(() => expect(result.current.errorMessage).not.toBeNull())

    // Assert
    expect(result.current.errorMessage).toBe('Error 401: Unauthorized')
    expect(result.current.isPending).toBe(false)
  })

  it('should return error.message when API fails with a plain Error', async () => {
    // Arrange
    loginApiMock.mockRejectedValueOnce(
      new Error('Usuario o contraseña incorrectos')
    )
    const wrapper = createWrapper()
    const { result } = renderHook(() => useLogin(), { wrapper })

    // Act
    act(() => {
      result.current.login(makeLoginFormData())
    })
    await waitFor(() => expect(result.current.errorMessage).not.toBeNull())

    // Assert
    expect(result.current.errorMessage).toBe('Usuario o contraseña incorrectos')
    expect(result.current.isPending).toBe(false)
  })

  it('should not call setSession or navigate when login fails', async () => {
    // Arrange
    loginApiMock.mockRejectedValueOnce(new Error('Network error'))
    const wrapper = createWrapper()
    const { result } = renderHook(() => useLogin(), { wrapper })

    // Act
    act(() => {
      result.current.login(makeLoginFormData())
    })
    await waitFor(() => expect(result.current.errorMessage).not.toBeNull())

    // Assert
    expect(navigateMock).not.toHaveBeenCalled()
    expect(useSessionStore.getState().isAuthenticated).toBe(false)
    expect(useSessionStore.getState().token).toBeNull()
  })

  it('should show null errorMessage and isPending true when retrying after a failure', async () => {
    // Arrange — first mutation fails
    loginApiMock.mockRejectedValueOnce(new Error('Bad credentials'))
    const wrapper = createWrapper()
    const { result } = renderHook(() => useLogin(), { wrapper })

    act(() => {
      result.current.login(makeLoginFormData())
    })
    await waitFor(() => expect(result.current.errorMessage).not.toBeNull())

    // Arrange — second mutation is pending
    let resolveSecond!: (value: LoginResponse) => void
    loginApiMock.mockReturnValueOnce(
      new Promise<LoginResponse>((res) => {
        resolveSecond = res
      })
    )

    // Act — retry
    act(() => {
      result.current.login(makeLoginFormData())
    })

    // Assert — wait for React Query to flush the pending state
    await waitFor(() => expect(result.current.isPending).toBe(true))

    // Cleanup
    act(() => {
      resolveSecond({ token: 'tok-retry', user: makeAuthUser() })
    })
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.errorMessage).toBeNull()
  })

  it('should forward the form data to loginApi', async () => {
    // Arrange
    const formData = makeLoginFormData({
      email: 'm.garcia@navike21.com',
      password: 'secure1234',
    })
    loginApiMock.mockResolvedValueOnce({ token: 'tok', user: makeAuthUser() })
    const wrapper = createWrapper()
    const { result } = renderHook(() => useLogin(), { wrapper })

    // Act
    act(() => {
      result.current.login(formData)
    })
    await waitFor(() => expect(result.current.isPending).toBe(false))

    // Assert — TanStack Query v5 passes a second context argument to mutationFn
    expect(loginApiMock).toHaveBeenCalledWith(formData, expect.anything())
  })
})
