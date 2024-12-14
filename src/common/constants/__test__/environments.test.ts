import { describe, it, expect } from 'vitest'
import { environments } from '../environments'

describe('environments', () => {
  it('should have VITE_API_URL defined', () => {
    expect(environments.VITE_API_URL).toBeDefined()
  })

  it('VITE_API_URL should be a string', () => {
    expect(typeof environments.VITE_API_URL).toBe('string')
  })

  it('VITE_API_URL should be a valid url', () => {
    expect(() => new URL(environments.VITE_API_URL)).not.toThrow()
  })

  it('should have VITE_ENCRYPTION_KEY defined', () => {
    expect(environments.VITE_ENCRYPTION_KEY).toBeDefined()
  })

  it('VITE_ENCRYPTION_KEY should be a string', () => {
    expect(typeof environments.VITE_ENCRYPTION_KEY).toBe('string')
  })

  it('VITE_ENCRYPTION_KEY should be 32 characters long', () => {
    expect(environments.VITE_ENCRYPTION_KEY.length).toBe(32)
  })

  it('should have VITE_ENCRYPTION_IV defined', () => {
    expect(environments.VITE_ENCRYPTION_IV).toBeDefined()
  })

  it('VITE_ENCRYPTION_IV should be a string', () => {
    expect(typeof environments.VITE_ENCRYPTION_IV).toBe('string')
  })

  it('VITE_ENCRYPTION_IV should be 16 characters long', () => {
    expect(environments.VITE_ENCRYPTION_IV.length).toBe(16)
  })
})
