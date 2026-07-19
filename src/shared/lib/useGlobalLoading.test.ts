import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGlobalLoading } from './useGlobalLoading'

const { useIsFetchingMock, useIsMutatingMock, useRouterStateMock } = vi.hoisted(
  () => ({
    useIsFetchingMock: vi.fn(() => 0),
    useIsMutatingMock: vi.fn(() => 0),
    useRouterStateMock: vi.fn(() => false),
  })
)

vi.mock('@tanstack/react-query', () => ({
  useIsFetching: useIsFetchingMock,
  useIsMutating: useIsMutatingMock,
}))

vi.mock('@tanstack/react-router', () => ({
  useRouterState: useRouterStateMock,
}))

describe('useGlobalLoading', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useIsFetchingMock.mockReturnValue(0)
    useIsMutatingMock.mockReturnValue(0)
    useRouterStateMock.mockReturnValue(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be false when nothing is loading', () => {
    const { result } = renderHook(() => useGlobalLoading())
    expect(result.current).toBe(false)
  })

  it('should stay false before the debounce delay elapses', () => {
    useIsFetchingMock.mockReturnValue(1)
    const { result } = renderHook(() => useGlobalLoading())
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe(false)
  })

  it('should become true once loading persists past the debounce delay (fetching)', () => {
    useIsFetchingMock.mockReturnValue(1)
    const { result } = renderHook(() => useGlobalLoading())
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe(true)
  })

  it('should become true when a mutation is in flight', () => {
    useIsMutatingMock.mockReturnValue(1)
    const { result } = renderHook(() => useGlobalLoading())
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe(true)
  })

  it('should become true during a router navigation', () => {
    useRouterStateMock.mockReturnValue(true)
    const { result } = renderHook(() => useGlobalLoading())
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe(true)
  })

  it('should not flicker true for a load that resolves before the debounce delay', () => {
    useIsFetchingMock.mockReturnValue(1)
    const { result, rerender } = renderHook(() => useGlobalLoading())
    act(() => {
      vi.advanceTimersByTime(80)
    })
    useIsFetchingMock.mockReturnValue(0)
    rerender()
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe(false)
  })

  it('should go back to false on the next tick once loading ends (no debounce on hide)', () => {
    useIsFetchingMock.mockReturnValue(1)
    const { result, rerender } = renderHook(() => useGlobalLoading())
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe(true)
    useIsFetchingMock.mockReturnValue(0)
    rerender()
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(result.current).toBe(false)
  })
})
