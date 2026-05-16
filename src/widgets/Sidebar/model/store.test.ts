import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSidebarStore } from './store'

const initialState = { isCollapsed: false, isOpenMobile: false }

describe('useSidebarStore', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useSidebarStore.setState(initialState)
  })

  it('should start with isCollapsed false and isOpenMobile false', () => {
    // Arrange & Act
    const { isCollapsed, isOpenMobile } = useSidebarStore.getState()
    // Assert
    expect(isCollapsed).toBe(false)
    expect(isOpenMobile).toBe(false)
  })

  describe('toggleSidebar', () => {
    it('should toggle isCollapsed from false to true', () => {
      // Arrange — store starts with isCollapsed: false
      // Act
      useSidebarStore.getState().toggleSidebar()
      // Assert
      expect(useSidebarStore.getState().isCollapsed).toBe(true)
    })

    it('should toggle isCollapsed back to false after two calls', () => {
      // Arrange & Act
      useSidebarStore.getState().toggleSidebar()
      useSidebarStore.getState().toggleSidebar()
      // Assert
      expect(useSidebarStore.getState().isCollapsed).toBe(false)
    })
  })

  describe('toggleMobileSidebar', () => {
    it('should toggle isOpenMobile from false to true', () => {
      // Arrange — store starts with isOpenMobile: false
      // Act
      useSidebarStore.getState().toggleMobileSidebar()
      // Assert
      expect(useSidebarStore.getState().isOpenMobile).toBe(true)
    })

    it('should toggle isOpenMobile back to false after two calls', () => {
      // Arrange & Act
      useSidebarStore.getState().toggleMobileSidebar()
      useSidebarStore.getState().toggleMobileSidebar()
      // Assert
      expect(useSidebarStore.getState().isOpenMobile).toBe(false)
    })
  })

  describe('closeMobileSidebar', () => {
    it('should set isOpenMobile to false', () => {
      // Arrange
      useSidebarStore.setState({ isOpenMobile: true })
      // Act
      useSidebarStore.getState().closeMobileSidebar()
      // Assert
      expect(useSidebarStore.getState().isOpenMobile).toBe(false)
    })
  })

  describe('setCollapsed', () => {
    it('should set isCollapsed to true', () => {
      // Arrange — store starts with isCollapsed: false
      // Act
      useSidebarStore.getState().setCollapsed(true)
      // Assert
      expect(useSidebarStore.getState().isCollapsed).toBe(true)
    })

    it('should set isCollapsed to false', () => {
      // Arrange
      useSidebarStore.setState({ isCollapsed: true })
      // Act
      useSidebarStore.getState().setCollapsed(false)
      // Assert
      expect(useSidebarStore.getState().isCollapsed).toBe(false)
    })
  })
})
