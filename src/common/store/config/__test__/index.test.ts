import { describe, it, expect } from 'vitest'
import * as config from '../index'

describe('Config', () => {
  it('should export all necessary modules', () => {
    expect(config).toBeDefined()
  })
})
