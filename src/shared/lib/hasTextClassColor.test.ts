import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hasTextClassColor } from './hasTextClassColor'

describe('hasTextClassColor', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return true when className contains a text- class', () => {
    // Arrange & Act & Assert
    expect(hasTextClassColor('text-red-500')).toBe(true)
  })

  it('should return true when one of many classes starts with text-', () => {
    // Arrange & Act & Assert
    expect(hasTextClassColor('font-bold text-slate-900 uppercase')).toBe(true)
  })

  it('should return false when no class starts with text-', () => {
    // Arrange & Act & Assert
    expect(hasTextClassColor('bg-white border border-gray-200')).toBe(false)
  })

  it('should return false for empty string', () => {
    // Arrange & Act & Assert
    expect(hasTextClassColor('')).toBe(false)
  })

  it('should return false when called without arguments', () => {
    // Arrange & Act & Assert
    expect(hasTextClassColor()).toBe(false)
  })

  it('should not match classes that merely contain "text-" in the middle', () => {
    // Arrange & Act & Assert
    expect(hasTextClassColor('sometext-class')).toBe(false)
  })

  it('should return true for text-white', () => {
    // Arrange & Act & Assert
    expect(hasTextClassColor('text-white')).toBe(true)
  })
})
