import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import {
  usePresenceStore,
  getUserAvatarStatus,
  useUserAvatarStatus,
} from './presence.store'

describe('usePresenceStore', () => {
  beforeEach(() => {
    usePresenceStore.setState({ presenceByUserId: {} })
  })

  describe('setOnlineUsers', () => {
    it('marks listed users as available', () => {
      usePresenceStore.getState().setOnlineUsers(['u1', 'u2'])
      const state = usePresenceStore.getState().presenceByUserId
      expect(state['u1']).toBe('available')
      expect(state['u2']).toBe('available')
    })

    it('does not downgrade a user already set to busy', () => {
      usePresenceStore.setState({ presenceByUserId: { u1: 'busy' } })
      usePresenceStore.getState().setOnlineUsers(['u1'])
      expect(usePresenceStore.getState().presenceByUserId['u1']).toBe('busy')
    })

    it('upgrades offline user to available', () => {
      usePresenceStore.setState({ presenceByUserId: { u1: 'offline' } })
      usePresenceStore.getState().setOnlineUsers(['u1'])
      expect(usePresenceStore.getState().presenceByUserId['u1']).toBe(
        'available'
      )
    })
  })

  describe('setUserPresence', () => {
    it('sets presence status for a user', () => {
      usePresenceStore.getState().setUserPresence('u1', 'busy')
      expect(usePresenceStore.getState().presenceByUserId['u1']).toBe('busy')
    })

    it('updates existing presence status', () => {
      usePresenceStore.getState().setUserPresence('u1', 'available')
      usePresenceStore.getState().setUserPresence('u1', 'away')
      expect(usePresenceStore.getState().presenceByUserId['u1']).toBe('away')
    })

    it('sets status to offline', () => {
      usePresenceStore.getState().setUserPresence('u2', 'offline')
      expect(usePresenceStore.getState().presenceByUserId['u2']).toBe('offline')
    })
  })

  describe('getUserAvatarStatus', () => {
    it('returns online for available status', () => {
      usePresenceStore.getState().setUserPresence('u1', 'available')
      expect(getUserAvatarStatus('u1')).toBe('online')
    })

    it('returns busy for busy status', () => {
      usePresenceStore.getState().setUserPresence('u1', 'busy')
      expect(getUserAvatarStatus('u1')).toBe('busy')
    })

    it('returns away for away status', () => {
      usePresenceStore.getState().setUserPresence('u1', 'away')
      expect(getUserAvatarStatus('u1')).toBe('away')
    })

    it('returns offline for offline status', () => {
      usePresenceStore.getState().setUserPresence('u1', 'offline')
      expect(getUserAvatarStatus('u1')).toBe('offline')
    })

    it('returns none when user has no presence', () => {
      expect(getUserAvatarStatus('unknown-user')).toBe('none')
    })
  })

  describe('useUserAvatarStatus hook', () => {
    it('returns online for available status', () => {
      usePresenceStore.getState().setUserPresence('u1', 'available')
      const { result } = renderHook(() => useUserAvatarStatus('u1'))
      expect(result.current).toBe('online')
    })

    it('returns none when user has no presence', () => {
      const { result } = renderHook(() => useUserAvatarStatus('nobody'))
      expect(result.current).toBe('none')
    })

    it('returns busy for busy status', () => {
      usePresenceStore.getState().setUserPresence('u3', 'busy')
      const { result } = renderHook(() => useUserAvatarStatus('u3'))
      expect(result.current).toBe('busy')
    })

    it('returns away for away status', () => {
      usePresenceStore.getState().setUserPresence('u4', 'away')
      const { result } = renderHook(() => useUserAvatarStatus('u4'))
      expect(result.current).toBe('away')
    })

    it('returns offline for offline status', () => {
      usePresenceStore.getState().setUserPresence('u5', 'offline')
      const { result } = renderHook(() => useUserAvatarStatus('u5'))
      expect(result.current).toBe('offline')
    })
  })
})
