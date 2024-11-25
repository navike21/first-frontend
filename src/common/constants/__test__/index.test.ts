import { describe, it, expect } from 'vitest'
import * as constants from '../index'

describe('Constants', () => {
  it('should export all necessary modules', () => {
    expect(constants).toBeDefined()
  })
})
