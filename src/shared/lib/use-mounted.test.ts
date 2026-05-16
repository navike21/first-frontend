import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMounted } from './use-mounted'

describe('useMounted', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return true in jsdom (client environment)', () => {
    // Arrange & Act
    const { result } = renderHook(() => useMounted())
    // Assert
    expect(result.current).toBe(true)
  })
})
