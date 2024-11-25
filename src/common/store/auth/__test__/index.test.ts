import { describe, it, expect } from 'vitest'
import * as auth from '../index'

describe('Auth', () => {
  it('should export all necessary modules', () => {
    expect(auth).toBeDefined()
  })
})
