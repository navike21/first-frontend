import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  setOnlineMock,
  setOfflineMock,
  replayQueueMock,
  sizeMock,
  isTokenStoredMock,
  toastSuccessMock,
  toastWarningMock,
  toastErrorMock,
  toastInfoMock,
} = vi.hoisted(() => ({
  setOnlineMock: vi.fn(),
  setOfflineMock: vi.fn(),
  replayQueueMock:
    vi.fn<() => Promise<{ synced: number; failed: unknown[] }>>(),
  sizeMock: vi.fn<() => Promise<number>>(),
  isTokenStoredMock: vi.fn<() => boolean>(),
  toastSuccessMock: vi.fn(),
  toastWarningMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastInfoMock: vi.fn(),
}))

vi.mock('@/shared/model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/model')>()
  return {
    ...actual,
    useNetworkStore: (
      selector: (s: {
        setOnline: () => void
        setOffline: () => void
      }) => unknown
    ) => selector({ setOnline: setOnlineMock, setOffline: setOfflineMock }),
  }
})

vi.mock('@/shared/lib/offline-queue/queue.replay', () => ({
  replayQueue: replayQueueMock,
}))

vi.mock('@/shared/lib/offline-queue/queue', () => ({
  size: sizeMock,
}))

vi.mock('@/shared/model/session.store', () => ({
  isTokenStored: isTokenStoredMock,
}))

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccessMock,
    warning: toastWarningMock,
    error: toastErrorMock,
    info: toastInfoMock,
  },
}))

import { useNetworkStatus } from './useNetworkStatus'

describe('useNetworkStatus', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    replayQueueMock.mockResolvedValue({ synced: 1, failed: [] })
    sizeMock.mockResolvedValue(0)
    // No startup replay unless a test opts in.
    isTokenStoredMock.mockReturnValue(false)
  })

  it('registers online and offline listeners on mount', () => {
    const addSpy = vi.spyOn(globalThis, 'addEventListener')
    renderHook(() => useNetworkStatus())
    expect(addSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addSpy).toHaveBeenCalledWith('offline', expect.any(Function))
    addSpy.mockRestore()
  })

  it('removes the listeners on unmount', () => {
    const removeSpy = vi.spyOn(globalThis, 'removeEventListener')
    const { unmount } = renderHook(() => useNetworkStatus())
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function))
    removeSpy.mockRestore()
  })

  it('shows the connection-lost warning when going offline', () => {
    renderHook(() => useNetworkStatus())
    globalThis.dispatchEvent(new Event('offline'))
    expect(setOfflineMock).toHaveBeenCalledTimes(1)
    expect(toastWarningMock).toHaveBeenCalledTimes(1)
  })

  it('replays the queue and reports success when coming online', async () => {
    renderHook(() => useNetworkStatus())
    await act(async () => {
      globalThis.dispatchEvent(new Event('online'))
    })
    expect(setOnlineMock).toHaveBeenCalledTimes(1)
    expect(replayQueueMock).toHaveBeenCalledTimes(1)
    expect(toastSuccessMock).toHaveBeenCalledTimes(1)
  })

  it('reports a partial result with a warning when some items failed', async () => {
    replayQueueMock.mockResolvedValue({ synced: 1, failed: [{ id: 'x' }] })
    renderHook(() => useNetworkStatus())
    await act(async () => {
      globalThis.dispatchEvent(new Event('online'))
    })
    expect(toastWarningMock).toHaveBeenCalledTimes(1)
    expect(toastSuccessMock).not.toHaveBeenCalled()
  })

  it('swallows a rejected replay without crashing or toasting success', async () => {
    replayQueueMock.mockRejectedValue(new Error('boom'))
    renderHook(() => useNetworkStatus())
    await act(async () => {
      globalThis.dispatchEvent(new Event('online'))
    })
    expect(toastSuccessMock).not.toHaveBeenCalled()
  })

  it('replays on mount when online, authenticated and the queue is non-empty', async () => {
    isTokenStoredMock.mockReturnValue(true)
    sizeMock.mockResolvedValue(2)
    await act(async () => {
      renderHook(() => useNetworkStatus())
    })
    expect(replayQueueMock).toHaveBeenCalledTimes(1)
  })

  it('does not replay on mount when there is no stored session', async () => {
    isTokenStoredMock.mockReturnValue(false)
    sizeMock.mockResolvedValue(5)
    await act(async () => {
      renderHook(() => useNetworkStatus())
    })
    expect(replayQueueMock).not.toHaveBeenCalled()
  })
})
