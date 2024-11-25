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
})
