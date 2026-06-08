import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { hasPermission, useHasPermission } from './permissions'
import { useSessionStore } from '@/shared/model'

describe('hasPermission', () => {
  it('returns true when permissions includes wildcard *:*', () => {
    expect(hasPermission(['*:*'], 'users:read')).toBe(true)
  })

  it('returns true when one of the required permissions is present', () => {
    expect(hasPermission(['users:read', 'users:write'], 'users:read')).toBe(true)
  })

  it('returns true when multiple required permissions match', () => {
    expect(hasPermission(['users:read', 'users:delete'], 'users:write', 'users:delete')).toBe(true)
  })

  it('returns false when no required permissions match', () => {
    expect(hasPermission(['users:read'], 'users:write', 'users:delete')).toBe(false)
  })

  it('returns false for empty permissions array', () => {
    expect(hasPermission([], 'users:read')).toBe(false)
  })

  it('returns false when wildcard is absent and no match', () => {
    expect(hasPermission(['admin:read'], '*:*')).toBe(false)
  })
})

describe('useHasPermission', () => {
  beforeEach(() => {
    useSessionStore.setState({ isAuthenticated: false, token: null, user: null })
  })

  it('returns false when user has no permissions', () => {
    useSessionStore.setState({
      isAuthenticated: true,
      token: 'tok',
      user: {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        permissions: [],
      },
    })
    const { result } = renderHook(() => useHasPermission('users:read'))
    expect(result.current).toBe(false)
  })

  it('returns true when user has the required permission', () => {
    useSessionStore.setState({
      isAuthenticated: true,
      token: 'tok',
      user: {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        permissions: ['users:read'],
      },
    })
    const { result } = renderHook(() => useHasPermission('users:read'))
    expect(result.current).toBe(true)
  })

  it('returns true when user has wildcard permission', () => {
    useSessionStore.setState({
      isAuthenticated: true,
      token: 'tok',
      user: {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        permissions: ['*:*'],
      },
    })
    const { result } = renderHook(() => useHasPermission('users:delete'))
    expect(result.current).toBe(true)
  })

  it('returns false when user is null (null-coalescing branch)', () => {
    useSessionStore.setState({ isAuthenticated: false, token: null, user: null })
    const { result } = renderHook(() => useHasPermission('users:read'))
    expect(result.current).toBe(false)
  })
})
