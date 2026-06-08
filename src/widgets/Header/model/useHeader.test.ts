import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useHeader } from './useHeader'
import { useSidebarStore } from '../../Sidebar/model/store'
import { useSessionStore } from '@/shared/model'
import type { AuthUser } from '@/shared/types'

const navigateMock = vi.fn().mockResolvedValue(undefined)

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useRouter: () => ({ navigate: navigateMock }),
  }
})

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

  it('should toggle isProfileOpen when toggleProfile is called', () => {
    // Arrange
    const { result } = renderHook(() => useHeader())
    expect(result.current.isProfileOpen).toBe(false)
    // Act
    act(() => {
      result.current.toggleProfile()
    })
    // Assert
    expect(result.current.isProfileOpen).toBe(true)
    // Act (second toggle)
    act(() => {
      result.current.toggleProfile()
    })
    // Assert
    expect(result.current.isProfileOpen).toBe(false)
  })

  it('should set isProfileOpen to false when closeProfile is called', () => {
    // Arrange
    const { result } = renderHook(() => useHeader())
    act(() => {
      result.current.toggleProfile()
    })
    expect(result.current.isProfileOpen).toBe(true)
    // Act
    act(() => {
      result.current.closeProfile()
    })
    // Assert
    expect(result.current.isProfileOpen).toBe(false)
  })

  it('should clear session, close profile, and navigate to /login on logout', () => {
    // Arrange
    const mockUser = makeAuthUser()
    useSessionStore.setState({
      isAuthenticated: true,
      token: 'tok',
      user: mockUser,
    })
    const { result } = renderHook(() => useHeader())
    act(() => {
      result.current.toggleProfile()
    })
    // Act
    act(() => {
      result.current.logout()
    })
    // Assert
    expect(result.current.isProfileOpen).toBe(false)
    expect(navigateMock).toHaveBeenCalledWith({ to: '/es/login' })
    expect(useSessionStore.getState().isAuthenticated).toBe(false)
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

  it('catch handler does not throw when navigate rejects on logout', async () => {
    navigateMock.mockRejectedValueOnce(new Error('Navigation failed'))
    const { result } = renderHook(() => useHeader())
    await expect(async () => {
      act(() => { result.current.logout() })
    }).not.toThrow()
  })
})
