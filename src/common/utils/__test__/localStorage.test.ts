import {
  getItemLocalStorage,
  setItemLocalStorage,
  removeItemLocalStorage,
  clearLocalStorage,
  getItemLocalStorageObject,
  setItemLocalStorageObject,
} from '@Utils/localStorage'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('localStorage utility functions', () => {
  const key = 'testKey'
  const value = 'testValue'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should set and get an item in localStorage', () => {
    setItemLocalStorage(key, value)
    expect(localStorage.getItem(key)).toBe(value)

    const storedValue = getItemLocalStorage(key)
    expect(storedValue).toBe(value)
  })

  it('should remove an item from localStorage', () => {
    setItemLocalStorage(key, value)
    removeItemLocalStorage(key)
    expect(localStorage.getItem(key)).toBeNull()
  })

  it('should clear all items from localStorage', () => {
    localStorage.setItem('key1', 'value1')
    localStorage.setItem('key2', 'value2')
    clearLocalStorage()
    expect(localStorage.getItem('key1')).toBeNull()
    expect(localStorage.getItem('key2')).toBeNull()
  })

  it('should store and retrieve an object in localStorage', () => {
    const obj = { name: 'John', age: 30 }
    setItemLocalStorageObject(key, obj)

    const retrievedObj = getItemLocalStorageObject(key)
    expect(retrievedObj).toMatchObject(obj)
  })

  it('should return an empty object if key does not exist', () => {
    const retrievedObj = getItemLocalStorageObject('nonExistingKey')
    expect(retrievedObj).toMatchObject({})
  })

  it('should return an empty object if stored value is not valid JSON', () => {
    localStorage.setItem(key, 'invalid json')

    const retrievedObj = getItemLocalStorageObject(key)
    expect(retrievedObj).toMatchObject({})
  })
})
