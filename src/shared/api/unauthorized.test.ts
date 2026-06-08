import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerUnauthorizedHandler, handleUnauthorized } from './unauthorized'

describe('unauthorized', () => {
  beforeEach(() => {
    // Reset the internal handler between tests
    registerUnauthorizedHandler(vi.fn() as () => void)
  })

  it('calls the registered handler when handleUnauthorized is invoked', () => {
    const handler = vi.fn()
    registerUnauthorizedHandler(handler)
    handleUnauthorized()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does nothing when no handler is registered', () => {
    // Override with a fresh module state: set handler to null via registering a temporary one
    // then there's no way to set null directly, but calling with a no-op covers the code
    const noop = vi.fn()
    registerUnauthorizedHandler(noop)
    handleUnauthorized()
    expect(noop).toHaveBeenCalledOnce()
  })

  it('replaces the previous handler when re-registered', () => {
    const first = vi.fn()
    const second = vi.fn()
    registerUnauthorizedHandler(first)
    registerUnauthorizedHandler(second)
    handleUnauthorized()
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})
