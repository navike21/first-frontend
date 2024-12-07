import { describe, it, expect } from 'vitest'
import { getBrowserLanguage } from '../getBrowserLanguage'

describe('getBrowserLanguage', () => {
  it('should return the browser language', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })

    const language = getBrowserLanguage()
    expect(language).toBe('en')
  })

  it('should return the default language if navigator.language is not defined', () => {
    Object.defineProperty(navigator, 'language', {
      value: undefined,
      configurable: true,
    })

    const language = getBrowserLanguage()
    expect(language).toBe('en')
  })
})
