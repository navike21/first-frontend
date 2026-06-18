import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OfflineQueuedError } from '@/shared/api'

const { queryErrorMock } = vi.hoisted(() => ({
  queryErrorMock: vi.fn(),
}))

vi.mock('../notify', () => ({
  notify: { queryError: queryErrorMock },
}))

import { isOfflineQueued, onQueuedOr } from './handleQueued'

describe('isOfflineQueued', () => {
  it('is true only for OfflineQueuedError', () => {
    expect(isOfflineQueued(new OfflineQueuedError('POST', '/users'))).toBe(true)
    expect(isOfflineQueued(new Error('other'))).toBe(false)
    expect(isOfflineQueued(undefined)).toBe(false)
  })
})

describe('onQueuedOr', () => {
  beforeEach(() => vi.clearAllMocks())

  it('runs the soft-success callback and skips queryError when queued', () => {
    const onQueued = vi.fn()
    onQueuedOr(onQueued)(new OfflineQueuedError('POST', '/users'))
    expect(onQueued).toHaveBeenCalledTimes(1)
    expect(queryErrorMock).not.toHaveBeenCalled()
  })

  it('falls back to notify.queryError for a real error', () => {
    const onQueued = vi.fn()
    const error = new Error('boom')
    onQueuedOr(onQueued)(error)
    expect(onQueued).not.toHaveBeenCalled()
    expect(queryErrorMock).toHaveBeenCalledWith(error)
  })
})
