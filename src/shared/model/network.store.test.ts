import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useNetworkStore } from './network.store'

describe('useNetworkStore', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useNetworkStore.setState({ isOnline: true })
  })

  describe('initial state', () => {
    it('should reflect navigator.onLine on initialisation', () => {
      // Arrange — jsdom defaults navigator.onLine to true
      // Act
      const { isOnline } = useNetworkStore.getState()
      // Assert
      expect(isOnline).toBe(true)
    })
  })

  describe('setOffline', () => {
    it('should set isOnline to false', () => {
      // Arrange
      useNetworkStore.setState({ isOnline: true })
      // Act
      useNetworkStore.getState().setOffline()
      // Assert
      expect(useNetworkStore.getState().isOnline).toBe(false)
    })
  })

  describe('setOnline', () => {
    it('should set isOnline to true', () => {
      // Arrange
      useNetworkStore.setState({ isOnline: false })
      // Act
      useNetworkStore.getState().setOnline()
      // Assert
      expect(useNetworkStore.getState().isOnline).toBe(true)
    })
  })
})
