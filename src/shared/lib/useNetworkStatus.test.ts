import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  setOnlineMock,
  setOfflineMock,
  replayQueueMock,
  toastSuccessMock,
  toastWarningMock,
  toastErrorMock,
} = vi.hoisted(() => ({
  setOnlineMock: vi.fn(),
  setOfflineMock: vi.fn(),
  replayQueueMock: vi.fn<() => Promise<void>>(),
  toastSuccessMock: vi.fn(),
  toastWarningMock: vi.fn(),
  toastErrorMock: vi.fn(),
}))

vi.mock('@/shared/model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/model')>()
  return {
    ...actual,
    useNetworkStore: (
      selector: (s: { setOnline: () => void; setOffline: () => void }) => unknown,
    ) => selector({ setOnline: setOnlineMock, setOffline: setOfflineMock }),
  }
})

vi.mock('@/shared/lib/offline-queue/queue.replay', () => ({
  replayQueue: replayQueueMock,
}))

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccessMock,
    warning: toastWarningMock,
    error: toastErrorMock,
  },
}))

import { useNetworkStatus } from './useNetworkStatus'

describe('useNetworkStatus', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    replayQueueMock.mockResolvedValue(undefined)
  })

  it('should register online and offline event listeners on mount', () => {
    // Arrange
    const addSpy = vi.spyOn(globalThis, 'addEventListener')
    // Act
    renderHook(() => useNetworkStatus())
    // Assert
    expect(addSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addSpy).toHaveBeenCalledWith('offline', expect.any(Function))
    addSpy.mockRestore()
  })

  it('should remove event listeners on unmount', () => {
    // Arrange
    const removeSpy = vi.spyOn(globalThis, 'removeEventListener')
    // Act
    const { unmount } = renderHook(() => useNetworkStatus())
    unmount()
    // Assert
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function))
    removeSpy.mockRestore()
  })

  it('should call setOffline and show warning toast when going offline', () => {
    // Arrange
    renderHook(() => useNetworkStatus())
    // Act
    globalThis.dispatchEvent(new Event('offline'))
    // Assert
    expect(setOfflineMock).toHaveBeenCalledTimes(1)
    expect(toastWarningMock).toHaveBeenCalledTimes(1)
  })

  it('should call setOnline and replayQueue when coming online', async () => {
    // Arrange
    renderHook(() => useNetworkStatus())
    // Act
    await act(async () => {
      globalThis.dispatchEvent(new Event('online'))
    })
    // Assert
    expect(setOnlineMock).toHaveBeenCalledTimes(1)
    expect(replayQueueMock).toHaveBeenCalledTimes(1)
    expect(toastSuccessMock).toHaveBeenCalledTimes(1)
  })

  it('should show error toast when replayQueue fails', async () => {
    // Arrange
    replayQueueMock.mockRejectedValue(new Error('sync failed'))
    renderHook(() => useNetworkStatus())
    // Act
    await act(async () => {
      globalThis.dispatchEvent(new Event('online'))
    })
    // Assert
    expect(toastErrorMock).toHaveBeenCalledTimes(1)
    expect(toastSuccessMock).not.toHaveBeenCalled()
  })
})
