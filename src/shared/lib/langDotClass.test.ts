import { describe, it, expect } from 'vitest'
import { langDotClass } from './langDotClass'

describe('langDotClass', () => {
  it('returns red when there is a validation error, regardless of content', () => {
    expect(langDotClass(true, true)).toBe('bg-red-500')
    expect(langDotClass(true, false)).toBe('bg-red-500')
  })

  it('returns green when filled and there is no error', () => {
    expect(langDotClass(false, true)).toBe('bg-emerald-500')
  })

  it('returns the neutral border color when empty and there is no error', () => {
    expect(langDotClass(false, false)).toBe('bg-border')
  })
})
