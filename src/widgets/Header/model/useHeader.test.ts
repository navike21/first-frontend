import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useHeader } from './useHeader'
import { useSidebarStore } from '../../Sidebar/model/store'
import { useSessionStore } from '@/shared/model'
import type { AuthUser } from '@/shared/types'

const navigateMock = vi.fn().mockResolvedValue(undefined)

const { useGlobalLoadingMock } = vi.hoisted(() => ({
  useGlobalLoadingMock: vi.fn(() => false),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useRouter: () => ({ navigate: navigateMock }),
  }
})

vi.mock('@/shared/lib/useGlobalLoading', () => ({
  useGlobalLoading: useGlobalLoadingMock,
}))

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

// Factory
const makeAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@navike21.com',
  permissions: [],
  ...overrides,
})

describe('useHeader', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    navigateMock.mockResolvedValue(undefined)
    useGlobalLoadingMock.mockReturnValue(false)
    mockStorage.clear()
    useSidebarStore.setState({ isCollapsed: false, isOpenMobile: false })
    useSessionStore.setState({
      isAuthenticated: false,
      token: null,
      user: null,
    })
  })

  it('should return user from session store when authenticated', () => {
    // Arrange
    const mockUser = makeAuthUser()
    useSessionStore.setState({
      user: mockUser,
      isAuthenticated: true,
      token: 'tok',
    })
    // Act
    const { result } = renderHook(() => useHeader())
    // Assert
    expect(result.current.user).toEqual(mockUser)
  })

  it('should return null user when not authenticated', () => {
    // Arrange & Act
    const { result } = renderHook(() => useHeader())
    // Assert
    expect(result.current.user).toBeNull()
  })

  it('should clear session and navigate to login on logout', () => {
    // Arrange
    const mockUser = makeAuthUser()
    useSessionStore.setState({
      isAuthenticated: true,
      token: 'tok',
      user: mockUser,
    })
    const { result } = renderHook(() => useHeader())
    // Act
    act(() => {
      result.current.logout()
    })
    // Assert
    expect(navigateMock).toHaveBeenCalledWith({ to: '/es/iniciar-sesion' })
    expect(useSessionStore.getState().isAuthenticated).toBe(false)
  })

  it('should toggle isSettingsOpen when toggleSettings is called', () => {
    const { result } = renderHook(() => useHeader())
    expect(result.current.isSettingsOpen).toBe(false)
    act(() => {
      result.current.toggleSettings()
    })
    expect(result.current.isSettingsOpen).toBe(true)
    act(() => {
      result.current.toggleSettings()
    })
    expect(result.current.isSettingsOpen).toBe(false)
  })

  it('should set isSettingsOpen to false when closeSettings is called', () => {
    const { result } = renderHook(() => useHeader())
    act(() => {
      result.current.toggleSettings()
    })
    expect(result.current.isSettingsOpen).toBe(true)
    act(() => {
      result.current.closeSettings()
    })
    expect(result.current.isSettingsOpen).toBe(false)
  })

  it('should toggle isCollapsed in sidebar store when toggleSidebar is called', () => {
    // Arrange
    const { result } = renderHook(() => useHeader())
    // Act
    act(() => {
      result.current.toggleSidebar()
    })
    // Assert
    expect(useSidebarStore.getState().isCollapsed).toBe(true)
  })

  it('should toggle isOpenMobile in sidebar store when toggleMobileSidebar is called', () => {
    // Arrange
    const { result } = renderHook(() => useHeader())
    // Act
    act(() => {
      result.current.toggleMobileSidebar()
    })
    // Assert
    expect(useSidebarStore.getState().isOpenMobile).toBe(true)
  })

  it('should expose isCollapsed value from sidebar store', () => {
    // Arrange
    useSidebarStore.setState({ isCollapsed: true })
    // Act
    const { result } = renderHook(() => useHeader())
    // Assert
    expect(result.current.isCollapsed).toBe(true)
  })

  it('should expose isLoading from useGlobalLoading', () => {
    useGlobalLoadingMock.mockReturnValue(true)
    const { result } = renderHook(() => useHeader())
    expect(result.current.isLoading).toBe(true)
  })

  it('catch handler does not throw when navigate rejects on logout', async () => {
    navigateMock.mockRejectedValueOnce(new Error('Navigation failed'))
    const { result } = renderHook(() => useHeader())
    await expect(async () => {
      act(() => {
        result.current.logout()
      })
    }).not.toThrow()
  })
})
