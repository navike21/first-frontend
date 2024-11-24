import {
  getItemLocalStorage,
  removeItemLocalStorage,
  setItemLocalStorage,
} from '@Utils/localStorage'
import { describe, it, expect } from 'vitest'

describe('localStorage utility functions', () => {
  const key = 'testKey'
  const value = 'testValue'

  it('should set an item in localStorage', () => {
    setItemLocalStorage(key, value)
    expect(localStorage.getItem(key)).toBe(value)
  })

  it('should get an item from localStorage', () => {
    localStorage.setItem(key, value)
    expect(getItemLocalStorage(key)).toBe(value)
  })

  it('should remove an item from localStorage', () => {
    localStorage.setItem(key, value)
    removeItemLocalStorage(key)
    expect(localStorage.getItem(key)).toBeNull()
  })
})
