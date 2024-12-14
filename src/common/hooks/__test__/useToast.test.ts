import { renderHook, act } from '@testing-library/react'
import { useToast } from '../useToast'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { EStatusType } from '@Enums/statusType'
import { toast } from 'sonner'

vi.mock('sonner', () => {
  const toastMock = vi.fn()
  return {
    toast: Object.assign(toastMock, {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    }),
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useToast', () => {
  it('should call toast.default for default type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.openToast({
        title: 'Default Toast',
        type: EStatusType.DEFAULT,
        message: 'This is a default toast',
      })
    })

    expect(toast).toHaveBeenCalledWith('Default Toast', {
      description: 'This is a default toast',
    })
  })

  it('should call toast.success for success type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.openToast({
        title: 'Success Toast',
        type: EStatusType.SUCCESS,
        message: 'This is a success toast',
      })
    })

    expect(toast.success).toHaveBeenCalledWith('Success Toast', {
      description: 'This is a success toast',
    })
  })

  it('should call toast.error for error type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.openToast({
        title: 'Error Toast',
        type: EStatusType.ERROR,
        message: 'This is an error toast',
      })
    })

    expect(toast.error).toHaveBeenCalledWith('Error Toast', {
      description: 'This is an error toast',
    })
  })

  it('should call toast.info for info type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.openToast({
        title: 'Info Toast',
        type: EStatusType.INFO,
        message: 'This is an info toast',
      })
    })

    expect(toast.info).toHaveBeenCalledWith('Info Toast', {
      description: 'This is an info toast',
    })
  })

  it('should call toast.warning for warning type', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.openToast({
        title: 'Warning Toast',
        type: EStatusType.WARNING,
        message: 'This is a warning toast',
      })
    })

    expect(toast.warning).toHaveBeenCalledWith('Warning Toast', {
      description: 'This is a warning toast',
    })
  })

  it('should pass custom toastProps', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.openToast({
        title: 'Custom Toast',
        type: EStatusType.DEFAULT,
        message: 'This is a custom toast',
        toastProps: { duration: 5000 },
      })
    })

    expect(toast).toHaveBeenCalledWith('Custom Toast', {
      description: 'This is a custom toast',
      duration: 5000,
    })
  })
})
