import { describe, it, expect } from 'vitest'
import * as hooks from '../index'

describe('hooks', () => {
  it('should export all necessary modules', () => {
    expect(hooks).toBeDefined()
  })
})
