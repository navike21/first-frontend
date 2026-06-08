import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TOKEN_KEY } from '@/shared/model'

const navigateMock = vi.fn().mockResolvedValue(undefined)
const clearSessionMock = vi.fn()

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useRouter: () => ({ navigate: navigateMock }),
  }
})

vi.mock('@/shared/model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/model')>()
  return {
    ...actual,
    useSessionStore: (selector: (s: { clearSession: () => void }) => unknown) =>
      selector({ clearSession: clearSessionMock }),
  }
})

import { useSessionSync } from './useSessionSync'

/** Builds the persist JSON blob that parseStoredToken reads. */
const makePersistedBlob = (token: string | null): string =>
  JSON.stringify({
    state: { isAuthenticated: token !== null, token, user: null },
    version: 0,
  })

describe('useSessionSync', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    navigateMock.mockResolvedValue(undefined)
  })

  it('should register a storage event listener on mount', () => {
    // Arrange
    const addSpy = vi.spyOn(globalThis, 'addEventListener')
    // Act
    renderHook(() => useSessionSync())
    // Assert
    expect(addSpy).toHaveBeenCalledWith('storage', expect.any(Function))
    addSpy.mockRestore()
  })

  it('should remove the storage event listener on unmount', () => {
    // Arrange
    const removeSpy = vi.spyOn(globalThis, 'removeEventListener')
    // Act
    const { unmount } = renderHook(() => useSessionSync())
    unmount()
    // Assert
    expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function))
    removeSpy.mockRestore()
  })

  it('should call clearSession and navigate to /no-autorizado when token is cleared in another tab', () => {
    // Arrange
    renderHook(() => useSessionSync())
    const event = new StorageEvent('storage', {
      key: TOKEN_KEY,
      oldValue: makePersistedBlob('tok-123'),
      newValue: makePersistedBlob(null),
    })
    // Act
    globalThis.dispatchEvent(event)
    // Assert
    expect(clearSessionMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith({ to: '/no-autorizado' })
  })

  it('should navigate to / when token is set in another tab', () => {
    // Arrange
    renderHook(() => useSessionSync())
    const event = new StorageEvent('storage', {
      key: TOKEN_KEY,
      oldValue: makePersistedBlob(null),
      newValue: makePersistedBlob('tok-new'),
    })
    // Act
    globalThis.dispatchEvent(event)
    // Assert
    expect(clearSessionMock).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith({ to: '/' })
  })

  it('should ignore storage events for other keys', () => {
    // Arrange
    renderHook(() => useSessionSync())
    const event = new StorageEvent('storage', {
      key: 'some-other-key',
      oldValue: null,
      newValue: 'value',
    })
    // Act
    globalThis.dispatchEvent(event)
    // Assert
    expect(clearSessionMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('catch handler does not throw when navigate rejects on token clear', () => {
    navigateMock.mockRejectedValueOnce(new Error('Navigation failed'))
    renderHook(() => useSessionSync())
    const event = new StorageEvent('storage', {
      key: TOKEN_KEY,
      oldValue: makePersistedBlob('tok-abc'),
      newValue: makePersistedBlob(null),
    })
    expect(() => globalThis.dispatchEvent(event)).not.toThrow()
  })

  it('catch handler does not throw when navigate rejects on token set', () => {
    navigateMock.mockRejectedValueOnce(new Error('Navigation failed'))
    renderHook(() => useSessionSync())
    const event = new StorageEvent('storage', {
      key: TOKEN_KEY,
      oldValue: makePersistedBlob(null),
      newValue: makePersistedBlob('tok-new'),
    })
    expect(() => globalThis.dispatchEvent(event)).not.toThrow()
  })

  it('should not navigate when oldValue contains malformed JSON', () => {
    // Arrange — triggers the catch block in parseStoredToken
    renderHook(() => useSessionSync())
    const event = new StorageEvent('storage', {
      key: TOKEN_KEY,
      oldValue: 'not-valid-json',
      newValue: null,
    })
    // Act
    globalThis.dispatchEvent(event)
    // Assert — prevToken = null (catch), nextToken = null → no action
    expect(clearSessionMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
