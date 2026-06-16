import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useInputField } from './InputField.hooks'

describe('useInputField', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return default values for text type', () => {
    // Arrange & Act
    const { result } = renderHook(() => useInputField({ type: 'text' }))
    // Assert
    expect(result.current.idField).toBeDefined()
    expect(result.current.showPassword).toBe(false)
    expect(result.current.typeField).toBe('text')
    expect(typeof result.current.handleClassSlot).toBe('function')
    expect(typeof result.current.handleChangeTypePassword).toBe('function')
  })

  it('should return correct typeField for password when showPassword is false', () => {
    // Arrange & Act
    const { result } = renderHook(() => useInputField({ type: 'password' }))
    // Assert
    expect(result.current.typeField).toBe('password')
  })

  it('should return correct typeField for password when showPassword is true', () => {
    // Arrange
    const { result } = renderHook(() => useInputField({ type: 'password' }))
    // Act
    act(() => {
      result.current.handleChangeTypePassword()
    })
    // Assert
    expect(result.current.showPassword).toBe(true)
    expect(result.current.typeField).toBe('text')
  })

  it('should toggle showPassword correctly', () => {
    // Arrange
    const { result } = renderHook(() => useInputField({ type: 'password' }))
    expect(result.current.showPassword).toBe(false)
    // Act
    act(() => {
      result.current.handleChangeTypePassword()
    })
    expect(result.current.showPassword).toBe(true)
    act(() => {
      result.current.handleChangeTypePassword()
    })
    // Assert
    expect(result.current.showPassword).toBe(false)
  })

  it('should generate unique idField', () => {
    // Arrange & Act
    const { result: result1 } = renderHook(() =>
      useInputField({ type: 'text' })
    )
    const { result: result2 } = renderHook(() =>
      useInputField({ type: 'text' })
    )
    // Assert
    expect(result1.current.idField).not.toBe(result2.current.idField)
  })

  it('should return correct classes for text type left position', () => {
    // Arrange
    const { result } = renderHook(() => useInputField({ type: 'text' }))
    // Act
    const classes = result.current.handleClassSlot('text', 'left')
    // Assert
    expect(classes).toContain('px-3')
    expect(classes).toContain(
      'flex items-center justify-left min-w-5 text-xs text-slate-900 font-semibold h-10'
    )
    expect(classes).toContain('[&>svg]:size-5')
  })

  it('should return correct classes for email type left position', () => {
    // Arrange
    const { result } = renderHook(() => useInputField({ type: 'email' }))
    // Act
    const classes = result.current.handleClassSlot('email', 'left')
    // Assert
    expect(classes).toContain('pr-3')
    expect(classes).not.toContain('px-3')
  })

  it('should return correct classes for password type right position', () => {
    // Arrange
    const { result } = renderHook(() => useInputField({ type: 'password' }))
    // Act
    const classes = result.current.handleClassSlot('password', 'right')
    // Assert
    expect(classes).toContain('pl-3 pr-3')
  })

  it('should return correct classes for text type right position', () => {
    // Arrange
    const { result } = renderHook(() => useInputField({ type: 'text' }))
    // Act
    const classes = result.current.handleClassSlot('text', 'right')
    // Assert
    expect(classes).toContain('px-3')
  })

  it('should default to text type when no type provided', () => {
    // Arrange & Act
    const { result } = renderHook(() => useInputField({}))
    // Assert
    expect(result.current.typeField).toBe('text')
  })
})
